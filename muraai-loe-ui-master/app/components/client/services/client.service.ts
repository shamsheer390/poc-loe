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
import { StorageService } from 'ng2-alfresco-core';

@Injectable()
export class ClientService {
  constructor(private http: Http, private muraaiHttpCoreServices: MuraaiHttpCoreServices, private storage: StorageService) {

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
  public getFile(): any {
     let headers = new Headers({
            'Content-Type': 'application/pdf'
      });
     let url = 'http://119.82.126.250:8086/share/page/site/apinvoicesite/document-details?nodeRef=workspace://SpacesStore/67b56759-b4ff-4de3-85b5-181122c41493' ;
     return this.http.get(url, { headers: headers })
     .map( x => {
       return x;
     });
  }

  updateClientTaskStatus(invoiceStatusObj: any, instanceId: string, variable: string): any {
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
  getDetails(clientEmail): any {
    let abc = false;
    let clientemails = JSON.parse(this.storage.getItem('clientEmail'));
    for (let i = 0; clientemails[i] != null; i++ ) {
        if ( clientEmail === clientemails[i]) {
          abc = true;
        }
      }
    return abc;
    }
    checkConflict(clientEmail): any {
      let a = true;
      let conflictDetails = JSON.parse(this.storage.getItem('conflictDetails'));
      for (let i = 0; conflictDetails[i] != null; i++ ) {
          if ( clientEmail === conflictDetails[i]) {
            a = false;
          }
        }
      return a;
      }

/*     let url = 'rest/services/getClientEmailAvailability?emailId=' + clientEmail;
    return this.muraaiHttpCoreServices.httpGetPoc(url)
     .map( x => {
       return x;
    }); */
  }
