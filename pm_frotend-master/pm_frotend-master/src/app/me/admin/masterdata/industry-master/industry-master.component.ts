import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
// import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { AlertService } from '../../../../shared/services/alert.service';
import { AddIndustryComponent } from './add-industry/add-industry.component';

@Component({
  selector: 'app-industry-master',
  templateUrl: './industry-master.component.html',
  styleUrls: ['./industry-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AlertService]
})
export class IndustryMasterComponent implements OnInit {

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
    {sno:"1",fat:"Sales",code:"S"},
    {sno:"2",fat:"Design",code:"D"},
    {sno:"3",fat:"Purchase",code:"P"},
    {sno:"4",fat:"Erection & Commissioning",code:"E"},
    {sno:"5",fat:"Commercial",code:"C"},
        // {fat:"Healthcare",status:true},
    // {fat:"Transportation",status:true},
    // {fat:"Infrastructure",status:true},
    // {fat:"Installation",status:true},
    // {fat:"Maintenance and User's Manuals",status:true}
  ]

  public openUserDialog(id) {
      let dialogRef = this.dialog.open(AddIndustryComponent, {
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
