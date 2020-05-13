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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'muraai-status-spinner',
  templateUrl: './muraai-status-spinner.component.html',
  styleUrls: ['./muraai-status-spinner.component.scss']
})
export class MuraaiStatusSpinnerComponent implements OnInit {
  @Input()
  color: string;

  @Input()
  mode: string;

  @Input()
  value: number;

  @Input()
  size: number;

  @Output()
  clickOnSpinner: EventEmitter<any> = new EventEmitter<any>();

  fontSize: string = '';
  top: number = 0;
  left: number = 0;
  colorForContent: string;
  danger = 0;
  values: number;
  colors: string;

  constructor() {
  }

  ngOnInit(): void {
    this.values = this.value;
    this.colors = this.color;
    if (this.value === 0) {
      this.value = 100;
      this.danger = 1;
      this.color = 'warn';
    }
    this.fontSize = this.size + 'px';
    this.left = this.size / 2;
    this.top = this.size / 2;
    this.colorForContent = this.color === 'primary' ? '#3f51b5' : this.color === 'accent' ? '#ff4081' : this.color === 'warn' ? '#f44336' : '';
  }

  public onClick(): void {
    this.clickOnSpinner.emit({'mode': this.mode, 'value': this.values, 'color': this.colors, 'size': this.size});
  }

  public getPadding(): any {
    const x = {'left': 'calc(50% - ' + this.left + 'px' + ')', 'top': 'calc(50% - ' + this.top + 'px' + ')', 'cursor': 'pointer'};
    return x;
  }

  public getSize(): any {
    const x = {'font-size': this.fontSize, 'color': this.colorForContent, 'cursor': 'pointer'};
    return x;
  }

  public getAll(): any {
    const x = {
      'font-size': this.fontSize,
      'color': this.colorForContent,
      'position': 'absolute',
      'left': ' calc(50% - ' + this.left + 'px' + ')',
      'top': 'calc(50% - ' + this.top + 'px' + ')',
      'cursor': 'pointer'
    };
    return x;
  }
}
