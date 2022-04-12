import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class MessagesService {

    public headers: any;

    adddeviceidurl = '/adddeviceid';
    getnotificationsurl = '/getnotifications';
    readnotificationsurl = '/readnotifications';

    constructor(private http: Http) { }

    getToken() {
        if (localStorage.getItem('optima_heat_user_info')) {
            let currentUser = JSON.parse(localStorage.getItem('optima_heat_user_info'));
            return currentUser.token;
        } else {
            return " ";
        }
    }

    addDeviceId(item): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(this.adddeviceidurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    getNotifications(item): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(this.getnotificationsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
            .then(this.extractData)
            .catch(this.handleErrorPromise);
    }

    readNotifications(item): Promise<any> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()
        });
        return this.http.post(this.readnotificationsurl, JSON.stringify(item), { headers: this.headers, withCredentials: true }).toPromise()
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