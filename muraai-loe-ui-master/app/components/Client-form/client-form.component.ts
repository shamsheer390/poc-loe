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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientFormService } from './services/client-form.service';
// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
    selector: 'client-form',
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.scss'],
    providers: [ClientFormService]
})
export class ClientFormComponent implements OnInit {
    public myForm: FormGroup;
    client: any = {};
    data: any;
    // engagement
    engagementServiceList =  ['Audit and Assurance', 'Risk, performance and technology services', 'Tax'
                        , 'Consulting Services', 'Enterprise Group'];
    constructor(public fb: FormBuilder, public router: Router, public clientService: ClientFormService) {

    }
    ngOnInit() {
        let x = localStorage.getItem('sign');
        console.log('initial x=', x);
        if ( x === null || x === undefined || x.length === 0 ) {
            localStorage.setItem('sign', 'iVBORw0KGgoAAAANSUhEUgAABP4AAABhCAYAAABGf29FAAAJW0lEQVR4Xu3YQREAAA' +
                'gCQelf2h43awNWXuwcAQIECBAgQIAAAQIECBAgQIAAAQI5geUSCUSAAAECBAgQIECAAAECBAgQIECAwBn+lIAAAQIECBAgQ' +
                'IAAAQIECBAgQIBAUMDwF3yqSAQIECBAgAABAgQIECBAgAABAgQMfzpAgAABAgQIECBAgAABAgQIECBAIChg+As+VSQCB' +
                'AgQIECAAAECBAgQIECAAAEChj8dIECAAAECBAgQIECAAAECBAgQIBAUMPwFnyoSAQIECBAgQIAAAQIECBAgQIAAAcOfDhAg' +
                'QIAAAQIECBAgQIAAAQIECBAIChj+gk8ViQABAgQIECBAgAABAgQIECBAgIDhTwcIECBAgAABAgQIECBAgAABAgQIBAUMf8Gnik' +
                'SAAAECBAgQIECAAAECBAgQIEDA8KcDBAgQIECAAAECBAgQIECAAAECBIIChr/gU0UiQIAAAQIECBAgQIAAAQIECBAgYPjTAQ' +
                'IECBAgQIAAAQIECBAgQIAAAQJBAcNf8KkiESBAgAABAgQIECBAgAABAgQIEDD86QABAgQIECBAgAABAgQIECBAgACBoIDhL/hU' +
                'kQgQIECAAAECBAgQIECAAAECBAgY/nSAAAECBAgQIECAAAECBAgQIECAQFDA8Bd8qkgECBAgQIAAAQIECBAgQIAAAQIEDH86Q' +
                'IAAAQIECBAgQIAAAQIECBAgQCAoYPgLPlUkAgQIECBAgAABAgQIECBAgAABAoY/HSBAgAABAgQIECBAgAABAgQIECAQFDD8BZ' +
                '8qEgECBAgQIECAAAECBAgQIECAAAHDnw4QIECAAAECBAgQIECAAAECBAgQCAoY/oJPFYkAAQIECBAgQIAAAQIECBAgQICA4U8' +
                'HCBAgQIAAAQIECBAgQIAAAQIECAQFDH/Bp4pEgAABAgQIECBAgAABAgQIECBAwPCnAwQIECBAgAABAgQIECBAgAABAgSCAoa/' +
                '4FNFIkCAAAECBAgQIECAAAECBAgQIGD40wECBAgQIECAAAECBAgQIECAAAECQQHDX/CpIhEgQIAAAQIECBAgQIAAAQIECBAw/Ok' +
                'AAQIECBAgQIAAAQIECBAgQIAAgaCA4S/4VJEIECBAgAABAgQIECBAgAABAgQIGP50gAABAgQIECBAgAABAgQIECBAgEBQwPAXfK' +
                'pIBAgQIECAAAECBAgQIECAAAECBAx/OkCAAAECBAgQIECAAAECBAgQIEAgKGD4Cz5VJAIECBAgQIAAAQIECBAgQIAAAQKGPx0gQI' +
                'AAAQIECBAgQIAAAQIECBAgEBQw/AWfKhIBAgQIECBAgAABAgQIECBAgAABw58OECBAgAABAgQIECBAgAABAgQIEAgKGP6CTxWJA' +
                'AECBAgQIECAAAECBAgQIECAgOFPBwgQIECAAAECBAgQIECAAAECBAgEBQx/waeKRIAAAQIECBAgQIAAAQIECBAgQMDwpwMECBAg' +
                'QIAAAQIECBAgQIAAAQIEggKGv+BTRSJAgAABAgQIECBAgAABAgQIECBg+NMBAgQIECBAgAABAgQIECBAgAABAkEBw1/wqSIRIEC' +
                'AAAECBAgQIECAAAECBAgQMPzpAAECBAgQIECAAAECBAgQIECAAIGggOEv+FSRCBAgQIAAAQIECBAgQIAAAQIECBj+dIAAAQIEC' +
                'BAgQIAAAQIECBAgQIBAUMDwF3yqSAQIECBAgAABAgQIECBAgAABAgQMfzpAgAABAgQIECBAgAABAgQIECBAIChg+As+VSQCBA' +
                'gQIECAAAECBAgQIECAAAEChj8dIECAAAECBAgQIECAAAECBAgQIBAUMPwFnyoSAQIECBAgQIAAAQIECBAgQIAAAcOfDhAgQIA' +
                'AAQIECBAgQIAAAQIECBAIChj+gk8ViQABAgQIECBAgAABAgQIECBAgIDhTwcIECBAgAABAgQIECBAgAABAgQIBAUMf8GnikS' +
                'AAAECBAgQIECAAAECBAgQIEDA8KcDBAgQIECAAAECBAgQIECAAAECBIIChr/gU0UiQIAAAQIECBAgQIAAAQIECBAgYPjTAQIE' +
                'CBAgQIAAAQIECBAgQIAAAQJBAcNf8KkiESBAgAABAgQIECBAgAABAgQIEDD86QABAgQIECBAgAABAgQIECBAgACBoIDhL/hUk' +
                'QgQIECAAAECBAgQIECAAAECBAgY/nSAAAECBAgQIECAAAECBAgQIECAQFDA8Bd8qkgECBAgQIAAAQIECBAgQIAAAQIEDH86QI' +
                'AAAQIECBAgQIAAAQIECBAgQCAoYPgLPlUkAgQIECBAgAABAgQIECBAgAABAoY/HSBAgAABAgQIECBAgAABAgQIECAQFDD8BZ8' +
                'qEgECBAgQIECAAAECBAgQIECAAAHDnw4QIECAAAECBAgQIECAAAECBAgQCAoY/oJPFYkAAQIECBAgQIAAAQIECBAgQICA4U8H' +
                'CBAgQIAAAQIECBAgQIAAAQIECAQFDH/Bp4pEgAABAgQIECBAgAABAgQIECBAwPCnAwQIECBAgAABAgQIECBAgAABAgSCAoa/4' +
                'FNFIkCAAAECBAgQIECAAAECBAgQIGD40wECBAgQIECAAAECBAgQIECAAAECQQHDX/CpIhEgQIAAAQIECBAgQIAAAQIECBAw/Ok' +
                'AAQIECBAgQIAAAQIECBAgQIAAgaCA4S/4VJEIECBAgAABAgQIECBAgAABAgQIGP50gAABAgQIECBAgAABAgQIECBAgEBQwPAXfKp' +
                'IBAgQIECAAAECBAgQIECAAAECBAx/OkCAAAECBAgQIECAAAECBAgQIEAgKGD4Cz5VJAIECBAgQIAAAQIECBAgQIAAAQKGPx0gQI' +
                'AAAQIECBAgQIAAAQIECBAgEBQw/AWfKhIBAgQIECBAgAABAgQIECBAgAABw58OECBAgAABAgQIECBAgAABAgQIEAgKGP6CTxWJA' +
                'AECBAgQIECAAAECBAgQIECAgOFPBwgQIECAAAECBAgQIECAAAECBAgEBQx/waeKRIAAAQIECBAgQIAAAQIECBAgQMDwpwMECBA' +
                'gQIAAAQIECBAgQIAAAQIEggKGv+BTRSJAgAABAgQIECBAgAABAgQIECBg+NMBAgQIECBAgAABAgQIECBAgAABAkEBw1/wqSIRI' +
                'ECAAAECBAgQIECAAAECBAgQMPzpAAECBAgQIECAAAECBAgQIECAAIGgwAN5iABiYkGEnwAAAABJRU5ErkJggg==');
        }
        this.doDocumentData();
    }
    register() {
        console.log(this.client);
        let taskInputObj = {
          'processDefinitionKey': 'LOEprocess2',
          'variables': [{
            'name': 'clientEmail',
            'type': 'string',
            'value': 'aasd@qw.com'
          }]
        };
        this.clientService.triggerInvoiceTask(taskInputObj).subscribe({

        });
    }
    doDocumentData() {
        // let signature = localStorage.getItem('sign') ;
        let docDefinition = {
            content: [
            //     date_of_publication.value
            //     '\n'
            //     mail_inst.value
            //     '\n'
            //     client_name.value
            //     '\n'
            //     address.value
            //     '\n'
            //     'Attention:' contact.value
            //     '\n Re:' engagement_services.value
            //     '\n\n\n Dear 'contact.value
            //     '\n\nWe are pleased to have the opportunity to assist client_name.value() (the “Client”) with '
            //     engagement_desc.value
            //     '\n This engagement letter, together with the attached “Standard Terms and Conditions” '
            //     'and any other appendices mentioned in this engagement letter (collectively, the “Engagement Agreement”)'
            //      'set out the terms and conditions of your engagement of Richter S.E.N.C.R.L. (“Richter”) to perform the services described below.'
            //     '\n'engagement_partner.value ','title.value ',will act as the engagement partner and coordinate the services'
            //     'we perform for the Client. Where necessary or appropriate, we will draw upon other resources to assist with the engagement.'
            //     'The effective date of this engagement shall be the date on which we commenced providing services relating to this matter, '
            //     'notwithstanding the date of this letter.'
            //     '\n As agreed, we will' engagement_nature.value
            //     '\n In addition, we will advise you on further matters and provide you with supplemental services as you may request from time to time.'
            //     'All such additional matters and services will also be governed by this Engagement Agreement unless we otherwise agree in writing from time to time.'
            //     {text: '\n Client’s Responsibilities', style: 'boldtext'}
            //     '\n The Client will provide to Richter,in a timely manner, complete and accurate information and access to management personnel,'
            //     'staff, premises, computer systems and applications as is reasonably required by Richter to complete the performance of its service.'
            //     '\n 'engagement_responsibilities.value
            //     {text: '\n Use, Distribution and Reproduction', style: 'boldtext'}
            //     '\n Our report(s) and other analysis will be provided for your exclusive use and are not intended for '
            //     'general circulation or publication, nor are they to be referenced, reproduced or used in '
            //     'whole or in part for any purpose other than as described herein, without our written permission in each specific instance.'
            //     {image: 'data:image/jpeg;base64,' + localStorage.getItem('sign'), width: 200,  height: 75}
            //     {canvas: [{ type: 'line', x1: 10, y1: 10, x2: 200, y2: 10, lineWidth: 0.5 }]}
            //     {text: '\nSignature', margin: [90 , 0]}
            ]
        };
        let abc =  JSON.stringify(docDefinition);
        localStorage.setItem('pdfMakeDD', abc);
        this.refreshFrame(abc);
    }
    refreshFrame(docDefinition) {
        // let pdf = JSON.parse(localStorage.getItem('pdfMakeDD')) ;
        // pdfMake.createPdf(pdf).getDataUrl(function (outDoc) {
        //     document.getElementById('pdfV').src = outDoc;
        // });
}
public getSign($event): void {
    console.log('got sign from user', $event.signature[1]);
    this.data = $event.signature[1];
    localStorage.setItem('sign', this.data);
    this.doDocumentData();
  }
}
