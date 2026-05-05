import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function useWebRTC(roomId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef.current]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef.current]);

  useEffect(() => {
    // Initialize socket
    socketRef.current = io(window.location.origin);
    
    // Get local media
    const initMedia = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media devices API not available");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        setMediaError(null);

        socketRef.current?.emit('join-room', roomId);
      } catch (err) {
        // Suppress console error to avoid alarm in iframe preview
        // console.error("Failed to get local media", err);
        setMediaError(err instanceof Error ? err.message : "Permission denied or no devices available");
        
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No Camera Access', canvas.width / 2, canvas.height / 2);
            setInterval(() => {
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '#94a3b8';
              ctx.fillText('No Camera Access', canvas.width / 2, canvas.height / 2);
              ctx.fillText(new Date().toLocaleTimeString(), canvas.width / 2, canvas.height / 2 + 40);
            }, 1000);
          }
          const videoStream = canvas.captureStream(30);
          
          // Try to create mock audio, might fail if audio context is not allowed
          let audioStream = new MediaStream();
          try {
             // @ts-ignore
             const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
             const dest = audioCtx.createMediaStreamDestination();
             audioStream = dest.stream;
          } catch(e) {}

          const mockStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ]);
          setLocalStream(mockStream);
          socketRef.current?.emit('join-room', roomId);
        } catch (mockErr) {
          console.error("Failed to generate mock stream", mockErr);
        }
      }
    };

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on('offer', async (data: { offer: RTCSessionDescriptionInit, senderId: string }) => {
      if (!peerConnectionRef.current) createPeerConnection();
      try {
        await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current?.createAnswer();
        if (answer) {
          await peerConnectionRef.current?.setLocalDescription(answer);
          socketRef.current?.emit('answer', { answer, roomId });
        }
      } catch (e) {
        console.error("Error handling offer", e);
      }
    });

    socketRef.current.on('answer', async (data: { answer: RTCSessionDescriptionInit, senderId: string }) => {
      try {
        if (peerConnectionRef.current?.signalingState !== 'stable') {
          await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
      } catch (e) {
        console.error("Error handling answer", e);
      }
    });

    socketRef.current.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit, senderId: string }) => {
      try {
        if (data.candidate && peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (e) {
        console.error("Error adding ice candidate", e);
      }
    });

    return () => {
      socketRef.current?.off('offer');
      socketRef.current?.off('answer');
      socketRef.current?.off('ice-candidate');
    };
  }, [roomId]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit('ice-candidate', { candidate: event.candidate, roomId });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsConnected(false);
        setRemoteStream(null);
      }
    };

    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    peerConnectionRef.current = pc;
    return pc;
  }, [localStream, roomId]);

  const startCall = useCallback(async () => {
    const pc = createPeerConnection();
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit('offer', { offer, roomId });
    } catch (e) {
      console.error("Error starting call", e);
    }
  }, [createPeerConnection, roomId]);

  const endCall = useCallback(() => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    setIsConnected(false);
    setRemoteStream(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!localStream.getAudioTracks()[0]?.enabled);
    }
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!localStream.getVideoTracks()[0]?.enabled);
    }
  }, [localStream]);

  return {
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoMuted,
    isConnected,
    mediaError,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo,
  };
}
