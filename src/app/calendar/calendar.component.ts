import { Component, Input, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

interface DayValue {
  date: Date;
  value: string;
}

interface ScheduleOption {
  DisplayName: string;
  DataValue: string;
  CategoryTypeColor: string;
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
export class CalendarComponent implements OnInit {
  @Input() year: number = new Date().getFullYear();
  @Input() month: number = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  weeks: CalendarDay[][] = [];
  dayValues: DayValue[] = []; // This should be provided with the actual values

  scheduleOptions: ScheduleOption[] = [
    { DisplayName: 'First Watch', DataValue: 'F', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Second Watch', DataValue: 'S', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Third Watch', DataValue: 'T', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Day Off', DataValue: 'D', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Holiday', DataValue: 'H', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Course', DataValue: 'C', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Maternity Leave', DataValue: 'M', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Extended Leave', DataValue: 'L', CategoryTypeColor: '#FFD700' },
    { DisplayName: 'Unavailable', DataValue: 'U', CategoryTypeColor: '#FFD700' }
  ];  
  
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentMonthName: string;

  // Add a property to track the currently selected day for which the popup is being shown
  selectedDay: CalendarDay | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateMonthAndYear();
    this.generateCalendar();
  }

  updateMonthAndYear(): void {
    this.currentMonthName = this.monthNames[this.month - 1];
  }

  goToPreviousMonth(): void {
    if (this.month === 1) {
      this.month = 12;
      this.year--;
    } else {
      this.month--;
    }
    this.updateMonthAndYear();
    this.generateCalendar();
  }

  goToNextMonth(): void {
    if (this.month === 12) {
      this.month = 1;
      this.year++;
    } else {
      this.month++;
    }
    this.updateMonthAndYear();
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
    const numberOfDaysInMonth = new Date(this.year, this.month, 0).getDate();
    const previousMonth = this.month - 1;
    const previousYear = previousMonth === 0 ? this.year - 1 : this.year;
    const previousMonthNumberOfDays = new Date(previousYear, previousMonth, 0).getDate();

    let date = 1;
    let previousMonthDate = previousMonthNumberOfDays - firstDayOfMonth + 1;
    this.weeks = [];

    for (let i = 0; i < 6; i++) { // 6 weeks to cover all possibilities
      const week: CalendarDay[] = [];
      
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          week.push({ day: previousMonthDate, isCurrentMonth: false, value: null });
          previousMonthDate++;
        } else if (date > numberOfDaysInMonth) {
          week.push({ day: null, isCurrentMonth: false, value: null });
        } else {
          week.push({ day: date, isCurrentMonth: true, value: null });
          date++;
        }
      }
      this.weeks.push(week);
      if (date > numberOfDaysInMonth) {
        break; // Stop creating weeks if we've run out of days in the month
      }
    }
  }

  getDayValue(day: number): string | null {
    const dayValue = this.dayValues.find(dv =>
      dv.date.getDate() === day &&
      dv.date.getMonth() + 1 === this.month &&
      dv.date.getFullYear() === this.year
    );
    return dayValue ? dayValue.value : null;
  }

  onScheduleChange(day: CalendarDay, target: EventTarget | null): void {
    // Ensure that we have an HTMLSelectElement and that the day is part of the current month
    const selectElement = target as HTMLSelectElement;
    if (day.day && day.isCurrentMonth && selectElement) {
      // Update the day's value with the new value from the dropdown
      const newValue = selectElement.value;
      const dayValue = this.dayValues.find(dv => dv.date.getDate() === day.day && dv.date.getMonth() + 1 === this.month && dv.date.getFullYear() === this.year);
      if (dayValue) {
        dayValue.value = newValue;
      } else {
        this.dayValues.push({ date: new Date(this.year, this.month - 1, day.day), value: newValue });
      }
    }
  }

  // popup select list

  showOptions(day: CalendarDay): void {
    this.selectedDay = day;
  }

  // Method to select an option from the popup
  // selectOption(value: string): void {
  //   if (this.selectedDay && this.selectedDay.day) {
  //     const updatedDayValues = [...this.dayValues]; // Create a new array
  //     const dayIndex = updatedDayValues.findIndex(dv => 
  //       dv.date.getDate() === this.selectedDay.day && 
  //       dv.date.getMonth() + 1 === this.month && 
  //       dv.date.getFullYear() === this.year
  //     );
      
  //     const newDate = new Date(this.year, this.month - 1, this.selectedDay.day);
  //     if (dayIndex !== -1) {
  //       updatedDayValues[dayIndex] = { ...updatedDayValues[dayIndex], value: value };
  //     } else {
  //       updatedDayValues.push({ date: newDate, value: value });
  //     }
  
  //     this.dayValues = updatedDayValues; // Assign the new array
  //     this.selectedDay = null;
  //     this.cdr.detectChanges();
  //   }
  // }

  selectOption(option: ScheduleOption): void {
    if (this.selectedDay) {
      this.selectedDay.value = option.DataValue;
      
      // Update the dayValues array as well
      const dayIndex = this.dayValues.findIndex(dv => 
        dv.date.getDate() === this.selectedDay.day && 
        dv.date.getMonth() + 1 === this.month && 
        dv.date.getFullYear() === this.year
      );
      
      if (dayIndex !== -1) {
        this.dayValues[dayIndex].value = option.DataValue;
      } else {
        this.dayValues.push({ date: new Date(this.year, this.month - 1, this.selectedDay.day), value: option.DataValue });
      }

      this.selectedDay = null; // Hide the popup after selection
      this.cdr.detectChanges();
    }
  }

  getDayBackgroundColor(day: number): string {
    const dayValue = this.dayValues.find(dv =>
      dv.date.getDate() === day &&
      dv.date.getMonth() + 1 === this.month &&
      dv.date.getFullYear() === this.year
    );
    if (dayValue) {
      const option = this.scheduleOptions.find(opt => opt.DataValue === dayValue.value);
      return option ? option.CategoryTypeColor : 'default-color'; // Replace 'default-color' with your default color
    }
    return 'default-color'; // Replace 'default-color' with your default color
  }

  // Method to hide the options popup
  hideOptions(): void {
    this.selectedDay = null;
  }
}
