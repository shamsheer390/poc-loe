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

import {Injectable } from '@angular/core';
import {Http, Headers } from '@angular/http';
import { MuraaiHttpCoreServices } from '../../core/muraai-http-core-services';

@Injectable()
export class ClientEntryService {
  constructor(private http: Http, private muraaiHttpCoreServices: MuraaiHttpCoreServices) {

  }

  triggerInvoiceTask(taskInputObj: any): any {
    return this.http.post(localStorage.getItem('bpmHost') + '/activiti-app/api/enterprise/process-instances',
      taskInputObj,
      {
        headers: this.createAuthorizationHeader()
      }
    ).map(
      res => {
        return res.json();
      }
      );
  }
  private createAuthorizationHeader() {
    let headers = new Headers();
    headers.append('Authorization', localStorage.getItem('ticket-BPM'));
    return headers;
  }
}
