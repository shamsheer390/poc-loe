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

import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';

import { TaskDetailsModel, ActivitiTaskListService } from 'ng2-activiti-tasklist';
import { Form } from 'ng2-activiti-tasklist/src/models/form.model';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'adf-start-task',
    moduleId: module.id.toString(),
    templateUrl: './activiti-start-task.component.html',
    styleUrls: ['./activiti-start-task.component.css']
})
export class ADFStartTaskComponent implements OnInit {

    @Input()
    appId: string;

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    onCancel: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('dialog')
    dialog: any;

    forms: Form[];

    formId: string = null;

    name: string;
    description: string;
    date: string;
    process: string;
    assignee: any;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private translateService: AlfrescoTranslationService,
                private taskService: ActivitiTaskListService,
                private logService: LogService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/bundles/assets/ng2-activiti-tasklist');
        }
    }

    ngOnInit() {
        this.loadFormsTask();
    }

    public start() {
        if (this.name) {
            this.taskService.createNewTask(new TaskDetailsModel({
                name: this.name,
                description: this.description,
                assignee: {
                    id: this.getAssigneeId(this.assignee)
                },
                dueDate: this.date,
                processInstanceId: this.process,
                formKey: this.formId,
                category: this.appId ? '' + this.appId : null
            })).subscribe(
                (res: any) => {
                    this.onSuccess.emit(res);
                    this.resetForm();
                    this.attachForm(res.id);
                },
                (err) => {
                    // window.alert('An error occurred while trying to add the task');
                    this.logService.error(err);
                }
                );
        }
    }

    private attachForm(taskId: string) {
        if (this.formId && taskId) {
            this.taskService.attachFormToATask(taskId, Number(this.formId));
            this.formId = null;
        }
    }

    public cancel() {
        this.onCancel.emit();
    }

    private loadFormsTask() {
        this.taskService.getFormList().subscribe((res: Form[]) => {
            this.forms = res;
        },
            (err) => {
                // window.alert('An error occurred while trying to get the forms');
                this.logService.error(err);
            });
    }

    private resetForm() {
        this.name = '';
        this.description = '';
    }

    onDateChanged(dateSelected: string) {
        this.date = dateSelected;
    }

    getAssigneeId(emailId: string) {
        switch (emailId) {
          case 'admin@app.activiti.com': return '1';
          case 'infad.k@muraai.com': return '1002';
          case 'deepak.paul@muraai.com': return '1001';
          default: return '1';
        }
    }
}
