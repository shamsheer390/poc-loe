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

import { AfterViewInit, Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import {
    AnalyticsService,
    AnalyticsGeneratorComponent
} from 'ng2-activiti-analytics';
import {
    ActivitiTaskListService,
    FilterRepresentationModel
} from 'ng2-activiti-tasklist';
import {
    ActivitiProcessService,
    FilterProcessRepresentationModel
} from 'ng2-activiti-processlist';
import { ReportQuery, ReportParametersModel } from 'ng2-activiti-diagrams';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

declare let componentHandler;
declare let document: any;

@Component({
    selector: 'process-service-dashboard',
    templateUrl: './process-service-dashboard.component.html',
    styleUrls: ['./process-service-dashboard.component.css'],
    providers: [ActivitiTaskListService]
})
export class ProcessServiceDashboardComponent implements AfterViewInit {

    @Input()
    appId: number = null;

    @Output()
    onError = new EventEmitter();

    sub: Subscription;

    taskReportId: number;
    caseReportId: number;
    showProcessDashboard: boolean = true;
    showTaskDashboard: boolean = false;
    appDetails: any;
    defaultTaskFilterId: string = '2';
    defaultProcessFilterId: string = '6';

    processDefnitionId: string = '';

    @ViewChild('analytics_process_generator1')
    analyticsProcessGenerator1: AnalyticsGeneratorComponent;
    @ViewChild('analytics_process_generator2')
    analyticsProcessGenerator2: AnalyticsGeneratorComponent;
    @ViewChild('analytics_process_generator3')
    analyticsProcessGenerator3: AnalyticsGeneratorComponent;
    @ViewChild('analytics_process_generator4')
    analyticsProcessGenerator4: AnalyticsGeneratorComponent;

    @ViewChild('analytics_task_generator')
    analyticsTaskGenerator: AnalyticsGeneratorComponent;

    taskReportParamQuery: ReportQuery = null;
    processReportParamQuery: ReportQuery = null;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private analyticsService: AnalyticsService,
                private tasklistService: ActivitiTaskListService,
                private processlistService: ActivitiProcessService
                ) {

        this.taskReportId = -1;
        this.caseReportId = -1;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let applicationId = params['appId'];
            this.appId = applicationId;
            this.getProcessDefinition(applicationId);
            this.getReports(applicationId);
            this.getDefaultTaskFilter(applicationId);
            this.getDefaultProcessFilter(applicationId);
        });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    getProcessDefinition(appId: string) {
        this.analyticsService.getProcessDefinitionsValues(appId).subscribe(
            (res: any) => {
                this.processDefnitionId = res[res.length - 1].id;
                this.processReportParamQuery = this.getDefaultProcessReportParameters();
            },
            (err: any) => {

            }
        );
    }

    reloadDashboard() {
        if (this.showProcessDashboard) {

            this.processReportParamQuery = this.getDefaultProcessReportParameters();
        }else if (this.showTaskDashboard) {

            this.taskReportParamQuery = this.getDefaultTaskReportParameters();
        }
    }

    getProcessReport() {
        this.analyticsService.getReportByName('Process instances overview').subscribe(
            (res: ReportParametersModel) => {
                if (res === null) {
                    this.caseReportId = -1;
                    return;
                }

                this.caseReportId = res.id;
            },
            (err: any) => {

            }
        );
    }

    getTaskReport() {
        this.analyticsService.getReportByName('Task overview').subscribe(
            (res: ReportParametersModel) => {
                if (res === null) {
                    this.taskReportId = -1;
                    return;
                }

                this.taskReportId = res.id;
            },
            (err: any) => {

            }
        );
    }

    private createDefaultReports(): void {
        this.analyticsService.createDefaultReports().subscribe(
            () => {
                this.analyticsService.getReportList('' + this.appId).subscribe(
                    (response: ReportParametersModel[]) => {
                        if (response !== null) {
                            this.getProcessReport();
                            this.getTaskReport();
                        }
                    }
                );
        });
    }

    private getReports(appId: string): void {
        this.analyticsService.getReportList(appId).subscribe(
            (response: ReportParametersModel[]) => {
                if (response && response.length === 0) {
                    this.createDefaultReports();
                } else {
                    this.getTaskReport();
                    this.getProcessReport();
                }
            },
            (err: any) => {
                this.onError.emit(err);
            }
        );
    }

    getToggleIcon(showFlag: boolean) {
        if (showFlag) {
            return 'expand_less';
        } else {
            return 'expand_more';
        }
    }

    toggleProcessDashboard() {
        if (this.showProcessDashboard) {
            this.showProcessDashboard = false;
        } else {
            this.showProcessDashboard = true;
            this.showTaskDashboard = false;
            this.processReportParamQuery = this.getDefaultProcessReportParameters();
        }
    }

    toggleTaskDashboard() {
        if (this.showTaskDashboard) {
            this.showTaskDashboard = false;
        } else {
            this.showTaskDashboard = true;
            this.showProcessDashboard = false;
            this.taskReportParamQuery = this.getDefaultTaskReportParameters();
        }
    }

    viewAllProcess() {
        let navUrl: string = '/processes/' + this.appId + '/' + this.defaultProcessFilterId;
        this.router.navigateByUrl(navUrl);
    }

    viewAllTask() {
        let navUrl: string = '/tasks/' + this.appId + '/' + this.defaultTaskFilterId;
        this.router.navigateByUrl(navUrl);
    }

    private getDefaultProcessReportParameters(): ReportQuery {
        let reportParamQuery: ReportQuery = new ReportQuery();
        reportParamQuery.processDefinitionId = this.processDefnitionId;
        reportParamQuery.status = 'All';
        reportParamQuery.taskName = null;
        reportParamQuery.dateRangeInterval = null;
        reportParamQuery.typeFiltering = null;
        reportParamQuery.slowProcessInstanceInteger = 10;
        reportParamQuery.duration = null;
        reportParamQuery.dateRange.startDate = '2017-01-01T00:00:00.000Z';
        reportParamQuery.dateRange.endDate = '2017-12-30T00:00:00.000Z';
        return reportParamQuery;
    }

    private getDefaultTaskReportParameters(): ReportQuery {
        let reportParamQuery: ReportQuery = new ReportQuery();
        reportParamQuery.processDefinitionId = this.processDefnitionId;
        reportParamQuery.status = 'All';
        reportParamQuery.taskName = null;
        reportParamQuery.dateRangeInterval = 'byDay';
        reportParamQuery.typeFiltering = null;
        reportParamQuery.slowProcessInstanceInteger = 0;
        reportParamQuery.duration = null;
        reportParamQuery.dateRange.startDate = '2017-01-01T00:00:00.000Z';
        reportParamQuery.dateRange.endDate = '2017-12-30T00:00:00.000Z';
        return reportParamQuery;
    }
    private getDefaultTaskFilter(appId: string) {
        this.tasklistService.getTaskFilterByName('My Tasks', appId).subscribe(
            (res: FilterRepresentationModel) => {
                this.defaultTaskFilterId = res.id.toString();
            }
        );
    }

     private getDefaultProcessFilter(appId: string) {
        this.processlistService.getProcessFilterByName('Running', appId).subscribe(
            (res: FilterProcessRepresentationModel) => {
                this.defaultProcessFilterId = res.id.toString();
            }
        );
    }

    isTaskReportVisible() {
        return (this.taskReportParamQuery && this.taskReportId > 0);
    }

    isProcessReportVisible() {
        return (this.processReportParamQuery && this.caseReportId > 0);
    }

    onReport1Load() {
        this.analyticsProcessGenerator1.selectCurrent(0);
    }

    onReport2Load() {
        this.analyticsProcessGenerator2.selectCurrent(1);
    }

    onReport3Load() {
        this.analyticsProcessGenerator3.selectCurrent(2);
    }

    onReport4Load() {
        this.analyticsProcessGenerator4.selectCurrent(3);
    }
}
