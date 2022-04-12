import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class UsersService {

    public headers: any;

    //User APIs
    getusersdropdownurl = '/getusersdropdown';
    addnewuserurl = '/addnewuser';
    getusersurl = '/getusers';
    updateuserstatusurl = '/updateuserstatus';
    updateuserurl = '/updateuser';

    constructor(private http: Http) { }

    getToken() {
        if (localStorage.getItem('optima_heat_user_info')) {
            let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
            return currentUser.token;
        } else {
            return " ";
        }
    }

    //User APIs

    //Get Users Dropdown API
    getUsersDropdown(filter): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(this.getusersdropdownurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    //Add New User API
    addNewUser(filter): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(this.addnewuserurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    //Get Users API
    getUsers(filter): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(this.getusersurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    //Update User Status API
    updateUserStatus(filter): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.put(this.updateuserstatusurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    //Update User API
    updateUser(filter): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.put(this.updateuserurl, JSON.stringify(filter), { headers: this.headers, withCredentials: true }).toPromise()
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