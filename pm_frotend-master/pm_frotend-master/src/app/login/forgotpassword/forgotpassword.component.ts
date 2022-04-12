import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  public form:FormGroup;
  public settings: Settings;

  constructor(public appSettings:AppSettings, private location: Location ,public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) {
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required, emailValidator])],
    });
   }

   goBack() {
     this.location.back();
   }

  ngOnInit() {
  }

  public onSubmit(values:any):void {
    if (this.form.valid) {
      this.loginService.forgetPassword(values.email).then(res => {
        if (res.success) {
          this.alertService.createAlert(res.message, 1);
          this.router.navigate(['/login']);
        } else {
          this.alertService.createAlert(res.message, 0);
        }
      });
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
