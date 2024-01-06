import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveStylingService {

   getBackgroundColor(code: string): string {
      const colorMap: { [key: string]: string } = {
        'F': '#acc5ff',
        'S': '#acc5ff',
        'T': '#acc5ff',
        'D': '#f97a7a',
        'H': '#f97a7a',
        'C': '#7ae8f9',
        'M': '#7af9d5',
        'U': '#919191'
      };
  
      return colorMap[code] || '#000';
    }

}