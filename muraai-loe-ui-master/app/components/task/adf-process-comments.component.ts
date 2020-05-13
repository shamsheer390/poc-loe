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

import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Comment } from 'ng2-activiti-tasklist';
import { ActivitiProcessService } from 'ng2-activiti-processlist';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { ADFTaskFromComponent } from './adf-task-form.component';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'adf-process-comments',
    moduleId: module.id.toString(),
    templateUrl: './adf-process-comments.component.html',
    styleUrls: ['./adf-process-comments.component.scss'],
    providers: [ActivitiProcessService]
})
export class   ADFProcessComments implements OnChanges {
    @Input()
    processInstanceId: string;
    @Input()
    readOnly: boolean = false;
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: any;

    comments: Comment [] = [];

    commentObserver: Observer<Comment>;

    comment$: Observable<Comment>;

    message: string;

    pId: string;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess Process service
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService,
                private adfTaskFromComponent: ADFTaskFromComponent) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/bundles/assets/ng2-activiti-processlist');
        }

        this.pId = this.adfTaskFromComponent.getProcessInstanceId();
        this.comment$ = new Observable<Comment>(observer => this.commentObserver = observer).share();
        this.comment$.subscribe((comment: Comment) => {
            this.comments.push(comment);
        });
    }

    ngAfterViewInit() {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

   ngOnChanges(changes: SimpleChanges) {
        let processInstanceId = this.pId;
        if (processInstanceId) {
            if (processInstanceId) {
                this.getProcessComments(processInstanceId);
            } else {
                this.resetComments();
            }
        }
    }

    private getProcessComments(pId) {
        this.comments = [];
        // if (pId) {
        //     this.activitiProcess.getProcessInstanceComments(pId).subscribe(
        //         (res: Comment[]) => {
        //             res = res.sort((a: Comment, b: Comment) => {
        //                 let date1 = new Date(a.created);
        //                 let date2 = new Date(b.created);
        //                 if (date1 > date2) {
        //                     return -1;
        //                 } else if (date1 < date2) {
        //                     return 1;
        //                 } else {
        //                     return 0;
        //                 }
        //             });
        //             res.forEach((comment) => {
        //                 this.commentObserver.next(comment);
        //             });
        //         },
        //         (err) => {
        //             this.error.emit(err);
        //         }
        //     );

        // } else {
        //     this.resetComments();
        // }
    }

    private resetComments() {
        this.comments = [];
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public add() {
        this.activitiProcess.addComment(this.pId, this.message).subscribe(
            (res: Comment) => {
                this.comments.unshift(res);
                this.message = '';
            },
            (err) => {
                this.error.emit(err);
            }
        );
        this.cancel();
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }
    getUserShortName(comment: any) {
        let fisrtShort = '';
        let lastShort = '';
        if (comment && comment.createdBy) {
            if (comment.createdBy.firstName && comment.createdBy.firstName !== '') {
                fisrtShort = comment.createdBy.firstName[0];
            }
            if (comment.createdBy.lastName && comment.createdBy.lastName !== '') {
                lastShort = comment.createdBy.lastName[0];
            }
        }

        return fisrtShort + lastShort;
    }
}
