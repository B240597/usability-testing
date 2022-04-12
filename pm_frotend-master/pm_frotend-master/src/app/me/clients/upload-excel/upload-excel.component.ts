import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from 'src/app/shared/services/alert.service';
import * as XLSX from 'xlsx';
import { ProjectsService } from '../../projects/projects.service';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent implements OnInit {

  file: File;
  allowedFileExtensions: Array<string> = ['xl', 'xls', 'xlsx', 'csv'];
  submittedExcelfile: any[];
  errorRecord = [];
  arrayBuffer: any;
  public bulkUploadArray = [];
  projectManagerList: any;
  engineerList: any;
  checked: boolean;

  constructor(
    public dialogRef: MatDialogRef<UploadExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public projectObj: any,
    public alertService: AlertService,
    public projectsService: ProjectsService,
    public clientsService: ClientsService) { }

  ngOnInit() {
    this.getprojectManager();
    this.getEngineer();
  }


  close(): void {
    this.dialogRef.close();
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

  getEngineer() {
    this.projectsService.getUsersDropdown({ userType: 3 }).then(data => {
      if (data.success) {
        this.engineerList = data.results;
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  //upload file 
  handleFileSelect(event) {
    var target: HTMLInputElement = event.target as HTMLInputElement;
    this.file = target.files[0];
    let fileExtension: string = this.file.name.substr(this.file.name.lastIndexOf('.') + 1)
    if (this.allowedFileExtensions.some(x => x.toLowerCase() === fileExtension.toLowerCase())) {
      this.check();
    }
    else {
      this.alertService.createAlert("Invalid file format", 0);
    }
    event.target.value = '';
  }

  check() {
    this.checked = false;
    this.bulkUploadArray = [];
    this.errorRecord = [];
    this.submittedExcelfile = [];
    let fileObject = {};
    let fileReader = new FileReader();
    const formData: FormData = new FormData();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, cellNF: false, cellText: false });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.submittedExcelfile = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(this.submittedExcelfile)
      for (var i = 0; i < this.submittedExcelfile.length; i++) {
        if (!this.eleContainsInArray(this.engineerList, this.submittedExcelfile[i]['Engineer'])) {
          this.errorRecord.push('row - ' + (i + 1) + ', column - 3, (' + this.submittedExcelfile[i]['Engineer'] + ") Engineer code doesn't exist");
        } else {
          let engineerId = this.engineerList.find(o => o.userCode === this.submittedExcelfile[i]['Engineer'])
          console.log(engineerId, 'engineerId')
          this.submittedExcelfile[i]['engineerCode'] = engineerId.userId;
        }
      }

      if (this.errorRecord.length == 0) {
        let count = {}
        for (let i = 0; i < this.submittedExcelfile.length; i++) {
          let startDate = new Date(this.submittedExcelfile[i]['Start (mm-dd-yyyy)']);

          let targetDate = new Date(this.submittedExcelfile[i]['Target (mm-dd-yyyy)']);

          let reviewDate = new Date(this.submittedExcelfile[i]['Review (mm-dd-yyyy)']);

          fileObject = { 'projectId': this.projectObj.id, 'projectName': this.projectObj.name, 'jobCode': this.submittedExcelfile[i]['Job #'], 'Description': this.submittedExcelfile[i]['Description'], 'engineerCode': this.submittedExcelfile[i]['engineerCode'], 'startDate': startDate, 'targetDate': targetDate, 'reviewDate': reviewDate }
          this.bulkUploadArray.push(fileObject);
        }
        console.log(this.bulkUploadArray);
        this.checked = true;
      } else {
        this.checked = true;
        this.bulkUploadArray = [];
      }
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  //checking kpi codes
  eleContainsInArray(arr, element) {
    console.log(arr, element, 's');
    if (arr != null && arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].userCode == element)
          return true;
      }
    }
    return false;
  }

  upload() {
    console.log(this.bulkUploadArray);

    this.clientsService.addJob({ array: this.bulkUploadArray, 'projectName': this.projectObj.name }).then(data => {
      if (data.success) {
        this.alertService.createAlert(data.message, 1);
        this.dialogRef.close('save');
        this.bulkUploadArray = [];
      }
      else {
        this.bulkUploadArray = [];
        this.alertService.createAlert(data.message, 0);
      }
    })
  }
}
