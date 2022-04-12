import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog, PageEvent } from '@angular/material';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { IssueDisDialogComponent } from './issue-dis-dialog/issue-dis-dialog.component';
import { ReviewDialogComponent } from '../clients/review-dialog/review-dialog.component';
import { DashboardService } from './dashboard.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

  filterToggle: boolean = false;
  public active: any[];
  public due: any[];
  public issues: any[];
  public settings: Settings;
  public autoScale = true;

  pageEvent: PageEvent;
  public pageSize = 5;

  public activeCurrentPage = 0;
  public activeTotalSize = 0;
  activeShowEmpty: boolean;

  public dueCurrentPage = 0;
  public dueTotalSize = 0;
  dueShowEmpty: boolean;

  public issueCurrentPage = 0;
  public issueTotalSize = 0;
  issueShowEmpty: boolean;
  totalCount = 0;


  constructor(
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public dashboardService: DashboardService,
    public alertService: AlertService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.getActive({});
    this.getDue({});
    this.getIssue({});
  }

  public getActive(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.activeCurrentPage;
    filter['date'] = new Date().toISOString().slice(0, 10);
    this.dashboardService.getActiveJob(filter).then(data => {
      if (data.success) {
        this.active = data.results;
        this.activeTotalSize = data.count;
        this.totalCount = data.totalJobCount;
        if (data.count) {
          this.activeShowEmpty = false;
        }
        else {
          this.activeShowEmpty = true;
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  public getDue(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.dueCurrentPage;
    filter['date'] = new Date();
    this.dashboardService.getDueReview(filter).then(data => {
      if (data.success) {
        this.due = data.results;
        this.dueTotalSize = data.count;
        if (data.count) {
          this.dueShowEmpty = false;
        }
        else {
          this.dueShowEmpty = true;
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  public getIssue(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.issueCurrentPage;
    filter['date'] = new Date();
    this.dashboardService.getIssueData(filter).then(data => {
      if (data.success) {
        this.issues = data.results;
        this.issueTotalSize = data.count;
        if (data.count) {
          this.issueShowEmpty = false;
        }
        else {
          this.issueShowEmpty = true;
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  openReviewsDilog(review) {
    let dialogRef = this.dialog.open(ReviewDialogComponent, {
      data: review,
      height: 'auto',
      width: '600px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null && data !== undefined) {
      }
    });
  }

  openIssuesDilog(issue) {
    console.log(issue, 'issue');
    let dialogRef = this.dialog.open(IssueDisDialogComponent, {
      data: issue,
      height: 'auto',
      width: '600px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data != null && data !== undefined) {
      }
    });
  }

  public activeHandlePage(e: any) {
    this.activeCurrentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getActive({});
  }

  public dueHandlePage(e: any) {
    this.dueCurrentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getDue({});
  }

  public issueHandlePage(e: any) {
    this.issueCurrentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getIssue({});
  }

}



