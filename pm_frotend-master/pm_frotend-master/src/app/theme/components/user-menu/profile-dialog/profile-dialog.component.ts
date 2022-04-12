import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../../../shared/services/alert.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss'],
  providers: [AlertService]
})
export class ProfileDialogComponent implements OnInit {

  public dateTime1: Date;
  userProfileForm: FormGroup;

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ProfileDialogComponent>, @Inject(MAT_DIALOG_DATA) public user: number, private alertService: AlertService) {
    this.createUserProfileForm();
  }

  ngOnInit() {
    let project = JSON.parse(localStorage.getItem('optima_heat_user_info'));
    this.userProfileForm.controls['userName'].setValue(project.name);
    this.userProfileForm.controls['uniqueId'].setValue(project.email);
    if(project.userType == 1){
      this.userProfileForm.controls['role'].setValue('Super Admin');
    }else if(project.userType == 2){
      this.userProfileForm.controls['role'].setValue('Project Manager');
    }else if(project.userType == 3){
      this.userProfileForm.controls['role'].setValue('Engineer');
    }
    
  }

  close(): void {
    this.dialogRef.close();
  }

  get userName() { return this.userProfileForm.get('userName'); }

  get uniqueId() { return this.userProfileForm.get('uniqueId'); }

  get role() { return this.userProfileForm.get('role'); }

  saveProfile() {
    this.alertService.createAlert('Successfully Saved.', 1);
    this.dialogRef.close();
  }

  createUserProfileForm() {
    this.userProfileForm = this.fb.group({
      userName: new FormControl(''),
      uniqueId: new FormControl(''),
      role: new FormControl(''),
    })
  }

}
