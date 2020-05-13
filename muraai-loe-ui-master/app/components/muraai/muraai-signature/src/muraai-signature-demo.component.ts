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

@Component({
  selector: 'muraai-signature-demo',
  templateUrl: './muraai-signature-demo.component.html',
  styleUrls: ['./muraai-signature-demo.component.scss']
})
export class MuraaiSignatureDemoComponent implements OnInit {
  data: any;
  constructor() {
  }

  ngOnInit(): void {
  }

  public getSign($event): void {
    this.data = $event.signature[1];
    localStorage.setItem('sign', this.data);
  }
}
