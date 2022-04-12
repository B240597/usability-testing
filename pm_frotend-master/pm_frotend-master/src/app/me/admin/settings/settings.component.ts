import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { AlertService } from '../../../shared/services/alert.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  providers: [AlertService]
})
export class SettingsComponent implements OnInit {

  tableList: any;
  public popoverStatusTitle: string = 'Confirm Save Change';
  public popoverStatusMessage: string = 'Are you sure you want to save changes?';
  public cancelClicked: boolean = false;
  pageEvent: PageEvent;
  public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '5');
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  showEmpty: boolean = true;
  list: any;
  settings: any;
  userType: string;

  constructor(private alertService: AlertService,
    private adminService: AdminService) {
    this.userType = localStorage.getItem('userType');
  }

  ngOnInit() {
    this.getSetting({});
  }

  //get settings api
  public getSetting(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.currentPage;
    this.adminService.getSettings(filter).then(data => {
      if (data.success) {
        console.log(data.results);
        this.settings = data.results;
        if (data.results) {
          if (!data.results.length) {
            this.showEmpty = true;
            this.totalSize = 0;
          }
          else {
            this.totalSize = data.count;
            this.showEmpty = false;
          }
        }
        else {
          this.totalSize = 0;
          this.showEmpty = true;
        }
      } else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getSetting({});
  }

  saveSettings(item) {
    if (!item.new_value)
      return;
    this.adminService.updateSettings(item).then(data => {
      if (data.success) {
        if (item.Name == 'Grid Length') {
          localStorage.setItem('settings', item.new_value);
          this.pageSize = item.new_value;
        }
        if (item.Name == 'Notification Email') {
          localStorage.setItem('email', item.new_value);
        }
        this.getSetting({});
        this.alertService.createAlert(data.message, 1);
      } else {
        this.getSetting({});
        this.alertService.createAlert(data.message, 0);
      }
    }
    );
  }


  allow_only_numbers(event) {
    var k;
    k = event.charCode;
    return ((k > 47 && k < 58));
  }

  checkEmail(email) {
    /* let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; */
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])/;
    if (reg.test(email) == false) {
      return false;
    } else {
      return true;
    }
  }

}
