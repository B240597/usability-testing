import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-project-gridcolumns',
  templateUrl: './project-gridcolumns.component.html',
  styleUrls: ['./project-gridcolumns.component.scss']
})
export class ProjectGridcolumnsComponent implements OnInit {

  gridColumnForm: FormGroup;

  constructor(
    public fb: FormBuilder,
     @Inject(MAT_DIALOG_DATA) public grids: any,
      public dialogRef: MatDialogRef<ProjectGridcolumnsComponent>,
       private projectsService: ProjectsService, private alertService: AlertService) {
    this.createGridColumnGroup();
  }

  ngOnInit() {
    console.log(this.grids)
    this.gridColumnForm.controls['projectCode'].setValue(parseInt(this.grids[0].grid_columns.split('')[0]));
    this.gridColumnForm.controls['projectName'].setValue(parseInt(this.grids[0].grid_columns.split('')[1]));
    this.gridColumnForm.controls['clientName'].setValue(parseInt(this.grids[0].grid_columns.split('')[2]));
    this.gridColumnForm.controls['projectType'].setValue(parseInt(this.grids[0].grid_columns.split('')[3]));
    this.gridColumnForm.controls['location'].setValue(parseInt(this.grids[0].grid_columns.split('')[4]));
    this.gridColumnForm.controls['incharge'].setValue(parseInt(this.grids[0].grid_columns.split('')[5]));
    this.gridColumnForm.controls['job'].setValue(parseInt(this.grids[0].grid_columns.split('')[6]));
    this.gridColumnForm.controls['startDate'].setValue(parseInt(this.grids[0].grid_columns.split('')[7]));
    this.gridColumnForm.controls['deliveryDate'].setValue(parseInt(this.grids[0].grid_columns.split('')[8]));
    this.gridColumnForm.controls['status'].setValue(parseInt(this.grids[0].grid_columns.split('')[9]));
    this.gridColumnForm.controls['action'].setValue(parseInt(this.grids[0].grid_columns.split('')[10]));
  }

  createGridColumnGroup() {
    this.gridColumnForm = this.fb.group({
      projectCode: new FormControl(null),
      projectName: new FormControl(null),
      clientName: new FormControl(null),
      projectType: new FormControl(null),
      location: new FormControl(null),
      incharge: new FormControl(null),
      job: new FormControl(null),
      startDate: new FormControl(null),
      deliveryDate: new FormControl(null),
      status: new FormControl(null),
      action: new FormControl(null),
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  saveGridColumns() {
    let finalObj = {};
    let sendObj = {};
    finalObj['projectCode'] = this.gridColumnForm.value.projectCode ? '1' : '0';
    finalObj['projectName'] = this.gridColumnForm.value.projectName ? '1' : '0';
    finalObj['clientName'] = this.gridColumnForm.value.clientName ? '1' : '0';
    finalObj['projectType'] = this.gridColumnForm.value.projectType ? '1' : '0';
    finalObj['location'] = this.gridColumnForm.value.location ? '1' : '0';
    finalObj['incharge'] = this.gridColumnForm.value.incharge ? '1' : '0';
    finalObj['job'] = this.gridColumnForm.value.job ? '1' : '0';
    finalObj['startDate'] = this.gridColumnForm.value.startDate ? '1' : '0';
    finalObj['deliveryDate'] = this.gridColumnForm.value.deliveryDate ? '1' : '0';
    finalObj['status'] = this.gridColumnForm.value.status ? '1' : '0';
    finalObj['action'] = this.gridColumnForm.value.action ? '1' : '0';

    sendObj['grid_columns'] = finalObj['projectCode'] + finalObj['projectName'] + finalObj['clientName'] 
    + finalObj['projectType'] + finalObj['location'] + finalObj['incharge'] + finalObj['job'] 
    + finalObj['startDate'] + finalObj['deliveryDate'] + finalObj['status'] + finalObj['action'];

    sendObj['project_grid_column_id'] = this.grids[0].project_grid_column_id;

    this.projectsService.updateProjectGridColumns(sendObj).then(data => {
      if (data.success) {
        this.dialogRef.close('save');
      }
      else {
        this.alertService.createAlert(data.message, 0)
      }
    })
  }
}
