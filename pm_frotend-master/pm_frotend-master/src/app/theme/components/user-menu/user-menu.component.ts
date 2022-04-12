import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { MatDialog } from '@angular/material';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AlertService]
})
export class UserMenuComponent implements OnInit {
  public userImage = '../../../../assets/img/users/default-user.jpg';
  loginDetails: any;
  name: any;
  role: string;
  constructor(public dialog: MatDialog, public alertService: AlertService) { 
    this.loginDetails = JSON.parse(localStorage.getItem('optima_heat_user_info'));
    this.name = this.loginDetails.name;
    if(this.loginDetails.userType == 1){
      this.role = 'Super Admin';
    }else if(this.loginDetails.userType == 2){
      this.role = 'Project Manager';
    }else if(this.loginDetails.userType == 3){
      this.role = 'Engineer';
    }
  }

  public openUserDialog(id) {
    let dialogRef = this.dialog.open(PasswordDialogComponent, {
      data: id,
      height: 'auto',
      width: '600px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  public openUserDialogs(id) {
    let dialogRef = this.dialog.open(ProfileDialogComponent, {
      data: id,
      height: 'auto',
      width: '600px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  ngOnInit() {
    let project = JSON.parse(localStorage.getItem('optima_heat_user_info'));
  }

  logoutUser() {
    localStorage.clear();
    this.alertService.createAlert("Logged out Successfully", 1);
  }

}
