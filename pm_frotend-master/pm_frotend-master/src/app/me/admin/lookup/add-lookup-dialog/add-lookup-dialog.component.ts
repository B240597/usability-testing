import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService } from '../../../../shared/services/alert.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-add-lookup-dialog',
  templateUrl: './add-lookup-dialog.component.html',
  styleUrls: ['./add-lookup-dialog.component.scss'],
  providers: [AlertService]
})
export class AddLookupDialogComponent implements OnInit {

  addLookUpForm: FormGroup;
  codeTypes = [{ "id": 1, "title": "Project Status" }, { "id": 2, "title": "Task Status" }];

  constructor(public dialogRef: MatDialogRef<AddLookupDialogComponent>, @Inject(MAT_DIALOG_DATA) public lookupObj: any,
    private alertService: AlertService, private fb: FormBuilder, private adminService: AdminService,) {
    this.createLookUpForm();
    if (!this.lookupObj) {
      this.AddEmptyRow();
    }
  }

  ngOnInit() {
    if (this.lookupObj) {
      this.addLookUpForm.controls['code'].setValue(this.lookupObj.code_master_id);
      this.addLookUpForm.controls['code'].disable();
      this.AddRowWithData(this.lookupObj.lookup_name);
    }
  }


  createLookUpForm() {
    this.addLookUpForm = this.fb.group({
      addLookUpName: this.fb.array([]),
      code: new FormControl('', [Validators.required])
    });
  }
  get code() { return this.addLookUpForm.get('code'); }

  get addLookUpName() { return this.addLookUpForm.get('addLookUpName') as FormArray; };

  AddRowWithData(value) {
    var form = this.addLookUpForm;
    var key1 = 'addLookUpName';
    (form.get(key1) as FormArray).push(new FormControl(value, [Validators.required, this.noWhiteSpaceValidator]));
  }

  AddEmptyRow() {
    var form = this.addLookUpForm;
    var key1 = 'addLookUpName';
    (form.get(key1) as FormArray).push(new FormControl('', [Validators.required, this.noWhiteSpaceValidator]));
  }

  removeObject(i) {
    this.addLookUpName.removeAt(i);
  }

  checkAddRow() {
    var flag = 0;
    var form = this.addLookUpForm;
    var key1 = 'addLookUpName';
    var i = (form.get(key1) as FormArray).controls.length;
    for (var k = 0; k < i; k++) {
      var chkCond1 = (form.get(key1) as FormArray).controls[k].value;
      if (!chkCond1) {
        flag++;
      }
      if (k + 1 == i) {
        if (flag == 0) {
          this.AddEmptyRow();
        } else {
          this.alertService.createAlert('Please fill all lookup names fields before adding new one.', 0);
        }
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  saveLookups() {
    if (this.lookupObj) {
      let detail = { "lookup_id": this.lookupObj.lookup_id, "lookup_name": this.addLookUpName.controls[0].value }
      this.adminService.updateLookup(detail).then(data => {
        if (data.success) {
          this.alertService.createAlert("Lookups updated successfully", 1);
          this.dialogRef.close('save');
        }
        else {
          this.alertService.createAlert(data.message, 0);
        }
      });
    } else {
      let tempArray = [];
      let temp = {};
      temp["code_master_id"] = this.addLookUpForm.value.code;
      for (let i = 0; i < this.addLookUpName.length; i++) {
        tempArray.push(this.addLookUpName.controls[i].value);
      }
      temp["lookup_names"] = tempArray;
      this.adminService.addLookups(temp)
        .then(data => {
          if (data.success) {
            this.alertService.createAlert("Lookups saved successfully", 1);
            this.dialogRef.close('save');
          }
          else {
            this.alertService.createAlert(data.message, 0);
          }
        });
    }
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k > 47 && k < 58))
  }

  noWhiteSpaceValidator(control: FormControl) {
    let isWhiteSpace = (control.value || '').trim().length === 0;
    let isValid = !isWhiteSpace;
    return isValid ? null : { 'whitespace': true };
  }

}
