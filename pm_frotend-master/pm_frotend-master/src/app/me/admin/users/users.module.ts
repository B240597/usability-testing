import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../theme/pipes/pipes.module';
import { UsersComponent } from './users.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { PermissionsComponent } from './permissions/permissions.component'
import { UsersService } from './users.service';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { TooltipModule } from "ngx-tooltip";

export const routes = [
  { path: '', component: UsersComponent, pathMatch: 'full', data: { breadcrumb: 'Users' }},
  { path: 'permissions', component: PermissionsComponent, pathMatch: 'full', data: { breadcrumb: 'Permissions' }}
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TooltipModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    // InMemoryWebApiModule.forFeature(Data, { delay: 500 }),
    ConfirmationPopoverModule
  ],
  declarations: [
    UsersComponent,
    UserDialogComponent,
    PermissionsComponent,
    CreatePasswordComponent
  ],
  entryComponents:[
    UserDialogComponent,
    CreatePasswordComponent
  ],
  providers:[
    UsersService
  ]
})
export class UsersModule { }
