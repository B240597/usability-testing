import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-delay',
  templateUrl: './add-delay.component.html',
  styleUrls: ['./add-delay.component.scss']
})
export class AddDelayComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<AddDelayComponent>) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close();
  }

}
