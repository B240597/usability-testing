import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
// import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { AlertService } from '../../../../shared/services/alert.service';
import { AddFatComponent } from './add-fat/add-fat.component';

@Component({
  selector: 'app-fat-master',
  templateUrl: './fat-master.component.html',
  styleUrls: ['./fat-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AlertService]
})
export class FatMasterComponent implements OnInit {

  public popoverTitle: string = 'Confirm Delete';
  public popoverMessage: string = 'Are you sure you want to delete this.?';
  public popoverStatusTitle: string = 'Confirm Status Change';
  public popoverStatusMessage: string = 'Are you sure you want to change status.?';
  public cancelClicked: boolean = false;

  filterToggle: boolean;

  public searchText: string;
  public page: any;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
      public dialog: MatDialog, private alertService: AlertService) {
      this.settings = this.appSettings.settings;
  }

  ngOnInit() {

  }

  tableList = [
    {sno:"1",fat:"Process Design Sheet",code:"01"},
    {sno:"2",fat:"PF Drawing",code:"02"},
    {sno:"3",fat:"BOM for Plates",code:"03"},
    {sno:"4",fat:"BOM for tubes/pipes",code:"04"},
    {sno:"5",fat:"BOM for pumps",code:"05"},
    // {fat:"USA",status:true},
    // {fat:"Switzerland",status:true},
    // {fat:"Ireland",status:true},
    // {fat:"UK",status:true}
  ]

  public openUserDialog(id) {
      let dialogRef = this.dialog.open(AddFatComponent, {
          data: id,
          height: 'auto',
          width: '600px'
      });
      dialogRef.afterClosed().subscribe(data => {
      });
  }


  deleteUser(){
      this.alertService.createAlert('Successfully deleted.', 1);
  }

  saveStatus() {
      this.alertService.createAlert('Successfully saved.', 1);
  }


}
