import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Officer } from '../models/officer.model';
import { Leave } from "../models/leave.model";

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
  date: Date | null;
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
  @Input() officer: Officer = null;
  @Input() leave: Leave = null;
  @Input() readonly: boolean = true;
  @Input() showcolor: boolean = true;
  weeks: CalendarDay[][] = [];
  dayValues: DayValue[] = []; 

  scheduleOptions: ScheduleOption[] = [
    { DisplayName: 'First Watch', DataValue: 'F', CategoryTypeColor: '#acc5ff' },
    { DisplayName: 'Second Watch', DataValue: 'S', CategoryTypeColor: '#acc5ff' },
    { DisplayName: 'Third Watch', DataValue: 'T', CategoryTypeColor: '#acc5ff' },
    { DisplayName: 'Day Off', DataValue: 'D', CategoryTypeColor: '#f97a7a' },
    { DisplayName: 'Holiday', DataValue: 'H', CategoryTypeColor: '#f9d77a' },
    { DisplayName: 'Course', DataValue: 'C', CategoryTypeColor: '#7ae8f9' },
    { DisplayName: 'Maternity Leave', DataValue: 'M', CategoryTypeColor: '#7af9d5' },
    { DisplayName: 'Extended Leave', DataValue: 'L', CategoryTypeColor: '#b57af9' },
    { DisplayName: 'Unavailable', DataValue: 'U', CategoryTypeColor: '#919191' }
  ];  
  
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Component variables
  //
  selectedDay: CalendarDay | null = null;
  defaultackgroundColor: string = "#fefefe";

  isReadOnly: boolean = false;
  startDateRange: Date;
  endDateRange: Date;
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  endYear: number = this.year+2;
  endMonth: number = this.month+1;
  currentDate = new Date();

  currentMonthName: string;
  useBackgroundColors: boolean = true;
  popupChangeDetector: boolean = true;

  // multiple day selecion capability
  //
  selectedDays: Set<CalendarDay> = new Set();
  popupTop: string = '';
  popupLeft: string = '';

  // Listen for the escape key
  @HostListener('document:keydown.escape', ['$event'])

  ngOnInit() {

    this.isReadOnly = this.readonly;
    this.startDateRange = this.leave.startDate;
    this.endDateRange = this.leave.endDate;
    this.year = this.startDateRange.getFullYear();
    this.month = this.startDateRange.getMonth() + 1; 
    this.endYear = this.endDateRange.getFullYear();
    this.endMonth = this.endDateRange.getMonth() + 1; 

    let leaveType = this.scheduleOptions.find(dn =>
      dn.DataValue === this.leave.leaveCode);
    let curDate = new Date(this.leave.startDate.getTime()); // Create a new instance to avoid modifying the original startDate
    let lastDate = this.leave.endDate;
    while (curDate <= lastDate) {
      this.addCalendarDayValue(curDate, leaveType);
      curDate.setDate(curDate.getDate() + 1);
    }

    this.currentDate = new Date(this.leave.startDate.getTime());
    this.updateMonthAndYear();
    this.generateCalendar();
  }

  isPrevMonthAllowed() {
    const compareDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    return this.startDateRange < compareDate ? true : false;
  }

  isNextMonthAllowed() {
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    return lastDay < this.endDateRange ? true : false;
  }

  addCalendarDayValue(date: Date, value: ScheduleOption) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dayIndex = this.dayValues.findIndex(dv => 
      dv.date.getDate() === day && 
      dv.date.getMonth() + 1 === month && 
      dv.date.getFullYear() === year
    );  
  
    if (dayIndex !== -1) {
      this.dayValues[dayIndex].value = value.DataValue;
    } else {
      this.dayValues.push({ date: new Date(year, month - 1, day), value: value.DataValue });
    }
  }

  onEscapeKey(event: KeyboardEvent): void {
    this.hideOptions();
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
    this.currentDate = new Date(this.year, this.month - 1, 1);
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
    this.currentDate = new Date(this.year, this.month - 1, 1);
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
    let dateReset = false;
    let previousMonthDate = previousMonthNumberOfDays - firstDayOfMonth + 1;

    let curDate = null;
    this.weeks = [];

    for (let i = 0; i < 6; i++) { // 6 weeks to cover all possibilities
      const week: CalendarDay[] = [];
      
      for (let j = 0; j < 7; j++) {

        if (date > numberOfDaysInMonth && !dateReset) {
          date = 1;
          dateReset = true;
        }

        if (i === 0 && j < firstDayOfMonth) {
          curDate = new Date(previousYear, previousMonth-1, previousMonthDate);
          week.push({ date: curDate, day: previousMonthDate, isCurrentMonth: false, value: null });
          previousMonthDate++;
        } else if (date > numberOfDaysInMonth || dateReset) {
          let y = this.year;
          let m = this.month+1;
          if (m>12) {
            m = 1;
            y++;
          }
          curDate = new Date(y, m-1, date);
          week.push({  date: curDate, day: date, isCurrentMonth: false, value: null });
          date++;
        } else {
          curDate = new Date(this.year, this.month-1, date);
          week.push({  date: curDate, day: date, isCurrentMonth: true, value: null });
          date++;
        }
      }
      this.weeks.push(week);
      if (date > numberOfDaysInMonth || dateReset) {
        break; // Stop creating weeks if we've run out of days in the month
      }
    }
  }

  getDayValue(day: CalendarDay): string | null {

    const dayValue = this.dayValues.find(dv => 
      dv.date.getDate() === day.date.getDate() && 
      dv.date.getMonth() === day.date.getMonth() && 
      dv.date.getFullYear() === day.date.getFullYear()
    ); 
    return dayValue ? dayValue.value : null;
  }

  getDayDisplayName(day: CalendarDay): string | null {
    const dayValue = this.getDayValue(day);
    if (dayValue) {
      const dayName = this.scheduleOptions.find(dn =>
        dn.DataValue === dayValue);
      return dayName ? dayName.DisplayName : null;
    } else {
      return null;
    }
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

  showOptions(day: CalendarDay, event: MouseEvent): void {
    event.preventDefault(); // Prevent default context menu

    if (!this.readonly) {
      // Show the popup without altering the existing selection
      if (!this.selectedDays.has(day)) {
        this.selectedDays.clear();
        this.selectedDays.add(day);
      }
      else {
        const selectedDaysArray = Array.from(this.selectedDays);
        if (selectedDaysArray.length === 0) {
          this.selectedDay = null;
          this.hideOptions();
        } else {
          this.selectedDay = selectedDaysArray[selectedDaysArray.length - 1];
          this.popupChangeDetector = !this.popupChangeDetector;
          this.popupChangeDetector = true;
        }
      }

      // Calculate popup position
      this.popupTop = event.clientY + 'px';
      this.popupLeft = event.clientX + 'px';
    }
  }

  applySelectionToDays(option: ScheduleOption): void {
    this.selectedDays.forEach(day => {
      if (day) {
        day.value = option.DataValue;
        
        // Update the dayValues array as well
        const dayIndex = this.dayValues.findIndex(dv => 
          dv.date.getDate() === this.selectedDay.day && 
          dv.date.getMonth() + 1 === this.month && 
          dv.date.getFullYear() === this.year
        );  
        
        if (dayIndex !== -1) {
          this.dayValues[dayIndex].value = option.DataValue;
        } else {
          this.dayValues.push({ date: new Date(this.year, this.month - 1, day.day), value: option.DataValue });
        }
  
      }
    });

    this.selectedDay = null; // Hide the popup after selection
    this.hideOptions();
    this.selectedDays.clear(); // Optionally clear the selection after applying
  }

  getDayBackgroundColor(day: CalendarDay): string {
    if (this.useBackgroundColors) {
      const dayValue = this.dayValues.find(dv => 
        dv.date.getDate() === day.date.getDate() && 
        dv.date.getMonth() === day.date.getMonth() && 
        dv.date.getFullYear() === day.date.getFullYear()
      ); 
      if (dayValue) {
        const option = this.scheduleOptions.find(opt => opt.DataValue === dayValue.value);
        return option ? option.CategoryTypeColor : this.defaultackgroundColor;
      }
    }
    return this.defaultackgroundColor;
  }

  // Method to hide the options popup
  hideOptions(): void {
    this.popupChangeDetector = !this.popupChangeDetector;
    this.selectedDay = null;
    this.popupChangeDetector = false;
  }

  onReadOnlyChange(): void {
    this.isReadOnly = !this.isReadOnly;
    // Add logic to handle the read-only state
  }

  onUseBackgroundColorsChange(): void {
    this.useBackgroundColors = !this.useBackgroundColors;
    // Add logic to handle background color usage
  }

  // Multiple day selection capability

  handleDayClick(day: CalendarDay, event: MouseEvent): void {
    if (!this.readonly) {
      if (event.shiftKey) {
        // Shift-click behavior
        if (this.selectedDays.has(day)) {
          this.selectedDays.delete(day); // Deselect if already selected
        } else {
          this.selectedDays.add(day); // Select the day
        }
      } else {
        // Normal click behavior
        this.hideOptions();
        this.selectedDays.clear();
        this.selectedDays.add(day);
      }

      // Calculate and update popup position
      this.popupTop = event.clientY + 'px';
      this.popupLeft = event.clientX + 'px';
    }
  }

  isDaySelected(day: CalendarDay): boolean {
    return this.selectedDays.has(day);
  }

}
