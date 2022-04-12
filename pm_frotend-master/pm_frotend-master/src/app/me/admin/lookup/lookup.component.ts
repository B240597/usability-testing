import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AddLookupDialogComponent } from './add-lookup-dialog/add-lookup-dialog.component';
import { MatDialog, PageEvent } from '@angular/material';
import { AlertService } from '../../../shared/services/alert.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AlertService]
})
export class LookupComponent implements OnInit {
  userType: string;

  constructor(public dialog: MatDialog, private alertService: AlertService, private adminService: AdminService, private changeDetectorRefs: ChangeDetectorRef) { }
  public popoverTitle: string = 'Confirm Delete';
  public popoverMessage: string = 'Are you sure you want to delete this.?';
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status.?';
  public cancelClicked: boolean = false;
  tableList: any;
  pageEvent: PageEvent;
  public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '5');
  public currentPage = 0;
  public totalSize = 0;
  public page: any;
  showEmpty: boolean = true;

  ngOnInit() {
    this.getLookupOptions();
    this.userType = localStorage.getItem('userType');
  }

  getLookupOptions() {
    let filterObj = {};
    filterObj['page'] = this.currentPage;
    filterObj['per_page'] = this.pageSize;
    this.adminService.getLookupOptions(filterObj)
      .then(data => {
        if (data.success) {
          this.tableList = data.results;
          this.totalSize = data.count;
          data.count ? this.showEmpty = false : this.showEmpty = true;
          this.changeDetectorRefs.detectChanges();
        } else {
          this.tableList = [];
          this.totalSize = 0;
          this.showEmpty = true;
          this.alertService.createAlert(data.message, 0);
        }
      }
      );
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getLookupOptions();
  }

  public updateLookupDialog(lookup) {
    let dialogRef = this.dialog.open(AddLookupDialogComponent, {
      data: lookup,
      height: 'auto',
      width: '600px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data == 'save') {
        this.getLookupOptions();
      }
    });
  }

  updateLookup(lookup_id, changedValue, type) {
    let detail = { "lookup_id": lookup_id };
    if (type == 'status') {
      detail['is_active'] = changedValue;
    } else {
      detail['is_deleted'] = changedValue;
    }
    this.adminService.updateLookup(detail)
      .then(data => {
        if (data.success) {
          let message = "";
          if (type == 'status')
            message = changedValue ? "activated" : "inactivated";
          else
            message = "deleted";
          this.alertService.createAlert("Lookup " + message + " successfully", 1);
          this.getLookupOptions();
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
  }


}
