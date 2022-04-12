import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public headers: any;

  // lookup Api's
  getlookupoptionsurl = "/getlookupoptions";
  addlookupsurl = "/addlookupsurl";
  updatelookupurl = '/updatelookup';
  //settings Api's
  updateSettingsurl = '/updatesettings';
  getSettingsurl = '/getsettings';

  constructor(private http: Http) { }

  getToken() {
    if (localStorage.getItem('optima_heat_user_info')) {
      let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
      return currentUser.token;
    } else {
      return " ";
    }
  }

  // Lookup Api's
  getLookupOptions(filter): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getlookupoptionsurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  addLookups(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.addlookupsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateLookup(item): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updatelookupurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  //Setting Api's
  getSettings(filter): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.post(this.getSettingsurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  updateSettings(Obj): Promise<any> {
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
    return this.http.put(this.updateSettingsurl, JSON.stringify(Obj), { headers: this.headers, withCredentials: true }).toPromise()
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
