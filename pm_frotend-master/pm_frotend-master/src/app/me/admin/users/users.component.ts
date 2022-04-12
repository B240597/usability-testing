import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { UsersService } from './users.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { AlertService } from '../../../shared/services/alert.service';
import { FormControl } from '@angular/forms';
import { DeleteConfirmDialogComponent } from 'src/app/shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { CreatePasswordComponent } from './create-password/create-password.component';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [UsersService, AlertService]
})
export class UsersComponent implements OnInit {

    public popoverTitle: string = 'Confirm Delete';
    public popoverMessage: string = 'Are you sure you want to delete this?';
    public popoverStatusTitle: string = 'Confirm Status Change';
    public popoverStatusMessage: string = 'Are you sure you want to change status?';
    public cancelClicked: boolean = false;

    filterToggle: boolean;
    tableList: any;
    pageEvent: PageEvent;
    public pageSize = parseInt(localStorage.getItem('settings') ? localStorage.getItem('settings') : '5');
    public currentPage = 0;
    public totalSize = 0;
    public searchText: string;
    public page: any;
    public settings: Settings;
    filterUser = new FormControl();
    filterStatus = new FormControl();
    Users: any;
    usingObject: any;
    showEmpty: boolean = true;
    status = [{ id: 1, value: "Active" }, { id: 2, value: "Inactive" }];
    userType: string;
    userId: any;
    constructor(public appSettings: AppSettings,
        public dialog: MatDialog,
        public usersService: UsersService, private alertService: AlertService) {
        this.userType = localStorage.getItem('userType');
        this.userId = JSON.parse(localStorage.getItem('optima_heat_user_info')).userId;
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.getUsers({});
    }

    filterSearch() {
        let filterObj = {};
        if (this.filterUser.value) {
            filterObj['userName'] = this.filterUser.value;
        }
        if (this.filterStatus.value) {
            if (this.filterStatus.value == "2") {
                filterObj['status'] = 0;
            }
            else {
                filterObj['status'] = 1;
            }
        }
        this.usingObject = filterObj;
        this.getUsers(filterObj);
    }

    clearFilters() {
        this.filterUser.setValue('');
        this.filterStatus.setValue('');
        this.usingObject = {}
        this.getUsers({});
    }

    public getUsers(filter) {
        filter['per_page'] = this.pageSize;
        filter['page'] = this.currentPage;
        this.usersService.getUsers(filter).then(data => {
            if (data.success) {
                this.Users = data.results;
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

    public openUserDialog(id) {
        let dialogRef = this.dialog.open(UserDialogComponent, {
            data: id,
            height: 'auto',
            width: '600px',
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data == 'save') {
                this.getUsers({});
            }
        });
    }

    public changePasswordDialog(user) {
        let dialogRef = this.dialog.open(CreatePasswordComponent, {
            data: user,
            height: 'auto',
            width: '600px',
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data == 'save') {
                this.getUsers({});
            }

        });
    }

    updateUserStatus(id, status) {
        let finalObj = {};
        finalObj['userId'] = id;
        finalObj['status'] = status;
        this.usersService.updateUserStatus(finalObj).then(data => {
            if (data.success) {
                this.alertService.createAlert(data.message, 1);
                this.getUsers({});
            }
            else {
                this.alertService.createAlert(data.message, 0);
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
                finalObj['userId'] = data.userId;
                finalObj['deleteStatus'] = 1;
                this.usersService.updateUserStatus(finalObj).then(data => {
                    if (data.success) {
                        this.alertService.createAlert(data.message, 1);
                        this.getUsers({});
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
            this.getUsers(this.usingObject);
        else
            this.getUsers({});
    }

}