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

import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { TaskDetailsModel, ActivitiTaskListService, User } from 'ng2-activiti-tasklist';

declare var componentHandler: any;

@Component({
  selector: 'adf-task-details1',
  moduleId: module.id.toString(),
  templateUrl: './activiti-task-details.component.html',
  styleUrls: ['./activiti-task-details.component.css']
})
export class ADFTaskDetails {

  @Input()
  activeTab: string = 'details_page';

  @Input()
  taskId: string = '';

  @Input()
  invoiceNumber: string = '';

  @Output()
  onFullScreen: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  isCommentTab: EventEmitter<any> = new EventEmitter<any>();

  taskDetails: TaskDetailsModel;
  taskFormName: string = null;
  isOverLayMode: boolean = true;

  taskPeople: User[] = [];

  readOnlyForm: boolean = false;

  constructor(private translateService: AlfrescoTranslationService,
              private activitiTaskService: ActivitiTaskListService,
              private logService: LogService) {
    if (translateService) {
      translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/bundles/assets/ng2-activiti-tasklist');
    }
  }

  ngAfterViewInit() {
    if (componentHandler) {
      componentHandler.upgradeAllRegistered();
    }
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
   * Load the activiti task details
   * @param taskId
   */
  private loadDetails(taskId: string) {
    this.taskPeople = [];
    this.taskFormName = null;
    if (taskId) {
      this.activitiTaskService.getTaskDetails(taskId).map((res) => res).subscribe(
        (res: TaskDetailsModel) => {
          this.taskDetails = res;

          if (this.taskDetails.name === 'null') {
            this.taskDetails.name = 'No name';
          }

          let endDate: any = res.endDate;
          this.readOnlyForm = !!(endDate && !isNaN(endDate.getTime()));
        });
    }
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

  hasTaskDetails() {
    return (this.taskDetails !== undefined && this.taskDetails !== null);
  }

  /**
   * Reset the task details
   */
  private reset() {
    this.taskDetails = null;
  }

  getActiveTabClass(tabName: string) {
    if (this.activeTab === tabName) {
      return 'is-active';
    } else {
      return '';
    }
  }

  public fullScreenMode(e: Event) {
    this.isOverLayMode = false;
    this.onFullScreen.emit(true);
  }

  public defaultLayoutMode(e: Event) {
    this.isOverLayMode = true;
    this.onFullScreen.emit(false);
  }

  public tabChanged(e: any) {
    if ( e ) {
      if ( !this.isOverLayMode && e.index === 1) {
        this.isCommentTab.emit(true);
        this.isOverLayMode = true;
      }

    }
  }
}
