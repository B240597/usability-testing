import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Settings } from '../../app.settings.model';
import { LoginService } from '../login.service';
import { PasswordValidation } from '../../shared/password-validation.component';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-useractivate',
  templateUrl: './useractivate.component.html',
  styleUrls: ['./useractivate.component.scss'],
  providers: [LoginService, AlertService],
})
export class UserActivateComponent implements OnInit {
  today = Date.now();
  userId: string;
  accesToken: string;
  resToken: string;
  isOneLetter = false;
  isOneCapitalLetter = false;
  isOneNumber = false;
  isOneSpecialCaharacter = false;
  isMinLength = false;
  isValidate = false;
  private _submitted: boolean = false;

  public form:FormGroup;
  public settings: Settings;
  createFormEnable: boolean = true;

  constructor( private activatedRoute: ActivatedRoute, public fb: FormBuilder, public router:Router, public loginService: LoginService, public alertService: AlertService) {
    this.createForm();
    console.log('entered');
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params.uid;
      this.accesToken = params.activationToken;
    });
  }

  createForm() {
    this.form = this.fb.group({
      password: new FormControl('', [Validators.minLength(8), Validators.required]),
      confirmPassword: new FormControl('', [Validators.minLength(8), Validators.required])
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      });
  }

  ngOnInit() {
    let finalObj = {};
    finalObj['userId'] = this.userId;
    finalObj['accessToken'] = this.accesToken;
    this.loginService.urlStatusCheck(finalObj).then(res => {
      if (!res.success) {
        this.alertService.createAlert('The URL is no longer valid.', 0);
        this.router.navigate(['/login']);
        this.isValidate = false;
      } else {
        this.isValidate = true;
      }
    }).catch(e => {
      this.isValidate = false;
    });
  }
  get password() { return this.form.get('password'); };
  get confirmPassword() { return this.form.get('confirmPassword'); };


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

  public onSubmit(values:any):void {
    if (this.form.valid) {
      if(values['password'] === values['confirmPassword']) {
        let finalObj = {};
        finalObj['userId'] = this.userId;
        finalObj['password'] = values.password;
        finalObj['accessToken'] = this.accesToken;
        this.loginService.userCreatePassword(finalObj).then(res => {
          if (res.success) {
            this.alertService.createAlert('Password has been sucessfully created for your Optima Heat account.', 1);
            this.router.navigate(['/login']);
          } else {
            this.alertService.createAlert(res.message, 0);
          }
        });
      } else {
      }
    }
  }

}
