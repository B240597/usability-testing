import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { IssueDisDialogComponent } from './issue-dis-dialog/issue-dis-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export const routes = [
  { path: '', component: DashboardComponent, data: { breadcrumb: 'Dashboard' } }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule, NgxChartsModule, RouterModule.forChild(routes),
    SharedModule, ConfirmationPopoverModule, ReactiveFormsModule, FormsModule,
    ChartsModule,
    MatDialogModule

  ],
  entryComponents: [],

})
export class DashboardModule { }

