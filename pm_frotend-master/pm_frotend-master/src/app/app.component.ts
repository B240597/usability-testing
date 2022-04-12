import { Component, ViewChild} from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { ToasterModule, ToasterService, ToasterConfig } from 'angular2-toaster';
import { setTheme } from 'ngx-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public settings: Settings;
  private toasterService: ToasterService;
  constructor(public appSettings:AppSettings, toasterService: ToasterService){
    this.toasterService = toasterService;
    this.settings = this.appSettings.settings;
    setTheme('bs4');
  } 

  // ngOnInit() {
  //   this.settings.loadingSpinner = true;
  //  }

  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: false,
      limit: 1,
      tapToDismiss: true,
      timeout: 2000,
      positionClass: 'toast-top-right',
      animation: 'fade'
    });
}