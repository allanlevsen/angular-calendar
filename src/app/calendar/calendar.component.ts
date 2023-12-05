import { Component, HostListener, Input, OnInit } from '@angular/core';

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
  currentMonthName: string;

  // Add a property to track the currently selected day for which the popup is being shown
  selectedDay: CalendarDay | null = null;
  defaultackgroundColor: string = "#fefefe";

  isReadOnly: boolean = false;
  useBackgroundColors: boolean = true;
  popupChangeDetector: boolean = true;

  // multiple day selecion capability
  selectedDays: Set<CalendarDay> = new Set();
  popupTop: string = '';
  popupLeft: string = '';
  @HostListener('document:keydown.escape', ['$event']) // Listen for the escape key

  ngOnInit() {
    this.updateMonthAndYear();
    this.generateCalendar();
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

  getDayDisplayName(day: number): string | null {
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

  // showOptions(day: CalendarDay, event: MouseEvent): void {
  //   event.preventDefault();
  //   this.selectedDay = day;
  // }

  showOptions(day: CalendarDay, event: MouseEvent): void {
    event.preventDefault(); // Prevent default context menu

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

  // selectOption(option: ScheduleOption): void {
  //   if (this.selectedDay) {
  //     this.selectedDay.value = option.DataValue;
      
  //     // Update the dayValues array as well
  //     const dayIndex = this.dayValues.findIndex(dv => 
  //       dv.date.getDate() === this.selectedDay.day && 
  //       dv.date.getMonth() + 1 === this.month && 
  //       dv.date.getFullYear() === this.year
  //     );
      
  //     if (dayIndex !== -1) {
  //       this.dayValues[dayIndex].value = option.DataValue;
  //     } else {
  //       this.dayValues.push({ date: new Date(this.year, this.month - 1, this.selectedDay.day), value: option.DataValue });
  //     }

  //     this.selectedDay = null; // Hide the popup after selection
  //   }
  // }

  getDayBackgroundColor(day: number): string {
    if (this.useBackgroundColors) {
      const dayValue = this.dayValues.find(dv =>
        dv.date.getDate() === day &&
        dv.date.getMonth() + 1 === this.month &&
        dv.date.getFullYear() === this.year
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



  isDaySelected(day: CalendarDay): boolean {
    return this.selectedDays.has(day);
  }

}
