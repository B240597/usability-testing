import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, PageEvent } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent implements OnInit {

  reviewForm: FormGroup;
  reviewList: any;
  nextReviewDate = new FormControl();
  remarkData = new FormControl();
  reviewId: any;

  pageEvent: PageEvent;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  showEmpty: boolean;
  today = new Date();

  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public jobId: any,
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    public clientsService: ClientsService,
    public alertService: AlertService
  ) {

  }
  remark = false;
  userType: any;

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.getReview({});
  }

  saveUser() {
    let finalObj = {};
    finalObj['reviewDate'] = this.nextReviewDate.value;
    finalObj['jobId'] = this.jobId;

    this.clientsService.addReview(finalObj).then(data => {
      if (data.success) {
        this.alertService.createAlert(data.message, 1);
        this.getReview({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  update() {
    let finalObj = {};
    finalObj['remark'] = this.remarkData.value;
    finalObj['reviewDateId'] = this.reviewId;

    this.clientsService.updateReview(finalObj).then(data => {
      if (data.success) {
        this.alertService.createAlert(data.message, 1);
        this.getReview({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    });
  }

  close(): void {
    this.dialogRef.close('save');
  }

  changeRemark(id) {
    this.remark = !this.remark;
    this.reviewId = id;
  }

  getReview(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.currentPage;
    filter['jobId'] = this.jobId;
    this.clientsService.getReview(filter).then(data => {
      if (data.success) {
        this.reviewList = data.results;
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
    this.getReview({});

  }
}
