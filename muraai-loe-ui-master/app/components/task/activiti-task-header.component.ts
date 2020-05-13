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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { TaskDetailsModel, ActivitiTaskListService } from 'ng2-activiti-tasklist';

declare var componentHandler: any;

@Component({
    selector: 'adf-task-header',
    moduleId: module.id.toString(),
    templateUrl: './activiti-task-header.component.html',
    styleUrls: ['./activiti-task-header.component.css']
})
export class ADFTaskHeader {

    @Input()
    formName: string = null;

    @Input()
    taskDetails: TaskDetailsModel;

    @Output()
    claim: EventEmitter<any> = new EventEmitter<any>();

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

    public hasAssignee(): boolean {
        return (this.taskDetails && this.taskDetails.assignee) ? true : false;
    }

    isAssignedToMe(): boolean {
        return this.taskDetails.assignee ? true : false;
    }

    claimTask(taskId: string) {
        this.activitiTaskService.claimTask(taskId).subscribe(
            (res: any) => {
                this.logService.info('Task claimed');
                this.claim.emit(taskId);
            });
    }
}
