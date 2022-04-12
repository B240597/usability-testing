import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AlertService } from 'src/app/shared/services/alert.service';
import { DragDropModule } from 'primeng/primeng';
import { DndModule } from 'ngx-drag-drop';
import { DragulaService } from 'ng2-dragula';
import { ProjectGridviewComponent } from './project-master/project-gridview/project-gridview.component';
import { AddprojectDialogComponent } from './project-master/addproject-dialog/addproject-dialog.component';
import { DeleteConfirmDialogComponent } from 'src/app/shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { ProjectGridcolumnsComponent } from './project-master/project-gridcolumns/project-gridcolumns.component';
import { MglTimelineModule } from 'angular-mgl-timeline';

export const routes = [
  { path: '', redirectTo: 'gridview', pathMatch: 'full' },
  { path: 'gridview', component: ProjectGridviewComponent },
];

@NgModule({
  declarations: [ProjectGridviewComponent, AddprojectDialogComponent, ProjectGridcolumnsComponent],
  imports: [
    CommonModule,NgxChartsModule,RouterModule.forChild(routes),
    SharedModule,ConfirmationPopoverModule,ReactiveFormsModule,FormsModule,
    OwlDateTimeModule,OwlNativeDateTimeModule,DndModule,DragDropModule,MglTimelineModule
  ],
  providers: [AlertService,DragulaService],
  entryComponents: [DeleteConfirmDialogComponent,AddprojectDialogComponent,ProjectGridcolumnsComponent]
})
export class ProjectsModule { }

