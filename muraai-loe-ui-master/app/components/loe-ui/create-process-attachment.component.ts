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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivitiContentService } from 'ng2-activiti-form';
import {LoeUiDocusignService} from './services/loe-ui-docusign.service';

@Component({
    selector: 'adf-create-attachment',
    styleUrls: ['./create-process-attachment.component.css'],
    templateUrl: './create-process-attachment.component.html'
})
export class CreateAttachmentComponent implements OnChanges {

    @Input()
    processInstanceId: string;

    @Input()
    docContent: any;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    constructor(private activitiContentService: ActivitiContentService,
                private uploadService: LoeUiDocusignService) {
                    console.log(this.docContent);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['processInstanceId'] && changes['processInstanceId'].currentValue) {
            this.processInstanceId = changes['processInstanceId'].currentValue;
        }
    }
    /* onFileUpload(event: any) {
        let filesList: File[] = event.detail.files.map(obj => obj.file);
        // console.log('FileList' + JSON.stringify(filesList));
        for (let fileInfoObj of filesList) {
            let file: File = fileInfoObj;
            let opts = {
                isRelatedContent: true
            };
            // console.log('Create Service' + JSON.stringify(file));
            this.activitiContentService.createProcessRelatedContent(this.processInstanceId, file, opts).subscribe(
                (res) => {
                    this.success.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                });
        }
    }*/
    onButtonClick($event) {
        let content = {
                'name': 't&c-v1.pdf',
                'link': true,
                'source': this.docContent,
                'mimeType': 'application/pdf'
        };
        let isRelatedContent: boolean = true;
        this.uploadService.onCreateAttachment(this.processInstanceId, content, isRelatedContent).subscribe(
            (res) => {
                this.success.emit(res);
            },
            (err) => {
                this.error.emit(err);
            });
    }
}
