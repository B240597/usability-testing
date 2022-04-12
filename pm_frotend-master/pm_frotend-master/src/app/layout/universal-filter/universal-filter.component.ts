import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
// import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-universal-filter',
  templateUrl: './universal-filter.component.html',
  styleUrls: ['./universal-filter.component.scss']
})
export class UniversalFilterComponent implements OnInit {

  public userImage = '../../../../assets/img/users/default-user.jpg';
  customers = [{id:1 , value:"ABC Pvt Ltd"} , {id:2 , value:"Serene Logistics"} , {id:3 , value:"Option Matrix Pvt Ltd"} ,  ]
  origins = [{id:1 , value:"North-1"} , {id:2 , value:"North-2"} , {id:3 , value:"East-1"} , {id:4 , value:"South-1"} , {id:5 , value:"South-2"} , ]
  constructor(public dialog: MatDialog) { }
//   public openUserDialog(id) {
//     let dialogRef = this.dialog.open(PasswordDialogComponent, {
//         data: id,
//         height: 'auto',
//         width: '600px',
//         autoFocus:false
//     });
//     dialogRef.afterClosed().subscribe(data => {
//     });
// }
// public openUserDialogs(id) {
//   let dialogRef = this.dialog.open(ProfileDialogComponent, {
//       data: id,
//       height: 'auto',
//       width: '600px',
//       autoFocus:false
//   });
//   dialogRef.afterClosed().subscribe(data => {
//   });
// }
  ngOnInit() {
  }

  // logoutUser() {
  //   this.alertService.createAlert("Logged out Successfully",1);
  // }
}
