import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {

  authenticateurl = "/authenticate";
  forgetpassurl = "/forgotpassword";
  resetpassurl = '/resetpassword';
  checksessionurl = '/checksession';
  logouturl = "/logout";
  checkurlstatus = '/checkurlstatus';
  createpasswordurl = '/activateuser';
  checkresetpassurl = '/checkresetpassurlstatus';
  getsettingsurl = "/getsettings";
  changepasswordurl = "/changepassword";
  adminchangepasswordurl = '/adminchangepassword';

  headers = new Headers({
    'Content-Type': 'application/json'
  });
  constructor(private http: Http) { }

  getToken() {
    if (localStorage.getItem('optima_heat_user_info')) {
      let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
      return currentUser.token;
    } else {
      return " ";
    }
  }

  loginCheck(data): Promise<any> {
    return this.http.post(this.authenticateurl, JSON.stringify(data), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  logOut(): Promise<any> {
    return this.http.post(this.logouturl, { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  forgetPassword(email): Promise<any> {
    var data = {
      email: email
    }
    return this.http.post(this.forgetpassurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  resetPassword(data): Promise<any> {
    return this.http.post(this.resetpassurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  checkSessionAlive(token) {
    let headers2 = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return this.http.get(this.checksessionurl, { headers: headers2, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // change password
  changePassword(body): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.changepasswordurl, JSON.stringify(body), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //Change password for Admin Api
  adminChangePassword(body): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.adminchangepasswordurl, JSON.stringify(body), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  urlStatusCheck(data): Promise<any> {
    return this.http.post(this.checkurlstatus, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  userCreatePassword(data): Promise<any> {
    return this.http.post(this.createpasswordurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  getSettings(filter): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getsettingsurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  urlResetPasswordCheck(uid, accessToken, tS): Promise<any> {
    var data = {
      userId: uid,
      accessToken: accessToken,
      timeStamp: tS
    }
    return this.http.post(this.checkresetpassurl, JSON.stringify(data), { headers: this.headers }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleErrorPromise(error: Response | any) {

    return Promise.reject(error.message || error);
  }

}
