import { Component } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
// import jsPDF from '@sagold/jsPDF';
// import { NgxMaterialTimepickerTheme } from '../../models/ngx-material-timepicker-theme.interface';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent {


  public startTime: string = "";
  public endTime: string = "";
  public amount: number
  public hours: number
  public isAdd: boolean
  public inputs: any[] = [];
  public timeOfShift: number = 0
  public timeOfShiftFormatted: string
  public formatedHours: string = ""



  constructor(private listService: ListService, private datePipe: DatePipe) {
    this.amount = 0
    this.hours = 0
    this.isAdd = false
    this.timeOfShiftFormatted = ""
  }

  customTheme: NgxMaterialTimepickerTheme = {
    dial: {
      dialBackgroundColor: "#4CAF50"
    },
    container: {
      bodyBackgroundColor: '#f0f0f0',
      buttonColor: '#4CAF50'
    },
    clockFace: {
      clockFaceBackgroundColor: '#ffffff',
      clockHandColor: '#4CAF50',
    }
  };

  addNewAction() {

    let now = new Date()
    let nowDateTime = now.toISOString()
    let nowDate = nowDateTime.split('T')[0];
    let time = `${this.startTime}:00`
    let time2 = `${this.endTime}:00`
    const startTime = new Date(nowDate + 'T' + time);
    const endTime = new Date(nowDate + 'T' + time2);

    console.log("Start Time:", this.startTime);
    console.log("End Time:", this.endTime);

    this.timevalidation()

    const timeDifference = endTime.getTime() - startTime.getTime();
    // Convert milliseconds to hours
    this.hours = timeDifference / (1000 * 60 * 60);
    const fixedHours = this.hours - 2
    if (this.hours < 0) {
      this.hours = this.hours + 24
      this.formatedHours = this.datePipe.transform(new Date(fixedHours * 3600000), 'HH:mm') || ''
    } else {
      this.formatedHours = this.datePipe.transform(new Date(fixedHours * 3600000), 'HH:mm') || ''
    }
    console.log(`hour: ${this.hours}`);
    console.log(`hours: ${this.formatedHours}`);

    // Ensure there's at least one guard to avoid division by zero
    if (this.amount > 0) {
      // Calculate the duration of each guard's shift
      const timePerGuard = this.hours / this.amount;
      this.timeOfShift = timePerGuard;

      if (typeof this.timeOfShift === 'number' && !isNaN(this.timeOfShift)) {
        // Format timeOfShift as a clock format
        const fixedTimeOfShift = this.timeOfShift - 2
        this.timeOfShiftFormatted = this.datePipe.transform(new Date(fixedTimeOfShift * 3600000), 'HH:mm') || '';
      } else {
        this.timeOfShiftFormatted = '';
      }

      console.log(timePerGuard);
      console.log(this.timeOfShiftFormatted);
      this.isAdd = true;

      this.inputs = Array.from({ length: this.amount }, (_, index) => ({
        id: index + 1,
        value: '',
        startTime: this.datePipe.transform(new Date(startTime.getTime() + index * timePerGuard * 3600000), 'HH:mm') || ''
      }));
      console.log(this.inputs);


    } else {
      alert('אנא בחר כמות שומרים');
    }
  }

  timevalidation() {
    if (this.startTime === "" && this.endTime === "") {
      alert("אנא בחר זמנים לשמירה")
      return
    }

    if (this.startTime === this.endTime) {
      alert("אנא בחר זמן סיום")
      return
    }
  }


  exportToPDF() {
    const doc = new jsPDF();
    doc.addFont("assets/fonts/david.ttf", "David", "normal");
    doc.addFont("assets/fonts/davidbd.ttf", "David", "bold");
    doc.setFont("David", "normal");

    const formattedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    console.log(formattedDate);

    const header = `רשימת שמירה ${formattedDate}`
    console.log(header);


    doc.setR2L(true);
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255);
    doc.text(header, 10, 10);


    const data = this.inputs.map(input => [input.id, input.value, this.reverseText(input.startTime)]);

    autoTable(doc, {
      styles: { font: 'David' },
      head: [['#', 'שם', 'זמן שמירה']],
      body: data,
    }
    )
    doc.save('table.pdf');
  }

  reverseText(text: string) {
    return text.split('').reverse().join('');
  }

  clearAll() {
    this.isAdd = false
    this.amount = 0
    this.startTime = "00:00"
    this.endTime = "00:00"
  }


  shuffleInputValues() {
    for (let i = this.inputs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the names (values) while keeping other properties intact
      const temp = this.inputs[i].value;
      this.inputs[i].value = this.inputs[j].value;
      this.inputs[j].value = temp;
    }
  }


  selectInput(input: any) {
    input.select()
  }

}
