import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { GridViewComponent } from './grid-view/grid-view.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AlertService } from 'src/app/shared/services/alert.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DeleteConfirmDialogComponent } from 'src/app/shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { AddClientDialogComponent } from './add-client-dialog/add-client-dialog.component';
import { GridColumnsJobsComponent } from './grid-columns-jobs/grid-columns-jobs.component';
import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';

export const routes = [
  { path: '', redirectTo: "gridview", pathMatch: 'full' },
  { path: 'gridview', component: GridViewComponent },
];

@NgModule({
  declarations: [ClientsComponent, GridViewComponent, AddClientDialogComponent, GridColumnsJobsComponent, IssueDialogComponent, UploadExcelComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule, ConfirmationPopoverModule,
    OwlDateTimeModule, OwlNativeDateTimeModule, AgmCoreModule, AgmJsMarkerClustererModule
  ],
  providers: [AlertService],
  entryComponents: [
    AddClientDialogComponent,
    DeleteConfirmDialogComponent,
    GridColumnsJobsComponent,
    IssueDialogComponent,
    UploadExcelComponent
  ]
})
export class ClientsModule { }
