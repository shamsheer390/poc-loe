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

import {Component, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {AlfrescoTranslationService} from 'ng2-alfresco-core';
import {ClientService} from './../client/services/client.service';
import {ClientEntryService} from './services/client-entry.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

declare let dialogPolyfill: any;

@Component({
  selector: 'contract-entry',
  templateUrl: './contact-entry.component.html',
  styleUrls: ['./contract-entry.component.scss'],
  providers: [ClientService, ClientEntryService]
})
export class ContractEntryComponent implements OnInit {
  title: string = 'Contract Entry Details';
  serviceType = ['Audit and Assurance', 'Tax', 'Consulting Services'];
  industryType = ['Innovation and Technology', 'Manufacturing and Distribution', 'Real Estate & Construction', 'Retail'];
  public myForm: FormGroup;
  client: any = {};
  status: boolean = true;
  data: any;
  contractEntryForm: boolean = true;
  // tslint:disable-next-line:max-line-length
  sign: string = 'iVBORw0KGgoAAAANSUhEUgAABP4AAABhCAYAAABGf29FAAAJW0lEQVR4Xu3YQREAAAgCQelf2h43awNWXuwcAQIECBAgQIAAAQIECBAgQIAAAQI5geUSCUSAAAECBAgQIECAAAECBAgQIECAwBn+lIAAAQIECBAgQIAAAQIECBAgQIBAUMDwF3yqSAQIECBAgAABAgQIECBAgAABAgQMfzpAgAABAgQIECBAgAABAgQIECBAIChg+As+VSQCBAgQIECAAAECBAgQIECAAAEChj8dIECAAAECBAgQIECAAAECBAgQIBAUMPwFnyoSAQIECBAgQIAAAQIECBAgQIAAAcOfDhAgQIAAAQIECBAgQIAAAQIECBAIChj+gk8ViQABAgQIECBAgAABAgQIECBAgIDhTwcIECBAgAABAgQIECBAgAABAgQIBAUMf8GnikSAAAECBAgQIECAAAECBAgQIEDA8KcDBAgQIECAAAECBAgQIECAAAECBIIChr/gU0UiQIAAAQIECBAgQIAAAQIECBAgYPjTAQIECBAgQIAAAQIECBAgQIAAAQJBAcNf8KkiESBAgAABAgQIECBAgAABAgQIEDD86QABAgQIECBAgAABAgQIECBAgACBoIDhL/hUkQgQIECAAAECBAgQIECAAAECBAgY/nSAAAECBAgQIECAAAECBAgQIECAQFDA8Bd8qkgECBAgQIAAAQIECBAgQIAAAQIEDH86QIAAAQIECBAgQIAAAQIECBAgQCAoYPgLPlUkAgQIECBAgAABAgQIECBAgAABAoY/HSBAgAABAgQIECBAgAABAgQIECAQFDD8BZ8qEgECBAgQIECAAAECBAgQIECAAAHDnw4QIECAAAECBAgQIECAAAECBAgQCAoY/oJPFYkAAQIECBAgQIAAAQIECBAgQICA4U8HCBAgQIAAAQIECBAgQIAAAQIECAQFDH/Bp4pEgAABAgQIECBAgAABAgQIECBAwPCnAwQIECBAgAABAgQIECBAgAABAgSCAoa/4FNFIkCAAAECBAgQIECAAAECBAgQIGD40wECBAgQIECAAAECBAgQIECAAAECQQHDX/CpIhEgQIAAAQIECBAgQIAAAQIECBAw/OkAAQIECBAgQIAAAQIECBAgQIAAgaCA4S/4VJEIECBAgAABAgQIECBAgAABAgQIGP50gAABAgQIECBAgAABAgQIECBAgEBQwPAXfKpIBAgQIECAAAECBAgQIECAAAECBAx/OkCAAAECBAgQIECAAAECBAgQIEAgKGD4Cz5VJAIECBAgQIAAAQIECBAgQIAAAQKGPx0gQIAAAQIECBAgQIAAAQIECBAgEBQw/AWfKhIBAgQIECBAgAABAgQIECBAgAABw58OECBAgAABAgQIECBAgAABAgQIEAgKGP6CTxWJAAECBAgQIECAAAECBAgQIECAgOFPBwgQIECAAAECBAgQIECAAAECBAgEBQx/waeKRIAAAQIECBAgQIAAAQIECBAgQMDwpwMECBAgQIAAAQIECBAgQIAAAQIEggKGv+BTRSJAgAABAgQIECBAgAABAgQIECBg+NMBAgQIECBAgAABAgQIECBAgAABAkEBw1/wqSIRIECAAAECBAgQIECAAAECBAgQMPzpAAECBAgQIECAAAECBAgQIECAAIGggOEv+FSRCBAgQIAAAQIECBAgQIAAAQIECBj+dIAAAQIECBAgQIAAAQIECBAgQIBAUMDwF3yqSAQIECBAgAABAgQIECBAgAABAgQMfzpAgAABAgQIECBAgAABAgQIECBAIChg+As+VSQCBAgQIECAAAECBAgQIECAAAEChj8dIECAAAECBAgQIECAAAECBAgQIBAUMPwFnyoSAQIECBAgQIAAAQIECBAgQIAAAcOfDhAgQIAAAQIECBAgQIAAAQIECBAIChj+gk8ViQABAgQIECBAgAABAgQIECBAgIDhTwcIECBAgAABAgQIECBAgAABAgQIBAUMf8GnikSAAAECBAgQIECAAAECBAgQIEDA8KcDBAgQIECAAAECBAgQIECAAAECBIIChr/gU0UiQIAAAQIECBAgQIAAAQIECBAgYPjTAQIECBAgQIAAAQIECBAgQIAAAQJBAcNf8KkiESBAgAABAgQIECBAgAABAgQIEDD86QABAgQIECBAgAABAgQIECBAgACBoIDhL/hUkQgQIECAAAECBAgQIECAAAECBAgY/nSAAAECBAgQIECAAAECBAgQIECAQFDA8Bd8qkgECBAgQIAAAQIECBAgQIAAAQIEDH86QIAAAQIECBAgQIAAAQIECBAgQCAoYPgLPlUkAgQIECBAgAABAgQIECBAgAABAoY/HSBAgAABAgQIECBAgAABAgQIECAQFDD8BZ8qEgECBAgQIECAAAECBAgQIECAAAHDnw4QIECAAAECBAgQIECAAAECBAgQCAoY/oJPFYkAAQIECBAgQIAAAQIECBAgQICA4U8HCBAgQIAAAQIECBAgQIAAAQIECAQFDH/Bp4pEgAABAgQIECBAgAABAgQIECBAwPCnAwQIECBAgAABAgQIECBAgAABAgSCAoa/4FNFIkCAAAECBAgQIECAAAECBAgQIGD40wECBAgQIECAAAECBAgQIECAAAECQQHDX/CpIhEgQIAAAQIECBAgQIAAAQIECBAw/OkAAQIECBAgQIAAAQIECBAgQIAAgaCA4S/4VJEIECBAgAABAgQIECBAgAABAgQIGP50gAABAgQIECBAgAABAgQIECBAgEBQwPAXfKpIBAgQIECAAAECBAgQIECAAAECBAx/OkCAAAECBAgQIECAAAECBAgQIEAgKGD4Cz5VJAIECBAgQIAAAQIECBAgQIAAAQKGPx0gQIAAAQIECBAgQIAAAQIECBAgEBQw/AWfKhIBAgQIECBAgAABAgQIECBAgAABw58OECBAgAABAgQIECBAgAABAgQIEAgKGP6CTxWJAAECBAgQIECAAAECBAgQIECAgOFPBwgQIECAAAECBAgQIECAAAECBAgEBQx/waeKRIAAAQIECBAgQIAAAQIECBAgQMDwpwMECBAgQIAAAQIECBAgQIAAAQIEggKGv+BTRSJAgAABAgQIECBAgAABAgQIECBg+NMBAgQIECBAgAABAgQIECBAgAABAkEBw1/wqSIRIECAAAECBAgQIECAAAECBAgQMPzpAAECBAgQIECAAAECBAgQIECAAIGgwAN5iABiYkGEnwAAAABJRU5ErkJggg==';
  serviceTerms: string = 'Services may include advice and recommendation, but all decisions in connection with the implementation of such advice and recommendations shall be the responsibility of, and made by, the Client. The services provided by Richter to the Client are those of an independent contractor and nothing in the Engagement Agreement is intended to create nor shall be construed as creating an employment, agency, trustee, partnership, representative, joint venture, fiduciary or other relationship similar to the foregoing. Richter shall be entitled to rely on the facts and assumptions provided by the Client and, unless Richter and the Client expressly agree in writing otherwise, shall not independently verify such information. Client acknowledges and agrees that any services to be provided by Richer can be provided by any of Richter’s affiliates and that each such affiliate of Richter shall be entitled to rely on the Engagement Agreement for the provision of its services.';
  // tslint:disable-next-line:max-line-length
  timelyPerformanceTerms: string = 'Richter will use all reasonable efforts to complete within any agreed upon time-frame the performance of the services described in the Engagement Agreement.  The Client acknowledges that the Client’s failure to perform its obligations set out in the Engagement Agreement could adversely impact Richter’s ability to perform its services. Richter will not be liable for failures or delays in performance that arise from causes beyond its control, including the untimely performance by the Client of its obligations as set out in the Engagement Agreement';
  clientResponsibilitiesTerms: string = 'The Client will provide to Richter, in a timely manner, complete and accurate information and access to management personnel, staff, premises, computer systems and applications as is reasonably required by Richter to complete the performance of the services.';
  @ViewChild('alertbox')
  alertbox: any;
  constructor(private translateService: AlfrescoTranslationService, public  router: Router, public toastr: ToastsManager,
              vcr: ViewContainerRef, public clientService: ClientService, public clientEntryService: ClientEntryService) {
    if (translateService) {
      translateService.addTranslationFolder('muraai-contract-form', '/custom-translation/contract-details');
    }
    this.toastr.setRootViewContainerRef(vcr);
    this.changeToEnglish();
  }

  ngOnInit(): void {
  }

  public changeToFrench(): void {
    this.translateService.use('fr');
  }

  public changeToEnglish(): void {
    this.translateService.use('en');
  }

  public onContractEntry(form): void {
    this.data = form;
    if (form ) {
        let res = this.clientService.getDetails(form.email);
        if (res) {
                    let newClientStatus = 'EXISTING_CLIENT';
                    let conflictStatus = 'NO CONFLICT';
                    localStorage.setItem('clientName', form.firstName);
                    localStorage.setItem('email', form.email);
                    this.startBpm(newClientStatus, conflictStatus);
                    this.showAlert();
              }else {
                let res1 = this.clientService.checkConflict(form.email);
                if ( res1 ) {
                  let newClientStatus = 'NEW_CLIENT';
                  let conflictStatus = 'NO CONFLICT';
                  localStorage.setItem('clientName', form.firstName);
                  localStorage.setItem('email', form.email);
                  this.startBpm(newClientStatus, conflictStatus);
                  this.showAlert();
                }else {
                  let newClientStatus = 'NEW_CLIENT';
                  let conflictStatus = 'CONFLICT';
                  this.startBpm(newClientStatus, conflictStatus);
                  this.toastr.warning('Conflict client! This user is blocked by XEROX', 'Warning!');
                  this.showAlert();
                }
        }
        }
    console.log('data', form);
  }
  private showAlert() {

        if (!this.alertbox.nativeElement.showModal) {
          dialogPolyfill.registerDialog(this.alertbox.nativeElement);
        }
        if (this.alertbox) {
          this.alertbox.nativeElement.showModal();
        }
      }
  onOKClick() {
        this.closeAlert();
        this.contractEntryForm = false;
      }
  private closeAlert() {
        if (this.alertbox) {
          this.alertbox.nativeElement.close();
        }
      }
  public startBpm(newClientStatus, conflictStatus) {
    let taskInputObj = {
      'processDefinitionKey': 'LOEProcess',
      'variables': [{
        'name': 'newClientStatus',
        'type': 'string',
        'value': newClientStatus
      },
      {
        'name': 'genericUserId',
        'type': 'string',
        'value': '23023'
      },
      {
        'name': 'partnerId',
        'type': 'string',
        'value': '24024'
      },
      {
        'name': 'clientId',
        'type': 'string',
        'value': '19019'
      },
      {
        'name': 'ccdUserId',
        'type': 'string',
        'value': '22022'
      },
      {
        'name': 'legalUserId',
        'type': 'string',
        'value': '7007'
      },
      {
        'name': 'firstName',
        'type': 'string',
        'value': this.data.firstName
      },
      {
        'name': 'lastName',
        'type': 'string',
        'value': this.data.lastName
      },
      {
        'name': 'address',
        'type': 'string',
        'value': this.data.address
      },
      {
        'name': 'email',
        'type': 'string',
        'value': this.data.email
      },
      {
        'name': 'service_type',
        'type': 'string',
        'value': this.data.serviceType
      },
      {
        'name': 'industry',
        'type': 'string',
        'value': this.data.industryType
      },
      {
        'name': 'conflictStatus',
        'type': 'string',
        'value': conflictStatus
      },
      {
        'name': 'status',
        'type': 'string',
        'value': 'New Opportunity Entry'
      }]
    };
    this.clientEntryService.triggerInvoiceTask(taskInputObj).subscribe(
      () => {
        localStorage.removeItem('document');
        localStorage.removeItem('version');
        localStorage.setItem('sign', this.sign);
        localStorage.setItem('service_terms', this.serviceTerms);
        localStorage.setItem('timely_performance_terms', this.timelyPerformanceTerms);
        localStorage.setItem('client_responsibilities_terms', this.clientResponsibilitiesTerms);
      });
  }
  checkStatus() {
    if (this.status) {
            this.router.navigate(['/ap/client-upload']);
    }else {
           this.router.navigate(['/ap/client-form']);
    }
}
}
