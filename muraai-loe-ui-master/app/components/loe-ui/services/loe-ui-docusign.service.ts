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

import {Injectable} from '@angular/core';
import {Http, Headers, ResponseContentType} from '@angular/http';
// import {Observable} from 'rxjs/Observable';
import { AppConfigService } from 'ng2-alfresco-core';
import { MuraaiConf } from '../../common/muraai-conf';

@Injectable()
export class LoeUiDocusignService {

  constructor(private http: Http, private appConfigService: AppConfigService) {
  }

  get docusignURL(): string {
   return this.appConfigService.get('docuSignHost', `${window.location.protocol}//${window.location.host}/docusign`);
  }

  private createAuthorizationHeader(): any {
    return new Headers({
      'X-DocuSign-Authentication': `{ "Username":"${this.appConfigService.get('account.email')}", "Password":"${this.appConfigService.get('account.password')}", "IntegratorKey":"${this.appConfigService.get('account.integratorKey')}" }`,
      'Content-Type': 'application/json'
    });
  }

  private createAuthorizationHeaderForDocuShare(): any {
    return new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  public loginWithAdminUser(): any {
    // console.log('envelope service call', localStorage.getItem('base64OfPdf'));
    const loginUrl = `/v2/accounts/${this.appConfigService.get('account.userId')}/envelopes/`;
    const body = {

      'documents': [
        {
          'documentBase64': localStorage.getItem('base64OfPdf'),
          'documentId': '1234',
          'name': 'demo-doc',
          'order': '1'
        }
      ],
      'emailSubject': 'Please sign the document',
      'recipients': {
        'signers': [
          {
            'clientUserId': '1',
            'email': 'dharan.g@muraai.com',
            'name': 'partner',
            'recipientId': '1',
            'routingOrder': '2',
            'tabs': {
              'signHereTabs': [
                {
                  'documentId': '1234',
                  'pageNumber': '3',
                  'tabLabel': 'partner',
                  'xPosition': '60',
                  'yPosition': '200',
                  'recipientId': '1'
                }
              ]
            }
          },
          {
            'clientUserId': '1',
            'email': 'balaji.thangavel@muraai.com',
            'name': 'client',
            'recipientId': '3',
            'routingOrder': '1',
            'tabs': {
              'signHereTabs': [
                {
                  'documentId': '1234',
                  'pageNumber': '3',
                  'tabLabel': 'client',
                  'xPosition': '60',
                  'yPosition': '390',
                  'recipientId': '2'
                }
              ]
            }
          }
        ]
      },
      'status': 'sent'
    };
    return this.http.post(this.docusignURL + loginUrl, body, {headers: this.createAuthorizationHeader()}).map(
      (x) => {
        return x.json();
      }
    );
  }

  public partnerSigning(id): any {
    let url = `/v2/accounts/${this.appConfigService.get('account.userId')}/envelopes/${id}/views/recipient`;
    const data = {
      'authenticationMethod': 'email',
      'clientUserId': '1',
      'email': 'dharan.g@muraai.com',
      'returnUrl': window.location.href.split('#')[0] + '#/ap/sign-result',
      'userName': 'partner'
    };
    return this.http.post(this.docusignURL + url, data, {headers: this.createAuthorizationHeader()}).map(
      (x) => {
        return x.json();
      }
    );
  }

  public clientSigning(id): any {
    const data = {
      'authenticationMethod': 'email',
      'clientUserId': '1',
      'email': 'balaji.thangavel@muraai.com',
      'returnUrl': window.location.href.split('#')[0] + '#/ap/sign-result',
      'userName': 'client'
    };
    let url = `/v2/accounts/${this.appConfigService.get('account.userId')}/envelopes/${id}/views/recipient`;
    return this.http.post(this.docusignURL + url, data, {headers: this.createAuthorizationHeader()}).map(
      (x) => {
        return x.json();
      }
    );
  }

  public downloadCurrentUpdatedDocument(id): any {
    let url = `/v2/accounts/${this.appConfigService.get('account.userId')}/envelopes/${id}/documents/1234?certificate=false`;
    return this.http.get(this.docusignURL + url, {
      responseType: ResponseContentType.Blob,
      headers: this.createAuthorizationHeader()
    }).map(
      (x) => {
        let blob: Blob = new Blob([(<any>x)._body], {type: 'application/pdf'});            // size is 89KB instead of 52KB
        console.log(blob);
        // Observer.next(blob);
        // Observer.complete(blob);
        return blob;
      }
    );
  }

  public updateDocumenTpDocushare(base64Data: string, fileName: string) {
    let url = 'rest/service/docuShare';
    console.log('before service', base64Data);
    console.log('before service', fileName);
    this.http.post( MuraaiConf.DOCUSHARE_BASE_URL + url, {
      'encodedString': base64Data,
      'fileName': fileName + '.pdf'
    }, {headers: this.createAuthorizationHeaderForDocuShare()}).map(
      (res) => {
        // if (res.status === 200) {
          console.log('response', res);
        // }
      }).subscribe(x => console.log('response', x));
  }
  onCreateAttachment(processId, content, opts): any {
    return this.http.post(localStorage.getItem('bpmHost') + 'activiti-app/api/enterprise/process-instances/' + processId + '/content',
    content,
    {
      headers: this.createAuthorizationHeader()
    }).map(
    res => {
      return res.json();
      }
    );
  }
}
