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

import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivitiTaskListService,
  TaskDetailsModel,
  User,
  TaskQueryRequestRepresentationModel
} from 'ng2-activiti-tasklist';

import {
  ActivitiProcessService, ProcessInstance
} from 'ng2-activiti-processlist';
import { FormService, FormModel, FormOutcomeEvent } from 'ng2-activiti-form';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'adf-task-form',
  moduleId: module.id.toString(),
  templateUrl: './adf-task-form.component.html',
  styleUrls: ['./adf-task-form.component.scss']
})
export class ADFTaskFromComponent implements OnInit, OnChanges {
  details: any[];
  @Input()
  taskId: string;

  @Input()
  appName: string = '';

  @Input()
  showNextTask: boolean = true;

  @Input()
  showFormTitle: boolean = true;

  @Input()
  showFormCompleteButton: boolean = true;

  @Input()
  showFormSaveButton: boolean = true;

  @Input()
  readOnlyForm: boolean = false;

  @Input()
  showFormRefreshButton: boolean = true;

  @Input()
  peopleIconImageUrl: string;

  @Output()
  formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

  @Output()
  formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

  @Output()
  formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

  @Output()
  taskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

  @Output()
  onError: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

  @Output()
  onBackClick: EventEmitter<void> = new EventEmitter<void>();

  taskDetails: TaskDetailsModel;
  taskFormName: string = null;
  processDetails: any;

  data: any = {};
  clientName: string;
  email: string;

  taskPeople: User[] = [];

  taskRespectedClass: string = 'alf-am-task-form-container';
  detailsRespectedClass: string = 'alf-am-task-details-container';
  signatureToUpdate: any = '';
  currentUserRole: string = 'partner';
  isOverLayMode: boolean = false;

  noTaskDetailsTemplateComponent: TemplateRef<any>;
  /**
   * Constructor
   * @param auth Authentication service
   * @param translate Translation service
   * @param activitiForm Form service
   * @param activitiTaskList Task service
   */
  constructor(
    private translateService: AlfrescoTranslationService,
    private activitiForm: FormService,
    private activitiTaskList: ActivitiTaskListService,
    private processList: ActivitiProcessService,
    private logService: LogService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.clientName = localStorage.getItem('clientName');
    this.email = localStorage.getItem('email');
    // this.refreshFrame();
    this.route.params.subscribe(params => {
      this.taskId = params['taskId'];
      if (this.taskId) {
        this.loadDetails(this.taskId);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let taskId = changes['taskId'];
    if (taskId && !taskId.currentValue) {
      this.reset();
      return;
    }
    if (taskId && taskId.currentValue) {
      if (taskId.previousValue === 'CD_INIT_VALUE') {
        return;
      }
      this.loadDetails(taskId.currentValue);
      return;
    }
  }

  /**
   * Reset the task details
   */
  private reset() {
    this.taskDetails = null;
  }

  /**
   * Check if the task has a form
   * @returns {TaskDetailsModel|string|boolean}
   */
  hasFormKey() {
    return (this.taskDetails
      && this.taskDetails.formKey
      && this.taskDetails.formKey !== 'null');
  }

  isTaskActive() {
    return this.taskDetails && this.taskDetails.duration === null;
  }

  /**
   * Load the activiti task details
   * @param taskId
   */
  private loadDetails(taskId: string) {
    this.reset();
    this.taskPeople = [];
    this.taskFormName = null;
    this.taskDetails = null;
    if (taskId) {
      this.activitiTaskList.getTaskDetails(taskId).map((res) => res).subscribe(
        (res: TaskDetailsModel) => {
          this.taskDetails = res;
          let endDate: any = res.endDate;
          this.readOnlyForm = !!(endDate && !isNaN(endDate.getTime()));
          this.processList.getProcess(this.taskDetails.processInstanceId).subscribe(
            (resp: ProcessInstance) => {
              this.processDetails = resp;
            }
          );
        });
    }
  }

  isAssignedToMe(): boolean {
    return (this.taskDetails !== null) ? (this.taskDetails.assignee ? true : false) : false;
  }

  /**
   * Retrieve the next open task
   * @param processInstanceId
   * @param processDefinitionId
   */
  private loadNextTask(processInstanceId: string, processDefinitionId: string) {
    let requestNode = new TaskQueryRequestRepresentationModel(
      {
        processInstanceId: processInstanceId,
        processDefinitionId: processDefinitionId
      }
    );
    this.activitiTaskList.getTasks(requestNode).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.taskDetails = response[0];
        } else {
          this.reset();
        }
      }, (error) => {
        this.logService.error(error);
        this.onError.emit(error);
      });
  }
  getProcessInstanceId(): string {
    return this.taskDetails.processInstanceId;
  }

  /**
   * Complete button clicked
   */
  onComplete() {
    this.activitiTaskList.completeTask(this.taskId).subscribe(
      (res) => this.onFormCompleted(null)
    );
  }

  onFormSaved(form: FormModel) {
    this.formSaved.emit(form);
  }

  onFormCompleted(form: FormModel) {
    this.formCompleted.emit(form);
    if (this.showNextTask) {
      this.loadNextTask(this.taskDetails.processInstanceId, this.taskDetails.processDefinitionId);
    }
  }

  onFormLoaded(form: FormModel) {
    this.taskFormName = null;
    if (form && form.name) {
      this.taskFormName = form.name;
    }
    this.formLoaded.emit(form);
  }

  onChecklistTaskCreated(task: TaskDetailsModel) {
    this.taskCreated.emit(task);
  }

  onFormError(error: any) {
    this.onError.emit(error);
  }

  onFormExecuteOutcome(event: FormOutcomeEvent) {
    this.executeOutcome.emit(event);
  }

  closeErrorDialog(): void {

  }

  onClaimTask(taskId: string) {
    this.loadDetails(taskId);
  }

  getPONumberFromTitle(taskTitle: string) {
    let tileSplitterArray = taskTitle.split(' - ');
    return tileSplitterArray[tileSplitterArray.length - 1];

  }

  onDataSuccess(data: any) {
    this.data = data;
  }
  public fullScreenMode(e: Event) {
    this.isOverLayMode = true;
    this.taskRespectedClass = 'task-container ';
    this.detailsRespectedClass = 'view-container';
  }

  public defaultLayoutMode(e: Event) {
    this.isOverLayMode = false;
    this.taskRespectedClass = 'alf-am-task-form-container';
    this.detailsRespectedClass = 'alf-am-task-details-container';
  }

  commentTabSelected(isCommentTabSelected: boolean) {
    if (isCommentTabSelected) {
      this.taskRespectedClass = 'alf-am-task-form-container';
      this.detailsRespectedClass = 'alf-am-task-details-container';
    }
  }
  refreshFrame() {
    let pdf = JSON.parse(localStorage.getItem('pdfMakeDD'));
    pdfMake.createPdf(pdf).getDataUrl(function (outDoc) {
      document.getElementById('pdfV')['src'] = outDoc;
    });
  }
  public updatedSignFromPopup($event): void {
    this.signatureToUpdate = $event;
  }
}
