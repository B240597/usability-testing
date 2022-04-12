import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../../../shared/services/alert.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  providers: [AlertService]
})
export class UserDialogComponent implements OnInit {

  statusData = [{ id: 1, option: "Active" }, { id: 0, option: "Inactive" }];
  roles: any;
  addUserForm: FormGroup;

  createUserForm() {
    this.addUserForm = this.fb.group({
      userName: new FormControl('', [Validators.required]),
      userEmail: new FormControl('', []),
      userPhone: new FormControl('', [Validators.minLength(10), Validators.maxLength(15),
      Validators.required, Validators.pattern(/^[0-9!@#$&()`.+,/"-]*$/)]),
      userRole: new FormControl('', [Validators.required]),
      userCode: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    })
  }

  get userName() { return this.addUserForm.get('userName'); }

  get userEmail() { return this.addUserForm.get('userEmail'); }

  get userPhone() { return this.addUserForm.get('userPhone'); }

  get userRole() { return this.addUserForm.get('userRole'); }

  get userCode() { return this.addUserForm.get('userCode'); }

  get status() { return this.addUserForm.get('status'); }

  noWhiteSpaceValidator(control: FormControl) {
    let isWhiteSpace = (control.value || '').trim().length === 0;
    let isValid = !isWhiteSpace;
    return isValid ? null : { 'whitespace': true };
  }

  allow_only_numbers(event) {
    var k;
    k = event.charCode;
    return ((k > 47 && k < 58) || k == 32 || k == 8);
  }


  constructor(
    public fb: FormBuilder, public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any, private alertService: AlertService,
    public usersService: UsersService) {
    this.createUserForm();
  }

  ngOnInit() {
    if (this.user) {
      this.addUserForm.controls['userName'].setValue(this.user.userName);
      this.addUserForm.controls['userEmail'].setValue(this.user.userEmail);
      this.addUserForm.controls['userPhone'].setValue(this.user.userPhone);
      this.addUserForm.controls['userRole'].setValue(this.user.userType);
      this.addUserForm.controls['status'].setValue(this.user.status);
      this.addUserForm.controls['userCode'].setValue(this.user.userCode);
      // this.addUserForm.controls['userCode'].disable();

    }
  }

  close(): void {
    this.dialogRef.close();
  }

  saveUser() {
    let finalObj = {};
    finalObj['userName'] = this.addUserForm.value.userName;
    finalObj['userEmail'] = this.addUserForm.value.userEmail;
    finalObj['userPhone'] = this.addUserForm.value.userPhone;
    finalObj['userType'] = this.addUserForm.value.userRole;
    finalObj['userCode'] = this.addUserForm.value.userCode;
    finalObj['status'] = this.addUserForm.value.status;
    if (this.user) {
      finalObj['userId'] = this.user.userId;
      console.log(finalObj);
      this.usersService.updateUser(finalObj).then(data => {
        if (data.success) {
          this.alertService.createAlert(data.message, 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }
    else {
      this.usersService.addNewUser(finalObj).then(data => {
        if (data.success) {
          this.alertService.createAlert(data.message, 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }

  }

}
