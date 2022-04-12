import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-addproject-dialog',
  templateUrl: './addproject-dialog.component.html',
  styleUrls: ['./addproject-dialog.component.scss']
})
export class AddprojectDialogComponent implements OnInit {

  projectForm: FormGroup;
  projectManagerList: any;

  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public project: any,
    public dialogRef: MatDialogRef<AddprojectDialogComponent>,
    public projectsService: ProjectsService,
    public alertService: AlertService) {
    this.createProjectDetails();
    
  }

  ngOnInit() {
    this.getprojectManager();
    if (this.project) {
      console.log(this.project);
      this.projectForm.controls['projectCode'].setValue(this.project.projectCode);
      this.projectForm.controls['projectName'].setValue(this.project.projectName);
      this.projectForm.controls['projectType'].setValue(this.project.projectType);
      this.projectForm.controls['clientName'].setValue(this.project.clientName);
      this.projectForm.controls['clientLocation'].setValue(this.project.clientLocation);
      this.projectForm.controls['projectManager'].setValue(this.project.projectManager);
      this.projectForm.controls['startDate'].setValue(this.project.startDate);
      this.projectForm.controls['deliveryDate'].setValue(this.project.deliveryDate);
      this.projectForm.controls['status'].setValue(this.project.status);
    }
  }

  get projectCode() { return this.projectForm.get('projectCode'); }
  get projectName() { return this.projectForm.get('projectName'); }
  get projectType() { return this.projectForm.get('projectType'); }
  get clientName() { return this.projectForm.get('clientName'); }
  get clientLocation() { return this.projectForm.get('clientLocation'); }
  get projectManager() { return this.projectForm.get('projectManager'); }
  get startDate() { return this.projectForm.get('startDate'); }
  get deliveryDate() { return this.projectForm.get('deliveryDate'); }
  get status() { return this.projectForm.get('status'); }

  createProjectDetails() {
    this.projectForm = this.fb.group({
      projectCode: new FormControl('', [Validators.required]),
      projectName: new FormControl('', [Validators.required]),
      projectType: new FormControl('', [Validators.required]),
      clientName: new FormControl('', [Validators.required]),
      clientLocation: new FormControl('', [Validators.required]),
      projectManager: new FormControl(0, [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      deliveryDate: new FormControl('', [Validators.required]),
      status: new FormControl(0, [Validators.required])
    })
  }

  getprojectManager() {
    this.projectsService.getUsersDropdown({ userType: 2 }).then(data => {
      if (data.success) {
        this.projectManagerList = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  saveUser() {
    let finalObj = {};

    finalObj['projectCode'] = this.projectForm.value.projectCode;
    finalObj['projectType'] = this.projectForm.value.projectType;
    finalObj['projectName'] = this.projectForm.value.projectName;
    finalObj['clientName'] = this.projectForm.value.clientName;
    finalObj['clientLocation'] = this.projectForm.value.clientLocation;
    finalObj['projectManager'] = this.projectForm.value.projectManager;
    finalObj['startDate'] = this.projectForm.value.startDate;
    finalObj['deliveryDate'] = this.projectForm.value.deliveryDate;
    finalObj['status'] = this.projectForm.value.status;
    console.log(finalObj)
    if (this.project) {
      finalObj['projectId'] = this.project.projectId;
      console.log(finalObj);
      this.projectsService.updateProject(finalObj).then(data => {
        if (data.success) {
          this.alertService.createAlert(data.message, 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }
    else {
      this.projectsService.addproject(finalObj).then(data => {
        if (data.success) {
          this.alertService.createAlert(data.message, 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      })
    }

  }
}
