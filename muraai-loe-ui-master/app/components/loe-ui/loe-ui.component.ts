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

import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { emptySign } from './sign-model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { LoeUiDocusignService } from './services/loe-ui-docusign.service';
import { ProcessAttachmentListComponent } from 'ng2-activiti-processlist';
import { ActivitiContentService } from 'ng2-activiti-form';

@Component({
  selector: 'loe-ui',
  templateUrl: './loe-ui.component.html',
  styleUrls: ['./loe-ui.component.scss'],
  providers: [LoeUiDocusignService]
})
export class LoeUiComponent implements OnInit, OnChanges {

  @Input()
  formData: any;

  @Input()
  signatureToDocument: any = {};

  @Input()
  processId: any;

  @ViewChild(ProcessAttachmentListComponent)
  processAttachList: ProcessAttachmentListComponent;

  fileShowed: boolean = false;
  content: Blob;
  contentName: string;

  document: any = {};

  fieldData: any = [];
  fieldDataInOrder: any = [];

  checked = false;
  editTerms: boolean = false;
  documenData: any;
  activeTab: number = 0;
  selectedTab: number = 0;
  userType: string = '';
  versionList = [];
  currentDocSIgn: any;

  versionCount = 0;
  b64File: any = '';
  currentVersion: string;

  documentList: any = [];
  docVariables: any = [];
  isVersionSelected: boolean = false;
  serviceType: string = '';
  tabShow: boolean = true;
  loggedInUserName: string;
  constructor(
    private translateService: AlfrescoTranslationService,
    private docuginService: LoeUiDocusignService,
    private activitiContentService: ActivitiContentService) {
    if (translateService) {
      translateService.addTranslationFolder('task', '/custom-translation/task');
    }
    this.document.serviceType = '';
    this.document.date = new Date();
    this.document.mailInstruction = '';
    this.document.clientName = '';
    this.document.address = '';
    this.document.contactName = '';
    this.document.descriptionOfEngagement = '';
    this.document.engagementPartner = '';
    this.document.title = '';
    this.document.natureOfEngagementPartner = '';
    this.document.engagementResponsibilities = '';
    this.document.service = '';
    this.document.timelyPerformance = '';
    this.document.clientResposiblity = '';
    this.changeToEnglish();
  }

  ngOnInit(): void {
    this.getVersion();
    this.setVersion();
    this.document.service = localStorage.getItem('service_terms');
    this.document.timelyPerformance = localStorage.getItem('timely_performance_terms');
    this.document.clientResposiblity = localStorage.getItem('client_responsibilities_terms');
    if ( this.document.service === null || this.document.service === 'null') {
      this.document.service = '';
    }
    if ( this.document.timelyPerformance === null || this.document.timelyPerformance === 'null') {
      this.document.timelyPerformance = '';
    }
    if ( this.document.clientResposiblity === null || this.document.clientResposiblity === 'null') {
      this.document.clientResposiblity = '';
    }
    if ((localStorage.getItem('loginEmail') !== null) &&
      ((localStorage.getItem('loginEmail').includes('partner')) || (localStorage.getItem('loginEmail').includes('legalteam')))) {
      this.editTerms = true;
    }
    let loggedInUser = JSON.parse(localStorage.getItem('loginEmail'));
    if (loggedInUser === 'client@appteam.com' || loggedInUser === 'partner1@appteam.com' || loggedInUser === 'partner2@appteam.com') {
        this.onSelectThirdTab();
        this.tabShow = false;
      }

    let type = localStorage.getItem('loginEmail');
    if (type.includes('partner')) {
      this.userType = 'partner';
    } else if (type.includes('client')) {
      this.userType = 'client';
    }
    if (((localStorage.getItem('current_status_docusign_document') === 'signing_complete')) && localStorage.getItem('redirecturl') === window.location.href) {
      this.downloadCurrentUpdatedDocument();
    }
    // this.uploadService.fileUploadComplete.subscribe(value => this.onFileUploadComplete(value.data));
  }
  public changeToFrench(): void {
    this.translateService.use('fr');
  }

  public changeToEnglish(): void {
    this.translateService.use('en');
  }

  setVersion() {
    if (localStorage.getItem(this.processId) !== null) {
      this.documenData = JSON.parse(localStorage.getItem(this.processId));
      if (this.documenData !== null) {
        this.documentList = this.documenData;
        this.currentVersion = this.versionList[(this.documenData[this.documenData.length - 1].version.versionC - 1)];
      }
    }
  }
  getVersion() {
    this.versionList = [];
    this.documenData = JSON.parse(localStorage.getItem(this.processId));
    console.log(this.documenData);
    if (this.documenData !== null) {
      this.versionCount = this.documenData.length;
      for (let i = 1; i <= this.versionCount; i++) {
        this.versionList.push('V' + i);
      }
    } else {
      this.versionCount = 0;
    }
  }
  private onReplaceNames(str): string {
    let splitStr = str !== 'service_type' ? str.split(/(?=[A-Z])/) : str.split('_');
    splitStr[0] = splitStr[0].charAt(0).toUpperCase() + splitStr[0].substring(1);
    for (let i = 1; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toLowerCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  public onFileUploadFail($event) {
    console.log($event);
  }

  onAttachmentClick(content: any): void {
    console.log(content);
    this.fileShowed = true;
    this.content = content.contentBlob;
    this.contentName = content.name;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fieldData = [];
    let chartLabel = changes['formData'];
    if (chartLabel) {
      if (chartLabel.currentValue) {
        for (let i = 0; i < chartLabel.currentValue.length; i++) {
          if (chartLabel.currentValue[i].name === 'firstName' || chartLabel.currentValue[i].name === 'clientName' || chartLabel.currentValue[i].name === 'lastName' || chartLabel.currentValue[i].name === 'address' ||
            chartLabel.currentValue[i].name === 'service_type' || chartLabel.currentValue[i].name === 'industry' || chartLabel.currentValue[i].name === 'status' ||
            chartLabel.currentValue[i].name === 'doesClientRequireOwnForm') {
            this.fieldData.push(
              {
                label: this.onReplaceNames(chartLabel.currentValue[i].name),
                id: i,
                name: i,
                controlType: 'textbox',
                disabled: true,
                validation: [],
                visibility: true,
                width: 4,
                value: chartLabel.currentValue[i].value
              }
            );
          } else if (chartLabel.currentValue[i].name === 'newClientStatus') {
            this.fieldData.push(
              {
                label: 'Is existing client',
                name: i,
                controlType: 'textbox',
                disabled: true,
                validation: [],
                visibility: true,
                width: 4,
                value: chartLabel.currentValue[i].value
              });
          } else if (chartLabel.currentValue[i].name === 'conflictStatus') {
            if (chartLabel.currentValue[i].value) {
              this.fieldData.push(
                {
                  label: 'Is there a conflict ',
                  name: i,
                  controlType: 'textbox',
                  disabled: true,
                  validation: [],
                  visibility: true,
                  width: 4,
                  value: chartLabel.currentValue[i].value
                });
            }
          }
          if (chartLabel.currentValue[i].name === 'service_type') {
            console.log('data for service type');
            this.serviceType = chartLabel.currentValue[i].value;
            this.document.serviceType = chartLabel.currentValue[i].value;
            console.log(this.serviceType, this.document.serviceType);
          }
          if (chartLabel.currentValue[i].name === 'service_type') {
            this.serviceType = chartLabel.currentValue[i].value;
          }
          if (chartLabel.currentValue[i].name === 'partnerId') {
            let pId = chartLabel.currentValue[i].value;
            if (pId === '20020') {
              this.loggedInUserName = 'Partner 1';
            }
            if (pId === '24024') {
              this.loggedInUserName = 'Partner 2';
            }
          }
        }
        this.fieldDataInOrder[0] = this.fieldData[6];
        this.fieldDataInOrder[1] = this.fieldData[0];
        this.fieldDataInOrder[2] = this.fieldData[5];
        this.fieldDataInOrder[3] = this.fieldData[1];
        this.fieldDataInOrder[4] = this.fieldData[2];
        this.fieldDataInOrder[5] = this.fieldData[7];
        this.fieldDataInOrder[6] = this.fieldData[8];
        this.fieldDataInOrder[7] = this.fieldData[4];

        this.document.address = this.fieldData[5].value;
        this.document.clientName = this.fieldData[1].value;
        this.document.contactName = this.fieldData[6].value + ' ' + this.fieldData[0].value;
        this.document.engagementPartner = this.loggedInUserName;
        /*

        this.docVariables = JSON.parse(localStorage.getItem(this.processId + 'v'));
        this.document.mailInstruction = this.docVariables[0].mailInstruction;
        this.document.clientName = this.docVariables[1].clientName;
        this.document.address = this.docVariables[2].address;
        this.document.contactName = this.docVariables[3].contactName;
        this.document.serviceType = this.docVariables[4].serviceType;
        this.document.descriptionOfEngagement = this.docVariables[5].descriptionOfEngagement;
        this.document.engagementPartner = this.docVariables[6].engagementPartner;
        this.document.title = this.docVariables[7].title;
        this.document.natureOfEngagementPartner = this.docVariables[8].natureOfEngagementPartner;
        this.document.engagementResponsibilities = this.docVariables[9].engagementResponsibilities;
        this.document.service = this.docVariables[10].service;
        this.document.timelyPerformance = this.docVariables[11].timelyPerformance;
        this.document.clientResposiblity = this.docVariables[12].clientResposiblity; */

      }
    }
    let sign = changes['signatureToDocument'];
    if (sign) {
      if (sign.currentValue) {
        if (sign.currentValue) {
          let loggedInUser = JSON.parse(localStorage.getItem('loginEmail'));
          if (loggedInUser.includes('partner')) {
            this.onUpdatePartnerDocument();
          } else if (loggedInUser.includes('client')) {
            this.onUpdateClientDocument();
          }
        }
      }
    }
  }
  public tabChanged(e: any): void {
    this.activeTab = e.index;
    let loggedInUser = JSON.parse(localStorage.getItem('loginEmail'));
    if (loggedInUser === 'client@appteam.com') {
      this.onSelectThirdTab();
    }
    if (e.index === 2) {
      this.onSelectThirdTab();
    }
  }

  public mobTabChanged(e: any): void {
    this.activeTab = e.index;
    if (e.index === 0) {
      this.onSelectThirdTab();
    }
  }

  private onSelectThirdTab() {
    let pdfCount = 0;
    console.log('third tab');
    this.getVersion();
    if (!this.isVersionSelected) {
      this.setVersion();
    }
    this.documenData = JSON.parse(localStorage.getItem(this.processId));
    if (this.documenData !== null) {
      this.documenData.forEach(element => {
        console.log(this.currentVersion);
        if (element.version.docProcessId === this.processId !== null && this.currentVersion === ('V' + element.version.versionC)) {
          console.log(this.currentVersion);
          pdfCount = 1;
          // pdfMake.createPdf(element).getBlob(outDoc => {
          //   this.uploadFile([outDoc]);
          // });
        }
      });
    }
  }

  public onUpdateDocument(): void {
    this.versionCount = this.versionCount + 1;
    let versionC = this.versionCount;
    let docProcessId = this.processId;
    console.log('document', this.document);
    let d = new Date(this.document.date);
    let docDefinition = {
      content: [
        d.toLocaleDateString()
        + '\n',
        this.document.mailInstruction, '\n', this.document.clientName, '\n'
        , this.document.address
        , '\n\n', 'Attention:', this.document.contactName,
        '\n Re:' + this.document.serviceType, '\n\n\n Dear', ' ', this.document.contactName,
        '\n\n We are pleased to have the opportunity to assist' + this.document.clientName + ',(the Client) with '
        , this.document.descriptionOfEngagement,
        '\n \n This engagement letter, together with the attached Standard Terms and Conditions ',
        'and any other appendices mentioned in this engagement letter (collectively, the Engagement Agreement) '
        + 'set out the terms and conditions of your engagement of Richter S.E.N.C.R.L. (Richter) to perform the services described below.',
        '\n', this.document.engagementPartner + ' , ' + this.document.title + ',will act as the engagement partner and coordinate the services'
        , 'we perform for the Client. Where necessary or appropriate, we will draw upon other resources to assist with the engagement.'
        , 'The effective date of this engagement shall be the date on which we commenced providing services relating to this matter, '
        , 'notwithstanding the date of this letter.\n', { text: ' \n Scope of Engagement/Our Responsibilities', style: ['boldtext'] },
        '\n As agreed, we will', this.document.natureOfEngagementPartner,
        '\n In addition, we will advise you on further matters and provide you with ', '',
        ' supplemental services as you may request from time to time.' +
        'All such additional matters and services will also be governed by this Engagement Agreement unless we otherwise agree in writing from time to time.',
        { text: '\n Clients Responsibilities', style: ['boldtext'] },
        '\n The Client will provide to Richter,in a timely manner, complete and accurate information and access to management personnel,'
        , 'staff, premises, computer systems and applications as is reasonably required by Richter to complete the performance of its service.'
        , '\n ', this.document.engagementResponsibilities,
        { text: '\n \n Use, Distribution and Reproduction', style: ['boldtext'] },
        '\n Our report(s) and other analysis will be provided for your exclusive use and are not intended for ',
        'general circulation or publication, nor are they to be referenced, reproduced or used in ',
        'whole or in part for any purpose other than as described herein, without our written permission in each specific instance.'
        ,
        ' We shall not assume any responsibility or liability for losses occasioned to you or to any other parties, as a result of the circulation, dissemination, publication,'
        + 'reproduction or use of, or reference to, our report(s) and analysis contrary to the provisions of the Engagement Agreement.'
        + ' \n\n INSERT OTHER LIMITATIONS AND DISCLAIMERS SPECIFIC TO ENGAGEMENT',
        { text: '\n Fees and Expenses', style: ['boldtext'] },
        '\n Option 1 - Time spent without estimates'
        + '\n \n Our fees will be determined on the basis of the time spent at our standard billing rates.'
        + 'In addition to our professional fees, we will charge actual out-of-pocket expenses and disbursements'
        + 'relating to the services contemplated in the Engagement Agreement, as well as an administrative fee of'
        + '5% of our professional fees to cover administrative support personnel and other routine office expenses.'
        + 'Individual hourly rates vary according to the degree of responsibility involved and the experience and skill required.'
        + 'Unless otherwise indicated, dollar references in this engagement letter are to Canadian Dollars.'
        + '\n \n'
        + 'Option 2 - Estimated  Fees'
        + '\n'
        + 'We estimate that our fees for the services described in the Engagement Agreement will be '
        + '[input amount(s) and describe service(s)], plus an administrative fee of 5%.'
        + 'This fee estimate is based on anticipated cooperation from your personnel and the assumption'
        + 'that unexpected circumstances will not be encountered. If significant additional time is necessary,'
        + 'we will discuss the reasons with you and agree on a revised fee estimate before we incur additional costs.'
        + '\n \n '
        + 'Option 3 - Fixed Fee'
        + '\n \n'
        + 'As agreed, our fees for these services will be [$ amount] as well as an administrative fee of 5%'
        + 'of our professional fees to cover administrative support personnel and other routine office expenses.'
        + 'This fee estimate is based on anticipated cooperation from your personnel and the assumption that unexpected'
        + 'circumstances will not be encountered. If significant additional time is necessary, we will discuss the reasons'
        + 'with you and agree on a revised fee estimate before we incur additional costs'
        + '\n \n '
        + 'Option 4 - In addition to 1,2, or 3 you can add a  current hourly rates table'
        + '\n \n'
        + 'Retainer, if applicable]  In accordance with our Firms policy, prior to commencing our services, we require'
        + 'that you provide us with a retainer in the amount of $ amount. This retainer will be applied against our final invoice,'
        + 'and any unused portion will be returned to you upon our collection of all outstanding fees and costs related to the services'
        + 'contemplated in the Engagement Agreement. In addition, you hereby consent that we may draw down on the retainer'
        + 'in the event any of our accounts remain outstanding for longer than 30 days. Interim invoices must be paid with'
        + 'funds separate from the retainer, so that the full amount of the retainer remains in our account throughout the '
        + 'term of the engagement.  The retainer is not intended as, and should not be considered to be, an estimate of the'
        + 'total fees which will be incurred for our work.'
        + '\n\n'
        + 'Our fees and costs will be billed on a regular basis and are payable upon receipt. For additional information '
        + 'please see Standard Terms and Conditions attached.'
        + 'Other Matters - *'
        + '\n \n\n'
        + 'If these arrangements are in accordance with your understanding, please sign the enclosed duplicate of this letter'
        + 'in the space provided and return it to us. If you have any questions about the terms of engagement or other matters'
        + 'relating to any of our professional services, we will be pleased to discuss them further with you.'
        + '\n \n'
        + 'We look forward to being of service to you and trust that we will maintain a mutually satisfactory relationship.'
        + '\n'
        + 'Yours very truly,'
        + '\n \n'
        + 'Richter S.E.N.C.R.L.'
        + '\n \n'
        , { 'image': 'data:image/png;base64,' + emptySign, width: 200, height: 75, name: 'partner' }
        , { 'canvas': [{ type: 'line', x1: 10, y1: 10, x2: 200, y2: 10, lineWidth: 0.5 }] }
        , { text: '\n Engagement Partner Signature', margin: [20, 0] }, '\n\n'
        + 'The undersigned acknowledges and agrees that the Engagement Agreement correctly states our understanding'
        + 'with respect to the basis upon which Richter LLP has been engaged to represent'
        + this.document.clientName + 'in connection with the services described therein.' + '\n \n' + this.document.clientName
        , { 'image': 'data:image/png;base64,' + emptySign, width: 200, height: 75, name: 'client' }
        , { 'canvas': [{ type: 'line', x1: 10, y1: 10, x2: 200, y2: 10, lineWidth: 0.5 }] }
        , { text: '\n Sign and Print Name', margin: [20, 0] }, '\n \n\n'
        + 'Appendices or Schedules'
        + '\n\n',
        { text: '\n Standard Terms and Conditions', style: ['boldtext', 'alignCenter'] },
        '\n The following Standard Terms and Conditions apply to all services that are part of the ',
        'engagement of Richter S.E.N.C.R.L. (Richter) except as otherwise provided in the specific',
        'engagement letter between Richter and the Client to which these terms and conditions are attached:',
        '\n \n',
        this.document.service,
        { text: ' \n 2. Timely Performance -', style: ['boldtext'] },
        this.document.timelyPerformance, '\n',
        { text: ' \n 3.Clients Responsibilities -', style: ['boldtext'] },
        this.document.clientResposiblity,
        '\n \n',
        { text: ' 4 .Right to Terminate Services - ', style: ['boldtext'] },
        'The Client waives any and all rights of unilateral termination pursuant to articles 2125 and/or 2129 of the Civil Code of Quebec, and agrees'
        , 'that the termination rights of the Parties hereto shall be determined by the provisions of these Terms and Conditions'
        , 'and the Engagement Agreement to the exclusion of any other provision of law.'
        , 'The Client may terminate the Engagement Agreement upon written notice. If this occurs, the Client will pay for time and'
        , 'expenses incurred up to the termination date together with reasonable time and expenses incurred to bring the services'
        , 'to a close in a prompt and orderly manner. Should the Client not fulfill its obligations set out in the Engagement Agreement'
        , 'and in the absence of rectification by the Client within 15 days of notification by Richter, upon written notification Richter'
        , 'may terminate its services and will not be responsible for any loss, cost (including legal fees), damage, claim, expense,'
        , 'demand or liability resulting from such early termination.'
        , '\n\n',
        { text: '5 . Confidentiality - ', style: ['boldtext'] },
        'Both the Client and Richter agree that they will take reasonable steps to maintain the confidentiality of any '
        , 'proprietary or confidential information of the other within their respective organizations.'
        , '\n\n'
        , 'Neither Richter nor the Client will disclose the others proprietary or confidential information to any '
        , 'third party without the others consent, except to the extent such information:'
        , '\n\n'
        , '(a) is required to be disclosed by applicable legal authorities, legal processes, the rules of professional'
        , 'orders including those related to  the conduct/code of ethics of professional orders or other legal requirements;'
        , '\n\n'
        , '(b)shall have become publicly known or available, other than as a result of a breach of the Engagement Agreement;'
        , '\n\n'
        , '(c)was known to the recipient at the time of disclosure or is thereafter created independently without use of'
        , 'or reference to the others proprietary or confidential information;'
        , '\n\n'
        , '(d)is subsequently furnished to the recipient by a third party who has rightfully obtained the proprietary '
        , 'or confidential information without any restriction on disclosure.'
        , '\n\n',
        { text: '6 . Working Papers - ', style: ['boldtext'] },
        'All working papers, files and other internal materials created or produced by Richter related to the services '
        , 'contemplated in the Engagement Agreement are the property of Richter. In the event that Richter is requested by '
        , 'the Client or required by legal authority, legal process, the rules of professional orders including those related'
        , 'to the conduct/code of ethics of professional orders or other legal requirements to produce its files related to the'
        , 'services contemplated in the Engagement Agreement in proceedings to which Richter is not a party, the Client will reimburse'
        , 'Richter for its professional time and expenses, including legal fees, incurred in dealing with such matters'
        , 'Richter will not return or provide records or information obtained in the course of the services contemplated in the'
        , 'Engagement Agreement to the Client if it is illegal to do so or if Richter is requested to withhold the records or'
        , 'information by legal authority, legal process, the rules of professional orders including those related to  the'
        , 'conduct/code of ethics of professional orders or other legal requirements (regardless of whether the Engagement Agreement'
        , 'has been terminated).'
        + '\n \n',
        { text: '7.Privacy - ', style: ['boldtext'] },
        + 'The Client and Richter agree that, during the course of the engagement contemplated by the Engagement Agreement,'
        + 'Richter may collect personal information about identifiable individuals (Personal Information), either from the'
        + 'Client or from third parties. The Client and Richter agree that Richter will collect, use and disclose Personal Information'
        + 'on behalf of the Client solely for purposes related to completing the services contemplated'
        + 'in the Engagement Agreement and Richter shall not collect, use and disclose such Personal Information'
        + 'on Richters own behalf or for its own purposes. Richters services are provided on the basis that the Client'
        + 'represents to Richter that before Richter accesses such personal information, the Client will have obtained any'
        + 'required consents for collection, use and disclosure to Richter of personal information required'
        + 'under applicable privacy legislation.'
        + '\n \n',
        { text: '8. Communications -', style: ['boldtext'] },
        + 'Except as instructed otherwise in writing, each of Richter and the Client may assume that the other'
        + 'approves of properly addressed fax, electronic media (i.e.: e-mail, texts, etc.) and voice mail'
        + 'communication of both sensitive and non-sensitive documents and other communications concerning'
        + 'the services contemplated in the Engagement Agreement, as well as other means of communication used or'
        + 'accepted by the other. The Client understands the risks associated with communicating by electronic media '
        + '(i.e.: e-mail, texts, etc.) including the lack of security, unreliability of delivery and possible loss of'
        + 'confidentiality and legal privilege.'
        + '\n \n',
        { text: '9.File Inspections - ', style: ['boldtext'] },
        + 'In accordance with professional regulations (and by Richter policies), Richters client files must'
        + 'periodically be, and will be, reviewed by external practice and professional governing bodies and'
        + 'inspectors. In addition, Richter personnel not specifically involved in your file may review such files to'
        + 'ensure that Richter is adhering to its professional and internal standards. File reviewers are required to'
        + 'maintain confidentiality of client information.'
        + '\n'

      ], styles: {
        boldtext: { bold: true }
        , alignCenter: { alignment: 'center' }

      }, version: {
        versionC,
        docProcessId
      }

    };
    let document = (docDefinition);
    pdfMake.createPdf(document).getDataUrl(function (outDoc) {
      let x = outDoc.split(',');
      localStorage.setItem('base64OfPdf', x[1]);
    });
    this.setVersion();
    this.documentList.push(document);
    this.docVariables = [
      {'mailInstruction': this.document.mailInstruction},
      {'clientName': this.document.clientName},
      {'address': this.document.address},
      {'contactName': this.document.contactName},
      {'serviceType': this.document.serviceType},
      {'descriptionOfEngagement': this.document.descriptionOfEngagement},
      {'engagementPartner': this.document.engagementPartner},
      {'title': this.document.title},
      {'natureOfEngagementPartner': this.document.natureOfEngagementPartner},
      {'engagementResponsibilities': this.document.engagementResponsibilities},
      {'service': this.document.service},
      {'timelyPerformance': this.document.timelyPerformance},
      {'clientResposiblity': this.document.clientResposiblity}
    ];
    localStorage.setItem(this.processId + 'v', JSON.stringify(this.docVariables));
    // localStorage.setItem('document', JSON.stringify(this.documentList));
    localStorage.setItem(this.processId, JSON.stringify(this.documentList));
    localStorage.setItem('this.processId.version', this.versionCount.toString());
    this.getVersion();
    localStorage.setItem('service_terms', this.document.service);
    localStorage.setItem('timely_performance_terms', this.document.timelyPerformance);
    localStorage.setItem('client_responsibilities_terms', this.document.clientResposiblity);
    pdfMake.createPdf(document).getBlob(outDoc => {
      this.uploadFile([outDoc]);
    });
    this.onCreateEnvelope();
  }
  onSelectChanges() {
    this.isVersionSelected = true;
    this.onSelectThirdTab();
  }

  private onCreateEnvelope() {
    setTimeout(() => {
      console.log('delay');
      this.docuginService.loginWithAdminUser().subscribe(
        (x) => {
          console.log(x);
          localStorage.setItem(this.processId + 'newEnvelope', JSON.stringify(x));
          // alert('Envelope created successfully');
        },
        (err) => {
          console.log('error', err);
        }
      );
    }, 200); // insert there the delay
  }

  public onUpdatePartnerDocument() {
    let id = JSON.parse(localStorage.getItem(this.processId + 'newEnvelope')).envelopeId;
    this.docuginService.partnerSigning(id).subscribe(
      (x) => {
        console.log(x);
        if (x.url) {
          localStorage.setItem('redirecturl', window.location.href);
          window.location.replace(x.url);
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  public onUpdateClientDocument() {
    let id = JSON.parse(localStorage.getItem(this.processId + 'newEnvelope')).envelopeId;
    this.docuginService.clientSigning(id).subscribe(
      (x) => {
        console.log(x);
        if (x.url) {
          localStorage.setItem('redirecturl', window.location.href);
          window.location.replace(x.url);
        }
      },
      (err) => {
        alert('Recipient not in sequence');
        console.log('err', err);
      }
    );
  }

  public downloadCurrentUpdatedDocument() {
    let id = JSON.parse(localStorage.getItem(this.processId + 'newEnvelope')).envelopeId;
    this.docuginService.downloadCurrentUpdatedDocument(id).subscribe(
      (x) => {
        localStorage.setItem(this.processId + 'status', 'false');
        this.uploadFile([x]);
        localStorage.setItem('current_status_docusign_document', '');
        let base64data;
        let reader = new FileReader();
        reader.readAsDataURL(x);
        reader.onloadend = (e: Event) => {
          base64data = reader.result;
          if (base64data) {
            this.updateDocumentToDocushare(base64data);
          }
        };
      },
      (err) => {
        console.log('error', err);
      }
    );
  }

  public updateDocumentToDocushare(base64data) {
    let fileName = JSON.parse(localStorage.getItem('loginEmail')).split('@')[0];
    this.docuginService.updateDocumenTpDocushare(base64data, fileName);
  }

  uploadFile(fileContent: Blob[]) {
    let file: File = new File(fileContent, 'Document V' + this.getDocumentVersion() + '.pdf', {type: 'application/pdf'});
    let opts = {
      isRelatedContent: true
    };
    this.activitiContentService.createProcessRelatedContent(this.processId, file, opts).subscribe(
      (res) => {
        this.reloadProcessAttachList();
        this.activeTab = 2;
      },
      (err) => {
        console.log(err);
      });
  }

  private getDocumentVersion(): number {
    let version = this.processAttachList.attachments ? this.processAttachList.attachments.length : 0;
    return ++version;
  }

  reloadProcessAttachList() {
    this.processAttachList.reload();
  }
  tabChange(e) {
    this.activeTab = e.index;
  }
}
