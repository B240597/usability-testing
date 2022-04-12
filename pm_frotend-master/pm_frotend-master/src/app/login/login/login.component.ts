import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AppSettings } from "src/app/app.settings";
import { AlertService } from "src/app/shared/services/alert.service";
import { Settings } from "src/app/app.settings.model";
import { LoginService } from "../login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [AlertService],
})
export class LoginComponent {
  public TypeString: string = "password";
  public isPassword: boolean = true;

  public form: FormGroup;
  public settings: Settings;
  constructor(
    public appSettings: AppSettings,
    public loginService: LoginService,
    public fb: FormBuilder,
    public router: Router,
    public alertService: AlertService
  ) {
    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required])],
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });
  }

  public onSubmit(values): void {

    if (this.form.valid) {
      let finalObj = {};
      finalObj['phoneNumber'] = values.email;
      finalObj['userPassword'] = values.password
      console.log(this.form.value);
      this.loginService.loginCheck(finalObj).then(data => {
        if (data.success) {
          if (localStorage.getItem('optima_heat_user_info'))
            localStorage.removeItem('optima_heat_user_info');
          localStorage.setItem('optima_heat_user_info', JSON.stringify({ userId: data.userId, name: data.UserName, userType: data.userType, token: data.authToken, phone: data.userPhone, email: data.userEmail, Code: data.userCode }));

          if (data.userType == 1) {
            this.router.navigate(['/admin/dashboard']);
            localStorage.setItem('userType', 'admin');
            localStorage.setItem('userId', '1');
          } else if (data.userType == 2) {
            this.router.navigate(['/admin/jobs/gridview']);
            localStorage.setItem('userType', 'project_manager');
            localStorage.setItem('userId', '2');
          }
          else if (data.userType == 3) {
            this.router.navigate(['/admin/jobs/gridview']);
            localStorage.setItem('userType', 'associate');
            localStorage.setItem('userId', '3');
          }
          localStorage.setItem("loginUser", data.UserName);
          this.alertService.createAlert(data.message, 1);
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
    }

    else {
      this.alertService.createAlert("Invalid Credentials", 0);
    }
  }


  public ChangetextType(isPassword) {
    if (isPassword) {
      this.TypeString = "password";
    } else {
      this.TypeString = "text";
    }
  }

  allow_only_numbers(event) {
    var k;
    k = event.charCode;
    return ((k >= 48 && k <= 57) || (k == 8) || (k == 46));
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.settings.loadingSpinner = false;
    }, 500);
  }
}



