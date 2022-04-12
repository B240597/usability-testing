import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../../../../shared/services/alert.service';

@Component({
  selector: 'app-add-industry',
  templateUrl: './add-industry.component.html',
  styleUrls: ['./add-industry.component.scss'],
  providers: [AlertService]
})
export class AddIndustryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddIndustryComponent>,@Inject(MAT_DIALOG_DATA) public user: number, private alertService: AlertService) { 
    console.log(this.user);
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
