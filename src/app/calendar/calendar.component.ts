import { Component, Input, OnInit } from '@angular/core';

interface DayValue {
  date: Date;
  value: string;
}

interface CalendarDay {
  day: number | null;
  isCurrentMonth: boolean;
  value: string | null;
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  @Input() year: number = new Date().getFullYear();
  @Input() month: number = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  weeks: CalendarDay[][] = [];
  dayValues: DayValue[] = []; // This should be provided with the actual values

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
    const numberOfDaysInMonth = new Date(this.year, this.month, 0).getDate();

    let date = 1; // Start at the first day of the month
    this.weeks = [];

    // Create 5 weeks to cover all days of the month
    for (let i = 0; i < 5; i++) {
      const week: CalendarDay[] = [];
      
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfMonth) || date > numberOfDaysInMonth) {
          week.push({ day: null, isCurrentMonth: false, value: null });
        } else {
          const dayValue = this.dayValues.find(dv => dv.date.getDate() === date && dv.date.getMonth() + 1 === this.month && dv.date.getFullYear() === this.year);
          week.push({ day: date, isCurrentMonth: true, value: dayValue ? dayValue.value : null });
          date++;
        }
      }
      this.weeks.push(week);
    }

  }

}




