import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public headers: any;

  // dashboard apis
  getactivejoburl = '/getactivejob';
  getduereviewurl = '/getduereview';
  getissuedataurl = '/getissuedata';

  constructor(private http: Http) { }

  getToken() {
    if (localStorage.getItem('optima_heat_user_info')) {
      let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
      return currentUser.token;
    } else {
      return " ";
    }
  }

  // dashboard API's

  // get Active Job
  getActiveJob(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getactivejoburl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // get due review
  getDueReview(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getduereviewurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // get due review
  getIssueData(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getissuedataurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
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
