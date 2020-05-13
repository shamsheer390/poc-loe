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

import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SignaturePad} from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'muraai-signature',
  templateUrl: './muraai-signature.component.html',
  styleUrls: ['./muraai-signature.component.scss']
})
export class MuraaiSignatureComponent implements OnInit, AfterViewInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @Input('id') currentSignId: string;
  @Output()
  getSignature: EventEmitter<any> = new EventEmitter<any>();

  public signaturePadOptions: Object;

  constructor() {
  }

  ngOnInit(): void {
    this.signaturePadOptions = {
      'height': 400,
      'width': 500
    };
  }

  ngAfterViewInit() {
    this.signaturePad.set('canvasWidth', document.getElementById(this.currentSignId).clientWidth - 10);
    this.signaturePad.set('canvasHeight', document.getElementById(this.currentSignId).clientHeight - 53);
    this.signaturePad.clear();
  }

  public drawComplete(): void {
  }

  public drawStart(): void {
  }

  public clear(): void {
    this.signaturePad.clear();
  }

  public onSubmit(): void {
    let x = this.signaturePad.toDataURL();
    let y = x.split(',');
    // localStorage.setItem('sign', y[1]);
    this.getSignature.emit({'id': this.currentSignId, 'signature': y});
  }

  public cancel() {
    this.getSignature.emit({'id': this.currentSignId, 'signature': ['', 'cancelled']});
  }

  public getHeightAndWidth(): void {
    this.signaturePad.set('canvasWidth', document.getElementById(this.currentSignId).clientWidth - 10);
    this.signaturePad.set('canvasHeight', document.getElementById(this.currentSignId).clientHeight - 53);
  }
}
