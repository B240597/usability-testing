import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-additemtype-dialog',
  templateUrl: './additemtype-dialog.component.html',
  styleUrls: ['./additemtype-dialog.component.scss']
})
export class AdditemtypeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AdditemtypeDialogComponent>) { }

  ngOnInit() {

  }
  
  close(): void {
    this.dialogRef.close();
  }

}
