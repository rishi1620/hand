import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui/components';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus, Clock, User, FileText } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

export default function DoctorCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate week days
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startDate, i));

  const appointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', type: 'Initial Assessment', date: weekDays[0] },
    { id: 2, patient: 'Sarah Smith', time: '10:30 AM', type: 'Remote Session', date: weekDays[0] },
    { id: 3, patient: 'Michael Johnson', time: '02:00 PM', type: 'Review', date: weekDays[1] },
    { id: 4, patient: 'Emily Davis', time: '11:00 AM', type: 'Remote Session', date: weekDays[2] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduler</h1>
          <p className="text-muted-foreground">{format(selectedDate, 'MMMM yyyy')}</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Appointment
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                 <button onClick={() => setSelectedDate(addDays(selectedDate, -7))}>&lt;</button>
                 <span className="font-semibold">{format(selectedDate, 'MMM yyyy')}</span>
                 <button onClick={() => setSelectedDate(addDays(selectedDate, 7))}>&gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground">
                 {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                 {/* Dummy calendar dates for visual representation */}
                 {Array.from({length: 30}).map((_, i) => (
                    <div 
                      key={i} 
                      className={`p-1 rounded-full cursor-pointer hover:bg-secondary  ${i+1 === selectedDate.getDate() ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}`}
                    >
                      {i + 1}
                    </div>
                 ))}
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Add</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <Label>Patient Name</Label>
                <Input placeholder="Search..." />
                <Label>Time</Label>
                <Input type="time" />
                <Button className="w-full mt-2">Schedule</Button>
             </CardContent>
          </Card>
        </div>

        {/* Weekly View / Day Details */}
        <Card className="lg:col-span-3">
           <CardHeader className="border-b bg-muted ">
              <div className="grid grid-cols-5 gap-4 text-center">
                 {weekDays.map((date, i) => (
                    <div key={i} className={`p-2 rounded-lg cursor-pointer ${date.getDate() === selectedDate.getDate() ? 'bg-white  shadow-sm border' : 'hover:bg-secondary  border border-transparent'}`} onClick={() => setSelectedDate(date)}>
                       <div className="text-xs text-muted-foreground uppercase">{format(date, 'EEE')}</div>
                       <div className={`text-lg font-bold ${date.getDate() === selectedDate.getDate() ? 'text-primary' : ''}`}>{format(date, 'd')}</div>
                    </div>
                 ))}
              </div>
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y relative h-[600px] overflow-y-auto">
                 {/* Hours column and events */}
                 {Array.from({length: 10}).map((_, i) => {
                    const hour = i + 8; // 8 AM to 5 PM
                    const isEven = i % 2 === 0;
                    return (
                       <div key={hour} className="flex relative h-20 group">
                          <div className="w-20 text-xs text-right pr-4 text-muted-foreground -mt-2.5">
                             {hour > 12 ? `${hour-12} PM` : `${hour} ${hour===12?'PM':'AM'}`}
                          </div>
                          <div className="flex-1 border-l pl-4 relative group-hover:bg-muted/50 :bg-card/20">
                             {/* Render appointments for this hour/day */}
                             {appointments.filter(a => a.date.getDate() === selectedDate.getDate() && parseInt(a.time.substring(0,2)) === (hour > 12 ? hour-12 : hour)).map(appt => (
                                <div key={appt.id} className="absolute inset-x-2 top-2 bottom-2 rounded-md bg-blue-50  border border-blue-200  p-2 text-sm">
                                   <div className="font-semibold text-blue-900 ">{appt.patient}</div>
                                   <div className="text-blue-700  text-xs flex items-center gap-2 mt-1">
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{appt.time}</span>
                                      <span className="truncate">{appt.type}</span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )
                 })}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
