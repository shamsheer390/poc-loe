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

import { Component, ElementRef, Input, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {
    ActivitiTaskListService
} from 'ng2-activiti-tasklist';
import {
    ActivitiProcessService
} from 'ng2-activiti-processlist';
import { AnalyticsService } from 'ng2-activiti-analytics';

import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { FormService, FormRenderingService } from 'ng2-activiti-form';

declare var componentHandler;
declare let dialogPolyfill: any;
declare var document: any;

@Component({
    selector: 'my-start-task',
    templateUrl: './my-start-task.html',
    styleUrls: ['./my-start-task.css', './my-start-task.scss'],
    providers: [ActivitiTaskListService]
})
export class MyStartTaskComponent {

    @Input()
    appId: number = 7007; // appid for POE Process

    @ViewChild('alertbox')
    alertbox: any;

    constructor(private elementRef: ElementRef,
                private route: ActivatedRoute,
                private apiService: AlfrescoApiService,
                private formRenderingService: FormRenderingService,
                private formService: FormService,
                private router: Router,
                private analyticsService: AnalyticsService,
                private tasklistService: ActivitiTaskListService,
                private processlistService: ActivitiProcessService,
                private sanitizer: DomSanitizer) {
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    onStart() {
        this.showAlert();
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
        this.router.navigateByUrl('/ap/tasks');
    }

    private closeAlert() {
        if (this.alertbox) {
          this.alertbox.nativeElement.close();
        }
    }
}
