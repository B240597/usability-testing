import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DeleteConfirmDialogComponent } from 'src/app/shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog, PageEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AddprojectDialogComponent } from '../addproject-dialog/addproject-dialog.component';
import { ProjectGridcolumnsComponent } from '../project-gridcolumns/project-gridcolumns.component';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { ProjectsService } from '../../projects.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { StatusDialogComponent } from 'src/app/shared/status-dialog/status-dialog.component';

@Component({
  selector: 'app-project-gridview',
  templateUrl: './project-gridview.component.html',
  styleUrls: ['./project-gridview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectGridviewComponent implements OnInit {

  public single: any[];
  public multi: any[];
  public triple: any[];
  public showLegend = false;
  public gradient = false;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00']
  };
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false;
  public settings: Settings;

  pageEvent: PageEvent;
  public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '5');
  public currentPage = 0;
  public totalSize = 0;
  filterToggle = false;

  public status_filter = "";
  projectCode = new FormControl();
  projectManager = new FormControl();
  startDate = new FormControl();
  DeliveryDate = new FormControl();
  projectStatus = new FormControl();
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status?';
  public cancelClicked: boolean = false;

  userType: string;
  projectList: any;
  showEmpty: boolean;
  projectManagerList: any;
  usingObject: any;
  gridColumns = [
    {
      grid_columns: "11111111111",
      project_grid_column_id: 1
    }
  ];

  constructor(
    public dialog: MatDialog,
    public appSettings: AppSettings,
    public projectsService: ProjectsService,
    public alertService: AlertService
  ) {
    this.userType = localStorage.getItem('userType');
    this.settings = this.appSettings.settings;
    this.getGridColumns({});
  }

  ngOnInit() {
    this.getProjects({});
    this.getprojectManager();
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

  public getProjects(filter) {
    filter['per_page'] = this.pageSize;
    filter['page'] = this.currentPage;
    filter['userType'] = localStorage.getItem('userType');
    this.projectsService.getProject(filter).then(data => {
      if (data.success) {
        this.projectList = data.results;
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

  openProjectDialog(stat) {
    let dialogRef = this.dialog.open(AddprojectDialogComponent, {
      data: stat,
      height: 'auto',
      width: '750px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(prospects => {
      if (prospects == 'save') {
        this.getProjects({});
      }
    });
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
        finalObj['projectId'] = data.projectId;
        finalObj['deleteStatus'] = 1;
        this.projectsService.updateProjectStatus(finalObj).then(data => {
          if (data.success) {
            this.alertService.createAlert("Project deleted successfully", 1);
            this.getProjects({});
          }
          else {
            this.alertService.createAlert(data.message, 0);
          }
        })
      }
    });
  }

  fliterSearch() {
    let filterObj = {};
    if (this.projectCode.value) {
      filterObj['projectCode'] = this.projectCode.value;
    }
    if (this.projectManager.value) {
      filterObj['projectManager'] = this.projectManager.value;
    }
    if (this.projectManager.value) {
      filterObj['projectManager'] = this.projectManager.value;
    }
    if (this.startDate.value) {
      filterObj['startDate'] = this.startDate.value;
    }
    if (this.DeliveryDate.value) {
      filterObj['deliveryDate'] = this.DeliveryDate.value;
    }
    if (this.projectStatus.value) {
      filterObj['status'] = this.projectStatus.value;
    }
    this.usingObject = filterObj;
    this.getProjects(filterObj);
  }

  clearFilters() {
    this.projectCode.setValue('');
    this.projectManager.setValue('');
    this.startDate.setValue('');
    this.DeliveryDate.setValue('');
    this.projectStatus.setValue('');
    this.getProjects({});
  }

  scrollGrid(side) {
    var ele = document.getElementById('grid-table-container');
    if (side == 'right')
      ele.scrollLeft += 210;
    else
      ele.scrollLeft -= 210;
  }

  openGridColumns(stat) {
    console.log(stat);
    let dialogRef = this.dialog.open(ProjectGridcolumnsComponent, {
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

  openStatusDialog(data, status) {
    let obj = {};
    if (status == 1) {
      obj['heading'] = 'Project Status Change'
      obj['action'] = 'Are you sure you want to change Active to On Hold ?'
    } else if (status == 2) {
      obj['heading'] = 'Project Status Change'
      obj['action'] = 'Are you sure you want to change On Hold to Inactive ?'
    } else if (status == 3) {
      obj['heading'] = 'Project Status Change'
      obj['action'] = 'Are you sure you want to change Inactive to Active ?'
    }


    let dialogRef = this.dialog.open(StatusDialogComponent, {
      data: obj,
      height: 'auto',
      width: '600px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(statusData => {
      if (statusData) {
        let finalObj = {};
        finalObj['projectId'] = data.projectId;
        if (status == 1) {
          finalObj['status'] = 2;
        } else if (status == 2) {
          finalObj['status'] = 3;
        } else if (status == 3) {
          finalObj['status'] = 1;
        }
        this.projectsService.updateProjectStatus(finalObj).then(data => {
          if (data.success) {
            this.alertService.createAlert(data.message, 1);
            this.getProjects({});
          }
          else {
            this.alertService.createAlert(data.message, 0);
          }
        })
      }
    });
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    if (this.usingObject)
      this.getProjects(this.usingObject);
    else
      this.getProjects({});
  }

  public getGridColumns(filter) {
    this.projectsService.getProjectGridColumns(filter).then(data => {
      if (data.success) {
        this.gridColumns = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  openJob(id){
    localStorage.setItem('selectedJob', id);
  }
  
}
