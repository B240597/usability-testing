import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
    selector: 'app-permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
    providers: [AlertService]
  })
  export class PermissionsComponent implements OnInit {
      constructor(private location:Location, private alertService: AlertService) {}
      public screens = [{"name":"Analytics","value1":"true","value2":"false","value3":"true","value4":"true"},{"name":"Task Manager","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Clients","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Projects","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Logistics","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Masterdata","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Users","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Kanban","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Settings","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Lookup","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Alerts","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Messages","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Project Dashboard","value1":true,"value2":true,"value3":true,"value4":true},{"name":"Help","value1":true,"value2":true,"value3":true,"value4":true}];
      ngOnInit() {

      }
      goBack() {
        this.location.back();
      }

      savePermissions() {
        this.alertService.createAlert('Successfully Saved.', 1);
      }
  }