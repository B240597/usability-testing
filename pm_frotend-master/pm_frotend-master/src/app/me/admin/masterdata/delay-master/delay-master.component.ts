import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
// import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { AlertService } from '../../../../shared/services/alert.service';
import {AddDelayComponent} from './add-delay/add-delay.component';

@Component({
  selector: 'app-delay-master',
  templateUrl: './delay-master.component.html',
  styleUrls: ['./delay-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AlertService]
})
export class DelayMasterComponent implements OnInit {

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
    {sno:"1",fat:"Associate on Leave",code:"01"},
    {sno:"2",fat:"Additional Parts requirements",code:"02"},
    {sno:"3",fat:"issue in the Installation Plant",code:"03"},
    {sno:"4",fat:"Material Issues",code:"04"},
    {sno:"5",fat:"Issue from Client side",code:"05"},
    // {fat:"USA",status:true},
    // {fat:"Switzerland",status:true},
    // {fat:"Ireland",status:true},
    // {fat:"UK",status:true}
  ]

  public openUserDialog(id) {
    let dialogRef = this.dialog.open(AddDelayComponent, {
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
