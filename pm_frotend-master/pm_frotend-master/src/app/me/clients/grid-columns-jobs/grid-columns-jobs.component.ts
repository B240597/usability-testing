import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-grid-columns-jobs',
  templateUrl: './grid-columns-jobs.component.html',
  styleUrls: ['./grid-columns-jobs.component.scss']
})
export class GridColumnsJobsComponent implements OnInit {

  gridColumnForm: FormGroup;
  userType: string;

  constructor(public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public grids: any, public dialogRef: MatDialogRef<GridColumnsJobsComponent>, private clientService: ClientsService, private alertService: AlertService) {
    this.createGridColumnGroup();
  }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    console.log(this.grids)
    this.gridColumnForm.controls['job'].setValue(parseInt(this.grids[0].grid_columns.split('')[0]));
    this.gridColumnForm.controls['description'].setValue(parseInt(this.grids[0].grid_columns.split('')[1]));
    this.gridColumnForm.controls['engineer'].setValue(parseInt(this.grids[0].grid_columns.split('')[2]));
    this.gridColumnForm.controls['projectManager'].setValue(parseInt(this.grids[0].grid_columns.split('')[3]));
    this.gridColumnForm.controls['work'].setValue(parseInt(this.grids[0].grid_columns.split('')[4]));
    this.gridColumnForm.controls['target'].setValue(parseInt(this.grids[0].grid_columns.split('')[5]));
    this.gridColumnForm.controls['remark'].setValue(parseInt(this.grids[0].grid_columns.split('')[6]));
    this.gridColumnForm.controls['review'].setValue(parseInt(this.grids[0].grid_columns.split('')[7]));
    this.gridColumnForm.controls['issue'].setValue(parseInt(this.grids[0].grid_columns.split('')[8]));
    this.gridColumnForm.controls['status'].setValue(parseInt(this.grids[0].grid_columns.split('')[9]));
    this.gridColumnForm.controls['completed'].setValue(parseInt(this.grids[0].grid_columns.split('')[10]));
    this.gridColumnForm.controls['approve'].setValue(parseInt(this.grids[0].grid_columns.split('')[11]));
    this.gridColumnForm.controls['decline'].setValue(parseInt(this.grids[0].grid_columns.split('')[12]));
    this.gridColumnForm.controls['action'].setValue(parseInt(this.grids[0].grid_columns.split('')[13]));
  }

  createGridColumnGroup() {
    this.gridColumnForm = this.fb.group({
      job: new FormControl(null),
      description: new FormControl(null),
      engineer: new FormControl(null),
      projectManager: new FormControl(null),
      work: new FormControl(null),
      target: new FormControl(null),
      remark: new FormControl(null),
      review: new FormControl(null),
      issue: new FormControl(null),
      status: new FormControl(null),
      completed: new FormControl(null),
      approve: new FormControl(null),
      decline: new FormControl(null),
      action: new FormControl(null),
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  saveGridColumns() {
    let finalObj = {};
    let sendObj = {};
    finalObj['job'] = this.gridColumnForm.value.job ? '1' : '0';
    finalObj['description'] = this.gridColumnForm.value.description ? '1' : '0';
    finalObj['engineer'] = this.gridColumnForm.value.engineer ? '1' : '0';
    finalObj['projectManager'] = this.gridColumnForm.value.projectManager ? '1' : '0';
    finalObj['work'] = this.gridColumnForm.value.work ? '1' : '0';
    finalObj['target'] = this.gridColumnForm.value.target ? '1' : '0';
    finalObj['remark'] = this.gridColumnForm.value.remark ? '1' : '0';
    finalObj['review'] = this.gridColumnForm.value.review ? '1' : '0';
    finalObj['issue'] = this.gridColumnForm.value.issue ? '1' : '0';
    finalObj['status'] = this.gridColumnForm.value.status ? '1' : '0';
    finalObj['completed'] = this.gridColumnForm.value.completed ? '1' : '0';
    finalObj['approve'] = this.gridColumnForm.value.approve ? '1' : '0';
    finalObj['decline'] = this.gridColumnForm.value.decline ? '1' : '0';
    finalObj['action'] = this.gridColumnForm.value.action ? '1' : '0';

    sendObj['grid_columns'] = finalObj['job'] + finalObj['description'] + finalObj['engineer'] 
    + finalObj['projectManager'] + finalObj['work'] + finalObj['target'] + finalObj['remark'] 
    + finalObj['review'] + finalObj['issue'] + finalObj['status'] + finalObj['completed'] 
    + finalObj['approve'] + finalObj['decline']  + finalObj['action'];

    sendObj['job_grid_column_id'] = this.grids[0].job_grid_column_id;

    this.clientService.updateJobGridColumns(sendObj).then(data => {
      if (data.success) {
        this.dialogRef.close('save');
      }
      else {
        this.alertService.createAlert(data.message, 0)
      }
    })
  }

}
