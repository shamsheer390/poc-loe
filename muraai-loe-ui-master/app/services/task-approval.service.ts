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
import {Http, Headers} from '@angular/http';
import { MuraaiConf } from '../components/common/muraai-conf';

@Injectable()
export class TaskApprovalService {
  constructor(private http: Http) {

  }

  updateInvoiceHeader(invoiceHeader: any): any {
    return this.http.post(MuraaiConf.API_SOCKET + 'services/invoice-header-updation', invoiceHeader).map(
      res => {
        return res.json();
      }
    );
  }

  updateInvoiceTaskStatus(invoiceStatusObj: any, instanceId: string, variable: string): any {
    return this.http.put(localStorage.getItem('bpmHost') + '/activiti-app/api/enterprise/process-instances/' + instanceId + '/variables/' + variable,
      invoiceStatusObj,
      {
        headers: this.createAuthorizationHeader()
      }).map(
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

  updateInvoiceDetails(invoiceDetails: any): any {
    return this.http.post(MuraaiConf.API_SOCKET + 'services/update-invoice-details', invoiceDetails).map(
      res => {
        return res.json();
      }
    );
  }

}
