import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../../../../shared/services/alert.service';

@Component({
  selector: 'app-add-fat',
  templateUrl: './add-fat.component.html',
  styleUrls: ['./add-fat.component.scss'],
  providers: [AlertService]
})
export class AddFatComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddFatComponent>, private alertService: AlertService) { 
    
   }

  
  ngOnInit() {
    
  }

  close(): void {
    this.dialogRef.close();
  }

  saveStep() {
    this.alertService.createAlert('Successfully Saved.', 1);
    this.dialogRef.close();
  }

}
