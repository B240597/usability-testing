import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  public headers: any;

  // grid columns
  getprojectgridcolumnsurl = '/getprojectgridcolumns';
  updateprojectgridcolumnsurl = '/updateprojectgridcolumns';

  // project API's
  addprojecturl = '/addproject'; //Add Project API
  getprojecturl = '/getproject'; //Get Project API
  updateprojecturl = '/updateproject'; //Update Project API
  updateprojectstatusurl = '/updateprojectstatus'; //Update Project Status API

  getusersdropdownurl = '/getusersdropdown'; //Get users dropdown API

  constructor(private http: Http) { }

  getToken() {
    if (localStorage.getItem('optima_heat_user_info')) {
      let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
      return currentUser.token;
    } else {
      return " ";
    }
  }

  // grid columns

  // get project grid column
  getProjectGridColumns(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getprojectgridcolumnsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateProjectGridColumns(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updateprojectgridcolumnsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  addproject(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.addprojecturl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  getProject(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getprojecturl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateProject(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updateprojecturl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateProjectStatus(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updateprojectstatusurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  getUsersDropdown(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getusersdropdownurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
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
