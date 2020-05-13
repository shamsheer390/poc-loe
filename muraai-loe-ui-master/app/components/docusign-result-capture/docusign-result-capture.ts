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
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'docusign-sign-capture',
  template: ``,
  styles: [``]
})
export class DocusignResultCapture implements OnInit {
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .filter(params => params.event)
      .subscribe(params => {
        console.log(params);
        localStorage.setItem('current_status_docusign_document', params.event);
      });
    window.location.replace(localStorage.getItem('redirecturl'));
  }
}
