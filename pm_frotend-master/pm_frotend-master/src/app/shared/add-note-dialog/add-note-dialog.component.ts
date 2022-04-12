import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss'],
  providers: [AlertService]
})
export class AddNoteDialogComponent implements OnInit {
  public dateTime1: Date;
  modeOptions = ["Task","Asset"];
  modeOptionSelected: any;
  //startDate = new Date(1990, 0, 1);
  onModeOptionsSelected(event){
  
  }
  communicationOptions = ["Field","Office"];
  communicationOptionSelected: any;
  //startDate = new Date(1990, 0, 1);
  onCommunicationOptionsSelected(event){
  
  }

  constructor(private alertService: AlertService,public dialogRef: MatDialogRef<AddNoteDialogComponent>,@Inject(MAT_DIALOG_DATA) public action: any) { 
    
  }

  
  ngOnInit() {
    
  }

  close(): void {
    this.dialogRef.close();
  }

  saveInfo() {
    this.alertService.createAlert('Successfully Saved.', 1);
    this.dialogRef.close();
  }

}
