import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, PageEvent } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.scss']
})
export class IssueDialogComponent implements OnInit {


  issueDate = new FormControl(new Date());
  description = new FormControl();
  today = new Date();
  pageEvent: PageEvent;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  showEmpty: boolean;
  issueList: any;
  userType: string;

  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public job: any,
    public dialogRef: MatDialogRef<IssueDialogComponent>,
    public clientsService: ClientsService,
    public alertService: AlertService
  ) {

  }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.getIssue({});
  }

  close(): void {
    this.dialogRef.close('save');
  }

  saveUser() {
    let finalObj = {};
    finalObj['jobId'] = this.job.jobId;
    finalObj['jobCode'] = this.job.jobCode;
    finalObj['projectManager'] = this.job.projectManager;

    finalObj['issueDate'] = new Date();
    finalObj['issueDescription'] = this.description.value;

    this.clientsService.addIssue(finalObj).then(data => {
      if (data.success) {
        this.description.setValue('');
        this.alertService.createAlert(data.message, 1);
        this.getIssue({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })

  }

  update(id, status) {
    if ((this.userType == 'project_manager' || this.userType == 'admin') && status != 3) {

      let finalObj = {};
      finalObj['issuesId'] = id;
      if (status == 1) {
        finalObj['status'] = 2;
      } else if (status == 2) {
        finalObj['status'] = 3;
      }

      this.clientsService.updateIssue(finalObj).then(data => {
        if (data.success) {
          this.alertService.createAlert(data.message, 1);
          this.getIssue({});
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
    }

  }

  getIssue(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.currentPage;
    filter['jobId'] = this.job.jobId;
    this.clientsService.getIssue(filter).then(data => {
      if (data.success) {
        this.issueList = data.results;
        this.totalSize = data.count;
        if (data.count) {
          this.showEmpty = false;
        }
        else {
          this.showEmpty = true;
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getIssue({});
  }

}
