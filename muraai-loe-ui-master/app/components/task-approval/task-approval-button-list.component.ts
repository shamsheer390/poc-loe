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

import {Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TaskApprovalService} from './services/task-approval.service';
import {ActivitiTaskListService, TaskDetailsModel} from 'ng2-activiti-tasklist';

declare let dialogPolyfill: any;

@Component({
  selector: 'task-approval-button-list',
  moduleId: module.id.toString(),
  templateUrl: './task-approval-button-list.component.html',
  styleUrls: ['./task-approval-button-list.component.css'],
  providers: [TaskApprovalService, ActivitiTaskListService]
})
export class TaskApprovalButtonListComponent implements OnInit {
  notificationObj: { 'mailContent': string; 'mailFrom': string; 'mailSubject': string; 'mailTo': any[]; };

  @Input()
  taskDetails: TaskDetailsModel;

  @ViewChild('alertbox')
  alertbox: any;

  @Output()
  signatureToUpdate: EventEmitter<any> = new EventEmitter<any>();
  taskName: Array<any> = [];

  buttonServiceData: any;
  buttonList: Array<any> = [];

  taskStatus: string = '';
  req: string = '';
  signButtonShow: boolean = false;

  constructor(private taskApprovalServices: TaskApprovalService,
              private router: Router,
              private activitiTaskList: ActivitiTaskListService) {
    this.setButtonServiceData();
    if (this.taskDetails) {
      this.setButtonList(this.taskDetails.taskDefinitionKey);
    }
  }
  ngOnInit(): void {
    let loggedInUser = JSON.parse(localStorage.getItem('loginEmail'));
    this.taskName = this.taskDetails.name.split('-');
    if (loggedInUser === 'client@appteam.com' || loggedInUser === 'partner1@appteam.com' || loggedInUser === 'partner2@appteam.com' ) {
      this.signButtonShow = true;
    }
    if (this.taskName[0] === 'Partner Reviews the Document ') {
      this.signButtonShow = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    let taskDetailsObj = changes['taskDetails'];
    if (taskDetailsObj) {
      this.taskDetails = taskDetailsObj.currentValue;
      this.setButtonList(this.taskDetails.taskDefinitionKey);
      console.log(' KEY : ' + this.taskDetails.taskDefinitionKey);
    }
  }

  private setButtonServiceData() {

    this.buttonServiceData = {
      'CONTRACT_SUBMISSION': {
        'buttons': [
          {'label': 'Send to partner', 'status': 'LOE form has been sent to Partner'}
        ],
        'status_no_client_form': 'Client does not require own form',
        'status_client_form_approved': 'Client form has NOT been previously approved',
        'status_client_form_not_approved': 'Client form has been previously approved'
      },

      'PARTNER_REVIEW': {
        'buttons': [
          {'label': 'Send to Client', 'status': 'Document has been sent to Client'},
          {'label': 'Forward to CCB/Legal Team', 'status': 'Forwarded to CCB and or Legal review'}
        ]
      },

      'CLIENT_REVIEW': {
        'buttons': [
          {'label': 'Approve', 'status': 'Document has been approved by Client'},
          {'label': 'Send back', 'status': 'Client has sent the form back to Partner'}
        ]
      },

      'DOCUMENT_SIGN': {
        'buttons': [
          {'label': 'Complete Task', 'status': 'Document has been signed by Partner'}
        ]
      },

      'CCB_REVIEW': {
        'buttons': [
          {'label': 'Approve', 'status': 'CCB approved and Legal Counsel review not required'},
          {'label': 'Forward to Legal Counsel', 'status': 'CCB reviewed and forwarded to Legal Counsel'}
        ]
      },

      'LEGAL_REVIEW': {
        'buttons': [
          {'label': 'Approve', 'status': 'Legal Counsel approved'}
        ]
      }
    };
  }

  private setButtonList(typeName: string) {
    if (typeName) {
      let task = this.buttonServiceData[typeName];
      this.buttonList = task ? task.buttons : null;
    }
  }

  onActionButtonClick(status: string) {
            this.taskStatus = status;
            let instanceId = this.taskDetails.processInstanceId;
            console.log(instanceId);
            let invoiceStatusObj = {
              'name': 'status',
              'type': 'string',
              'value': status,
              'scope': 'global'
            };

            console.log(invoiceStatusObj);
            this.taskApprovalServices.updateInvoiceTaskStatus(invoiceStatusObj, instanceId, 'status').subscribe(
              () => {
                this.activitiTaskList.completeTask(this.taskDetails.id).subscribe(
                  () => {
                    this.showAlert();
                    let filterObj = {
                      'processInstanceId': instanceId,
                      'state': 'active'
                    };
                    this.taskApprovalServices.getTaskIdByInstanceId(filterObj).subscribe(
                      res => {
                        console.log(res);
                        let taskId = res.data[0].id;
                        let email = res.data[0].assignee.email;
                        if (email === 'client@appteam.com') {
                          let username = btoa(res.data[0].assignee.email);
                          let uname = username.replace('==', '' );
                          let password = btoa('admin');
                          let subject = 'Partner has sent a document for you!';
                          let fullUrl = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '#/ap/auth-handler/' + taskId + '/' + uname + '/' + password;
                          let mailContent = '<center><table border="0" cellpadding="20" cellspacing="0" height="100%" style="background-color:#f3f3f3" width="100%"><tbody><tr><td align="center" valign="top" style="width: 100%;"><table border="0" cellpadding="0" cellspacing="0" style="background-color:transparent;border:1px solid transparent" style="min-width: 600px;"><tbody><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><a href="" style="display:inline-block;width:100%;background-color:#00bcd4;text-decoration:none;color:#fff;font-size:18px;font-weight:600;text-align:center;padding:10px 0px 10px 0px;border-radius:5px;">Richter LOE Process</a></td></tr></tbody></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="background-color:#fff" width="100%"><tbody><tr><td style="color:#505050;font-size:14px;line-height:150%;text-align:left" valign="top"><table border="0" cellpadding="20" cellspacing="0" width="100%"><tbody><tr><td valign="top"><div style="padding-top:1px"><div style="font-size:14px;line-height:19px;color:#000">Dear ' + res.data[0].assignee.firstName + ',<br><br>Partner has sent a document for you. Please click on below button to view the document.<br><br><a style="display:inline-block;width:100%;background-color:#ff9800;text-decoration:none;color:#fff;font-size:18px;font-weight:600;text-align:center;padding:10px 0px 10px 0px;border-radius:5px;" href="' + fullUrl + '" target="_blank">View the document</a><br><br>Have a great day! <span style="color:#999">The <span class="il">LOE</span> Team</span></div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><p>&nbsp;</p></center>';
                          this.notificationObj = {
                        'mailContent': mailContent,
                        'mailFrom': 'trainee_muraai@muraai.com',
                        'mailSubject': subject,
                        'mailTo': [
                          email
                        ]
                      };
                        }
                        if (email === 'partner1@appteam.com' || email === 'partner2@appteam.com') {
                          let username = btoa(res.data[0].assignee.email);
                          let uname = username.replace('=', '' );
                          let password = btoa('admin');
                          let subject = 'LOE process has sent a document for you!';
                          let fullUrl = 'http://' + window.location.hostname + ':' + window.location.port + window.location.pathname + '#/ap/auth-handler/' + taskId + '/' + uname + '/' + password;
                          let mailContent = '<center><table border="0" cellpadding="20" cellspacing="0" height="100%" style="background-color:#f3f3f3" width="100%"><tbody><tr><td align="center" valign="top" style="width: 100%;"><table border="0" cellpadding="0" cellspacing="0" style="background-color:transparent;border:1px solid transparent" style="min-width: 600px;"><tbody><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><a href="" style="display:inline-block;width:100%;background-color:#00bcd4;text-decoration:none;color:#fff;font-size:18px;font-weight:600;text-align:center;padding:10px 0px 10px 0px;border-radius:5px;">Richter LOE Process</a></td></tr></tbody></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" style="background-color:#fff" width="100%"><tbody><tr><td style="color:#505050;font-size:14px;line-height:150%;text-align:left" valign="top"><table border="0" cellpadding="20" cellspacing="0" width="100%"><tbody><tr><td valign="top"><div style="padding-top:1px"><div style="font-size:14px;line-height:19px;color:#000">Dear ' + res.data[0].assignee.firstName + ',<br><br>LOE process has sent a document for you. Please click on below button to view the document.<br><br><a style="display:inline-block;width:100%;background-color:#ff9800;text-decoration:none;color:#fff;font-size:18px;font-weight:600;text-align:center;padding:10px 0px 10px 0px;border-radius:5px;" href="' + fullUrl + '" target="_blank">View the document</a><br><br>Have a great day! <span style="color:#999">The <span class="il">LOE</span> Team</span></div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><p>&nbsp;</p></center>';
                          this.notificationObj = {
                            'mailContent': mailContent,
                            'mailFrom': 'trainee_muraai@muraai.com',
                            'mailSubject': subject,
                            'mailTo': [
                              email
                        ]
                      };
                        }
                        if (email === 'client@appteam.com' || email === 'partner1@appteam.com' || email === 'partner2@appteam.com') {
                        this.taskApprovalServices.sendEmail(this.notificationObj).subscribe(
                    () => {}
                  );
                  }
                }
               );
              }
            );
          });
        }

  private showAlert() {

    if (!this.alertbox.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.alertbox.nativeElement);
    }
    if (this.alertbox) {
      this.alertbox.nativeElement.showModal();
    }
  }

  private closeAlert() {
    if (this.alertbox) {
      this.alertbox.nativeElement.close();
    }

  }

  onOKClick() {
    this.closeAlert();
    this.router.navigate(['/ap/tasks']);
  }

  public onPopUp(): void {
    let r = Math.random() % 10;
    r === 0 ? this.signatureToUpdate.emit(r + 1)   : this.signatureToUpdate.emit(r);
  }
}
