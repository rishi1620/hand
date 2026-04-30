import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const bnDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function localizeNumber(num: number | string, lang: 'en' | 'bn'): string {
  const strNum = String(num);
  if (lang === 'en') return strNum;
  return strNum.replace(/[0-9]/g, d => bnDigits[d]);
}

