import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StyleManager } from './style-manager/style-manager';
import {
  InputTextModule, GalleriaModule, MenubarModule, CheckboxModule, DialogModule, MessagesModule, GrowlModule,
  PanelModule, RadioButtonModule, InputSwitchModule, SelectButtonModule, DataTableModule, DataListModule,
  SplitButtonModule, ButtonModule, DropdownModule, AccordionModule, ProgressBarModule, ConfirmDialogModule,
  TooltipModule,
  TreeModule
} from 'primeng/primeng';
import { CalendarModule } from 'angular-calendar';
import { NgxEditorModule } from 'ngx-editor';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
import { jqxKanbanComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxkanban';
import { CarouselModule } from 'primeng/carousel';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ScheduleDialogComponent } from '../schedule/schedule-dialog/schedule-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';
import { AdditemtypeDialogComponent } from './additemtype-dialog/additemtype-dialog.component';


@NgModule({
  imports: [
    CarouselModule,
    CalendarModule,
    CommonModule,
    NgxEditorModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    TreeModule,
    InputTextModule, GalleriaModule, MenubarModule,
    CheckboxModule, DialogModule, MessagesModule, GrowlModule,
    PanelModule, CalendarModule, RadioButtonModule, InputSwitchModule,
    SelectButtonModule, DataTableModule, DataListModule,
    SplitButtonModule, ButtonModule, DropdownModule, AccordionModule,
    ProgressBarModule, ConfirmDialogModule,
    TooltipModule, OwlDateTimeModule, OwlNativeDateTimeModule, FormsModule,
    ReactiveFormsModule,
    CalendarModule, NgxChartsModule
  ],
  exports: [
    CarouselModule, OwlDateTimeModule, OwlNativeDateTimeModule, NgxChartsModule,
    CalendarModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxEditorModule,
    TreeModule,
    MatStepperModule, InputTextModule, GalleriaModule, MenubarModule,
    CheckboxModule, DialogModule, MessagesModule, GrowlModule,
    PanelModule, CalendarModule, RadioButtonModule, InputSwitchModule,
    SelectButtonModule, DataTableModule, DataListModule,
    SplitButtonModule, ButtonModule, DropdownModule, AccordionModule,
    ProgressBarModule, ConfirmDialogModule,
    TooltipModule, jqxKanbanComponent, FormsModule,
    ReactiveFormsModule,
    CalendarModule
  ],
  entryComponents: [
    ScheduleDialogComponent],
  declarations: [
    jqxKanbanComponent,
    ScheduleDialogComponent,
    DeleteConfirmDialogComponent,
    AdditemtypeDialogComponent
  ],
  providers: [StyleManager, { provide: LocationStrategy, useClass: HashLocationStrategy },]
})
export class SharedModule { }
