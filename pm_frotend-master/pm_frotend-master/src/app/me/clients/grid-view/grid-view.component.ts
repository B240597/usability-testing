import { Component, OnInit, Inject, ViewEncapsulation, Injectable } from '@angular/core';
// import { AddClientDialogComponent } from '../add-client-dialog/add-client-dialog.component';
import { DeleteConfirmDialogComponent } from 'src/app/shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { PageEvent, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { GridColumnsJobsComponent } from '../grid-columns-jobs/grid-columns-jobs.component';
import { IssueDialogComponent } from '../issue-dialog/issue-dialog.component';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { UploadExcelComponent } from '../upload-excel/upload-excel.component';
import { DownloadExcelService } from '../download-excel.service';
import { ClientsService } from '../clients.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProjectsService } from '../../projects/projects.service';
import { StatusDialogComponent } from 'src/app/shared/status-dialog/status-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@Injectable({
  providedIn: 'root'
})
export class GridViewComponent implements OnInit {

  public popoverTitle1: string = 'Archive';
  public popoverMessage1: string = 'Do you want to archive this task? This action cannot be undone.';
  public popoverStatusTitle1: string = 'Confirm Change';
  public popoverStatusMessage1: string = 'Are you sure you want to change status.?';
  public cancelClicked1: boolean = false;

  public excelData = [];
  public settings: Settings;

  pageEvent: PageEvent;
  public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '5');
  public currentPage = 0;
  public totalSize = 0;
  filterToggle = false;

  public status_filter = "";
  selectProject = new FormControl();

  jobCode = new FormControl();
  engineer = new FormControl();
  projectManager = new FormControl();
  targetDate = new FormControl();
  completionDate = new FormControl();
  ReviewDate = new FormControl();
  status = new FormControl();
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status?';
  public cancelClicked: boolean = false;
  userType: string;
  projectList: any;
  projectManagerList: any;
  engineerList: any;
  usingObject: any;
  showEmpty = true;
  jobList = [];
  dueDate: any;
  isArchived = false;
  gridColumns = [
    {
      grid_columns: "11111111111111",
      job_grid_column_id: 1
    }
  ];
  selectedProjectId: any;
  rejectJob: string;
  notification: any;

  constructor(
    public dialog: MatDialog,
    public appSettings: AppSettings,
    public downloadExcelService: DownloadExcelService,
    public clientsService: ClientsService,
    public alertService: AlertService,
    public projectsService: ProjectsService,
    public activatedRoute: ActivatedRoute) {
    this.selectedProjectId = localStorage.getItem('selectedJob');
    this.getprojectList();
    this.rejectJob = localStorage.getItem('selectedJobcode');
    if (this.rejectJob) {
      this.getJobs({ 'jobCode': this.rejectJob });
      localStorage.removeItem('rejectJob')
    }

    this.userType = localStorage.getItem('userType');
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {

    this.getprojectManager();
    this.getEngineer();
    this.getGridColumns({});
  }

  checkArchive(value) {
    this.isArchived = value;
    if (this.isArchived) {
      this.getJobs({});
    } else {
      this.getJobs({});
    }

  }

  fliterSearch() {
    console.log('entered filter')
    let filterObj = {};
    if (this.jobCode.value) {
      filterObj['jobCode'] = this.jobCode.value;
    }
    if (this.engineer.value) {
      filterObj['engineer'] = this.engineer.value;
    }
    if (this.projectManager.value) {
      filterObj['projectManager'] = this.projectManager.value;
    }
    if (this.targetDate.value) {
      filterObj['targetDate'] = this.targetDate.value;
    }
    if (this.completionDate.value) {
      filterObj['completionDate'] = this.completionDate.value;
    }
    if (this.ReviewDate.value) {
      filterObj['reviewDate'] = this.ReviewDate.value;
    }

    if (this.status.value) {
      filterObj['status'] = this.status.value;
    }
    this.usingObject = filterObj;
    this.isArchived = false;
    this.getJobs(filterObj);
  }

  clearFilters() {
    this.jobCode.setValue('');
    this.engineer.setValue('');
    this.projectManager.setValue('');
    this.targetDate.setValue('');
    this.completionDate.setValue('');
    this.ReviewDate.setValue('');
    this.status.setValue('');
    this.getJobs({});
  }

  getJobs(filter) {

    if (this.isArchived) {
      filter['archived'] = 1
    }
    this.jobList = [];
    filter['per_page'] = this.pageSize;
    filter['page'] = this.currentPage;
    filter['projectId'] = this.selectProject.value;
    filter['userType'] = localStorage.getItem('userType');
    this.clientsService.getJob(filter).then(data => {
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

  openDeleteDialog(assets) {
    let dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: assets,
      height: 'auto',
      width: 'auto',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null && data !== undefined) {
        let finalObj = {};
        finalObj['jobId'] = data.jobId;
        finalObj['deleteStatus'] = 1;
        this.clientsService.updateJobStatus(finalObj).then(data => {
          if (data.success) {
            this.alertService.createAlert("Job has successfully deleted ", 1);
            if (this.usingObject)
              this.getJobs(this.usingObject);
            else
              this.getJobs({});
          }
          else {
            this.alertService.createAlert(data.message, 0);
          }
        })
      }
    });
  }

  openGridColumn(stat) {
    let dialogRef = this.dialog.open(GridColumnsJobsComponent, {
      data: stat,
      height: 'auto',
      width: '600px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(prospects => {
      if (prospects == 'save') {
        this.getGridColumns({});
      }
    });
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
        this.getJobs({});
      }
    });
  }

  uploadExcel() {
    let obj = {};
    obj['id'] = this.selectProject.value;
    obj['name'] = this.projectList.find(o => o.projectId === this.selectProject.value).projectName;
    let dialogRef = this.dialog.open(UploadExcelComponent, {
      data: obj,
      height: 'auto',
      width: '450px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null && data !== undefined) {

        this.getJobs({});
      }
    });
  }

  openIssuesDilog(issue) {
    let dialogRef = this.dialog.open(IssueDialogComponent, {
      data: issue,
      height: 'auto',
      width: '800px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null && data !== undefined) {
        this.getJobs({});
      }
    });
  }

  //template function
  dowloadBulkUploadDataTemplate() {
    this.excelData = []
    this.excelData.push({ 'Job #': "" });
    this.excelData.push({ 'Description': "" });
    this.excelData.push({ 'Engineer': "" });
    this.excelData.push({ 'Start (mm-dd-yyyy)': "" });
    this.excelData.push({ 'Target (mm-dd-yyyy)': "" });
    this.excelData.push({ 'Review (mm-dd-yyyy)': "" });
    let currentDate = (new Date).toISOString().slice(0, 10);
    let fileName = 'Data_file - ' + currentDate;
    this.downloadExcelService.exportAsExcelFile(this.excelData, fileName)
  }

  getprojectList() {
    let filter = {};
    filter['userType'] = localStorage.getItem('userType');
    this.clientsService.getProjectDropdown(filter).then(data => {
      if (data.success) {
        this.projectList = data.results;
        if (this.projectList.length && !this.selectedProjectId) {
          this.selectProject.setValue(this.projectList[0].projectId);
          this.getProjectDueDate(this.projectList[0].projectId);
        } else {
          this.selectProject.setValue(this.selectedProjectId);
          this.getProjectDueDate(this.selectedProjectId);
          localStorage.removeItem('selectedJob');
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  getprojectManager() {
    this.projectsService.getUsersDropdown({ userType: 2 }).then(data => {
      if (data.success) {
        this.projectManagerList = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  getEngineer() {
    this.projectsService.getUsersDropdown({ userType: 3 }).then(data => {
      if (data.success) {
        this.engineerList = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  getProjectDueDate(Id) {
    this.dueDate = this.projectList.filter(obj => obj.projectId === Id)[0].deliveryDate;
    this.getJobs({ 'projectId': Id });
  }

  approveJob(data, value) {
    let finalObj = {};
    finalObj['jobId'] = data.jobId;
    finalObj['approveStatus'] = value;
    this.clientsService.updateJobStatus(finalObj).then(data => {
      if (data.success) {
        this.alertService.createAlert("Job Approve value has successfully changed ", 1);
        if (this.usingObject)
          this.getJobs(this.usingObject);
        else
          this.getJobs({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  refresh() {
    if (this.usingObject)
      this.getJobs(this.usingObject);
    else
      this.getJobs({});
  }

  declineJob(data, value) {
    let finalObj = {};
    finalObj['jobId'] = data.jobId;
    finalObj['declineStatus'] = value;
    this.clientsService.updateJobStatus(finalObj).then(data => {
      if (data.success) {
        this.alertService.createAlert("Job Decline value has successfully changed ", 1);
        if (this.usingObject)
          this.getJobs(this.usingObject);
        else
          this.getJobs({});
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  openStatusDialog(data, status) {
    if (this.userType == 'associate') {
      let obj = {};
      if (status == 1) {
        obj['heading'] = 'Project Status Change'
        obj['action'] = 'Are you sure you want to change - to In Process ?'
      } else if (status == 2) {
        obj['heading'] = 'Project Status Change'
        obj['action'] = 'Are you sure you want to change In Process to Submitted ?'
      }
      if (status == 1 || status == 2) {
        let dialogRef = this.dialog.open(StatusDialogComponent, {
          data: obj,
          height: 'auto',
          width: '600px',
          autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(statusData => {
          if (statusData) {
            let finalObj = {};
            finalObj['jobId'] = data.jobId;

            if (status == 1) {
              finalObj['status'] = 2;
            } else if (status == 2) {
              finalObj['status'] = 3;
            }
            this.clientsService.updateJobStatus(finalObj).then(data => {
              if (data.success) {
                this.alertService.createAlert("Job status has successfully changed ", 1);
                if (this.usingObject)
                  this.getJobs(this.usingObject);
                else
                  this.getJobs({});
              }
              else {
                this.alertService.createAlert(data.message, 0);
              }
            })
          }
        });
      }
    }
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    if (this.usingObject)
      this.getJobs(this.usingObject);
    else
      this.getJobs({});
  }

  public getGridColumns(filter) {
    this.clientsService.getJobGridColumns(filter).then(data => {
      if (data.success) {
        this.gridColumns = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

}
