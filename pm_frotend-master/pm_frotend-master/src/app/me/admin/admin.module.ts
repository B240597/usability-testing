import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LookupComponent } from './lookup/lookup.component';
import { SettingsComponent } from './settings/settings.component';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { DragulaService } from 'ng2-dragula';
import { DataTableModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { UsersComponent } from './users/users.component';
import { AddLookupDialogComponent } from './lookup/add-lookup-dialog/add-lookup-dialog.component';
export const routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', loadChildren: './users/users.module#UsersModule', data: { breadcrumb: 'Users' }},
  { path: 'lookup', component: LookupComponent, pathMatch: 'full', data: { breadcrumb: 'Lookup Options' } },
  { path: 'settings', component: SettingsComponent, pathMatch: 'full', data: { breadcrumb: 'Settings' } },
  { path: 'masterdata', loadChildren: './masterdata/masterdata.module#MasterdataModule', data: { breadcrumb: 'Master Data'} },
];

@NgModule({
  imports: [
    CommonModule, ModalModule, SharedModule,ConfirmationPopoverModule,
    RouterModule.forChild(routes), DataTableModule,FormsModule,ReactiveFormsModule,TableModule,
    SharedModule
  ], providers: [DragulaService],
  declarations: [LookupComponent, SettingsComponent,AddLookupDialogComponent ],
  entryComponents:[
    AddLookupDialogComponent,
    // AddColorcodeDialogComponent
    
  ]
})
export class AdminModule { }
