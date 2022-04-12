import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClientsService } from '../clients/clients.service';
import { ProjectsService } from '../projects/projects.service';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss']
})
export class JobManagementComponent implements OnInit {

  public popoverTitle1: string = 'Archive';
  public popoverMessage1: string = 'Do you want to archive this task? This action cannot be undone.';
  public popoverStatusTitle1: string = 'Confirm Change';
  public popoverStatusMessage1: string = 'Are you sure you want to change status.?';
  public cancelClicked1: boolean = false;

  pageEvent: PageEvent;
  public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '5');
  public currentPage = 0;
  public totalSize = 0;

  engineer = new FormControl();
  keywordSearch = new FormControl();
  approved = new FormControl();
  filterToggle = false;
  engineerList: any;
  showEmpty = true;
  jobList: any;
  usingObject: {};

  constructor(
    public projectsService: ProjectsService,
    public alertService: AlertService,
    public clientsService: ClientsService
  ) { }

  ngOnInit() {
    this.getEngineer();
  }

  selectEngineer() {
    this.getJobs({ 'engineer': this.engineer.value });
  }

  getEngineer() {
    this.projectsService.getUsersDropdown({ userType: 3 }).then(data => {
      if (data.success) {
        this.engineerList = data.results;
        if (this.engineerList.length) {
          this.engineer.setValue(this.engineerList[0].userId);
          // this.getJobs({ 'engineer': this.engineerList[0].userId });
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  getJobs(filter) {
    this.jobList = ''
    filter['per_page'] = this.pageSize;
    filter['page'] = this.currentPage;
    this.clientsService.getJobManagement(filter).then(data => {
      if (data.success) {
        this.jobList = data.results;
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

  fliterSearch() {

    let filterObj = {};
    if (this.keywordSearch.value) {
      filterObj['keywordSearch'] = this.keywordSearch.value;
    }
    if (this.approved.value) {
      filterObj['status'] = this.approved.value;
    }
    this.usingObject = filterObj;
    this.getJobs(filterObj);
  }

  clearFilters() {
    this.keywordSearch.setValue('');
    this.approved.setValue('');
    this.getJobs({});
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    if (this.usingObject)
      this.getJobs(this.usingObject);
    else
      this.getJobs({});
  }
}
