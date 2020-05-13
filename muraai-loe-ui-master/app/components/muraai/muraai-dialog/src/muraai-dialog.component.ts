/*!
 * @license
 * Copyright 2017 Muraai Information Technologies, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit} from '@angular/core';
import {MdDialogRef, MdDialog} from '@angular/material';

@Component({
  selector: 'muraai-dialog',
  styleUrls: ['./muraai-dialog.component.scss'],
  templateUrl: './muraai-dialog.component.html'
})
export class MuraaiDialogComponent implements OnInit {
  formData: any;
  header: string;

  constructor(public dialogRef: MdDialogRef<MuraaiDialogComponent>, public dialog: MdDialog) {

  }

  ngOnInit() {
  }

  submit(event) {
    this.dialogRef.close(event);
  }

  close(event) {
    this.dialogRef.close();
  }

  onDataChange(event) {

  }

  public getSignFromComponent(sign) {
    this.dialogRef.close(sign);
  }
}
