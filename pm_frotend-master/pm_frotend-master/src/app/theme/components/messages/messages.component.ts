import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatMenuTrigger } from '@angular/material';
import { Router } from '@angular/router';
import { GridViewComponent } from 'src/app/me/clients/grid-view/grid-view.component';
import { MessagingService } from 'src/app/service/messaging.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { MessagesService } from './messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessagingService, MessagesService, GridViewComponent]
})
export class MessagesComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public selectedTab: number = 1;
  public messages: Array<Object>;
  public files: Array<Object>;
  public meetings: Array<Object>;
  title = "push-notification";
  Messages: any;
  userId: any;
  notifications: any;

  badgeCounter: number;
  hideMatBadge: boolean;
  noteCount = 0;
  NotificationChange: any;

  constructor(
    private messagingService: MessagingService,
    private angularFireMessaging: AngularFireMessaging,
    public messagesService: MessagesService,
    private alertService: AlertService,
    public router: Router,
    public jobComponent: GridViewComponent) {
    this.hideMatBadge = true;
    this.badgeCounter = 0;
  }
  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('optima_heat_user_info')).userId;
    this.messagingService.requestPermission(this.userId);
    this.listen();
    this.getNotification();
  }

  listen() {
    this.angularFireMessaging.messages
      .subscribe((message) => {
        console.log(message, 'message triggered');

        this.getNotification();
      });
  }

  getNotification() {
    this.hideMatBadge = true;
    this.badgeCounter = 0;
    this.messagesService.getNotifications({ 'userId': this.userId }).then(data => {
      console.log(data);
      if (data.success) {
        this.notifications = data.results;
        this.noteCount = this.notifications.length;
        let count = 0;
        for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].read == 0) {
            count = count + 1;
          }
        }
        if (count > 0) {
          this.hideMatBadge = false;
          this.badgeCounter = count;
        } else {
          this.hideMatBadge = true;
          this.badgeCounter = 0;
        }
      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  openMessagesMenu() {
    
    this.trigger.openMenu();
    if (this.selectedTab == 0) {
      this.getNotification();
    }
    this.readNotification();
    this.selectedTab = 0;
  }

  readNotification() {
    this.hideMatBadge = true;
    this.badgeCounter = 0;
    this.messagesService.readNotifications({ 'userId': this.userId }).then(data => {
      console.log(data);
      if (data.success) {

      }
      else {
        this.alertService.createAlert(data.message, 0);
      }
    })
  }

  onMouseLeave() {
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  notification(item) {
    this.trigger.closeMenu();
    if (item.noteType == 2 || item.noteType == 3) {
      // localStorage.setItem('selectedJobcode', item.jobCode);
      this.router.navigate(['/admin/jobs/gridview']);
    }

  }

}
