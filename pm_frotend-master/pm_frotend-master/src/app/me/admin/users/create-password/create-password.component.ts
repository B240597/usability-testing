import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from 'src/app/login/login.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MustMatch } from 'src/app/shared/services/mustMatch';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  isOneLetter = false;
  isOneCapitalLetter = false;
  isOneNumber = false;
  isOneSpecialCaharacter = false;
  isMinLength = false;
  isValidate = false;
  currentUser: any;
  checkingPassword = false;
  constructor(
    public dialogRef: MatDialogRef<CreatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any,
    private fb: FormBuilder,
    private alertService: AlertService,
    private loginService: LoginService) {
    this.createPasswordForm();
  }

  get userNewPassword() { return this.changePasswordForm.get('userNewPassword'); };
  get userNewReenterPassword() { return this.changePasswordForm.get('userNewReenterPassword'); };

  ngOnInit() {
    console.log(this.user);
  }


  onKeyPress(e) {
    var pswd = e.value;
    //validate the length
    if (pswd.length < 8) {
      this.isMinLength = false;
    } else {
      this.isMinLength = true;
    }

    //validate letter
    if (pswd.match(/[A-z]/)) {
      if (pswd != '_') {
        this.isOneLetter = true;
      } else {
        this.isOneLetter = false;
      }
    } else {
      this.isOneLetter = false;
    }

    //validate uppercase letter
    if (pswd.match(/[A-Z]/)) {
      this.isOneCapitalLetter = true;
    } else {
      this.isOneCapitalLetter = false;
    }

    //validate special character
    if (pswd.match(/[!@#\$%\^&\_\+\<\>\.\,\=\:\;\'\?\(\)\[\]\\\/\|\*{}-]/)) {
      this.isOneSpecialCaharacter = true;
    } else {
      this.isOneSpecialCaharacter = false;
    }

    //validate number
    if (pswd.match(/\d/)) {
      this.isOneNumber = true;
    } else {
      this.isOneNumber = false;
    }

  }

  onKeyPressed(f) {
    var pswd = f.value;
    const password = this.userNewReenterPassword;
    if (pswd !== password) {
      this.checkingPassword = true;
    } else {
      this.checkingPassword = false;
    }
  }
  noWhiteSpaceValidator(control: FormControl) {
    let isWhiteSpace = (control.value || '').trim().length === 0;
    let isValid = !isWhiteSpace;
    return isValid ? null : { 'whitespace': true };
  }


  createPasswordForm() {
    this.changePasswordForm = this.fb.group({
      userNewPassword: new FormControl('', [Validators.required, Validators.maxLength(30), this.noWhiteSpaceValidator]),
      userNewReenterPassword: new FormControl('', [Validators.required, Validators.maxLength(30), this.noWhiteSpaceValidator]),
    }, {
      validator: MustMatch('userNewPassword', 'userNewReenterPassword')
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  updatePassword(formData) {
    let temp = {};
    temp['userId'] = this.user.userId;
    temp['new_password'] = formData.userNewPassword;
    this.loginService.adminChangePassword(temp).then(data => {
      if (data.success) {
        this.alertService.createAlert("Password updated Successfully", 1);
        this.dialogRef.close('save');
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    });

  }


}
