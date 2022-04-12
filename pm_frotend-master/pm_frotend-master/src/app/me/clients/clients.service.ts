import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  public headers: any;

  getprojectdropdownurl = '/getprojectdropdown';

  //Job grid columns
  getjobgridcolumnsurl = '/getjobgridcolumns';
  updatejobgridcolumnsurl = '/updatejobgridcolumns';

  //Jobs APi's
  addjoburl = '/addjob';
  getjoburl = '/getjob';
  getjobmanagementurl = '/getjobmanagement';
  updatejobstatusurl = '/updatejobstatus';

  //review Date
  addreviewurl = '/addreview'; //Add Review API
  getreviewurl = '/getreview'; //Get Review API
  updatreviewurl = '/updatreview'; //Update Review Status API

  //Issue  APIs
  addissueurl = '/addissue'; //Add Issue API
  getissueurl = '/getissue'; //Get Issue API
  updateissueurl = '/updateissue'; //Update Issue Status API

  constructor(private http: Http) { }

  getToken() {
    if (localStorage.getItem('optima_heat_user_info')) {
      let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
      return currentUser.token;
    } else {
      return " ";
    }
  }

  //Issue API's
  updateJobGridColumns(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updatejobgridcolumnsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //get Issues
  getJobGridColumns(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getjobgridcolumnsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //Issue API's
  updateIssue(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updateissueurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //get Issues
  getIssue(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getissueurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //add Issues
  addIssue(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.addissueurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //Review Date API's
  updateReview(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updatreviewurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // gest Review Date
  getReview(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getreviewurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //add review date
  addReview(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.addreviewurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // Job API's
  updateJobStatus(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updatejobstatusurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //get Job
  getJobManagement(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getjobmanagementurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //get Job
  getJob(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getjoburl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //add job
  addJob(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.addjoburl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // get project drop down
  getProjectDropdown(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getprojectdropdownurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
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
