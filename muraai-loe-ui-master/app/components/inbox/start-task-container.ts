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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {
    ActivitiTaskList,
    TaskDetailsEvent,
    ActivitiTaskListService
} from 'ng2-activiti-tasklist';
import {
    ActivitiProcessService
} from 'ng2-activiti-processlist';
import { AnalyticsService} from 'ng2-activiti-analytics';

import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription, Observer} from 'rxjs/Rx';
import {
    ObjectDataTableAdapter,
    ObjectDataRow,
    DataSorting
} from 'ng2-alfresco-datatable';
import {AlfrescoApiService} from 'ng2-alfresco-core';
import {FormService, FormRenderingService, FormEvent, FormFieldEvent} from 'ng2-activiti-form';

import {
    FilterRepresentationModel,
    BreadCrumb
} from '../../models/index';

declare var componentHandler;
declare let dialogPolyfill: any;
declare var document: any;

@Component({
  selector: 'start-task-container',
  templateUrl: './start-task-container.html',
  styleUrls: ['./start-task-container.css'],
  providers: [ActivitiTaskListService]
})
export class StartTaskContainerComponent implements OnInit {

  @ViewChild(ActivitiTaskList)
  activititasklist: ActivitiTaskList;

  @ViewChild('task_full_form_dialog')
  taskFullFormDialog: any;

  @ViewChild('process_full_form_dialog')
  processFullFormDialog: any;

  @Input()
  appId: number = 7007; // appid for POE Process

  layoutType: string;
  currentTaskId: string;

  taskSchemaColumns: any[] = [];
  processSchemaColumns: any[] = [];

  activeTab: string = '';
  initTab: string = '';

  taskFilter: FilterRepresentationModel;
  report: any;

  sub: Subscription;

  dataTasks: ObjectDataTableAdapter;

  showTaskDetails: boolean = false;

  userInfo: any = null;
  profilePicUrl: string = '';
  taskReportId: number;
  caseReportId: number;

  filterNameT: string = 'My Tasks';

  private filterObserverT: Observer<FilterRepresentationModel>;
  filterT$: Observable<FilterRepresentationModel>;
  filtersT: FilterRepresentationModel[] = [];

  crumbs: Array<BreadCrumb> = [];

  selectedAppName: string = '';

  refreshCount: number = 0;

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

      this.dataTasks = new ObjectDataTableAdapter(
          [],
          [
              { type: 'text', key: 'name', title: 'Task', cssClass: 'alf-am-dt-column-4', sortable: true },
              { type: 'date', key: 'created', title: 'Created Date', cssClass: 'alf-am-dt-column-3', sortable: true },
              { type: 'text', key: 'processDefinitionDescription', title: 'Process Name', cssClass: 'alf-am-dt-column-3', sortable: true },
              { type: 'text', key: 'priority', title: 'Priority', cssClass: 'alf-am-dt-column-3', sortable: true }
          ]
      );

      this.dataTasks.setSorting(new DataSorting('created', 'desc'));

      formService.formLoaded.subscribe((e: FormEvent) => {

      });

      formService.formFieldValueChanged.subscribe((e: FormFieldEvent) => {

      });

      this.taskReportId = -1;
      this.caseReportId = -1;

      this.filterT$ = new Observable<FilterRepresentationModel>(observer => this.filterObserverT = observer).share();
  }

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
          let applicationId = params['appId'];
          this.selectedAppName = params['appName'];

          if (applicationId && applicationId !== '0') {
              this.appId = params['appId'];
          }
          this.setTaskColumnsDefault('tasks');
          this.getFiltersByAppIdT(this.appId);

          this.taskFilter = null;
          this.currentTaskId = null;

          this.taskReportId = -1;
          this.caseReportId = -1;

          this.crumbs = [];
          this.crumbs.push(new BreadCrumb('accountspayable', 'Accounts Payable'));
          this.crumbs.push(new BreadCrumb('Invoice Management', 'Invoice Management'));
          this.crumbs.push(new BreadCrumb('tasks', 'Tasks'));

      });

      this.filterT$.subscribe((filter: FilterRepresentationModel) => {
          this.filtersT.push(filter);
      });
  }

  ngOnDestroy() {
      this.sub.unsubscribe();
  }

  onTaskFilterClick(event: FilterRepresentationModel) {
      if (event) {
          this.taskFilter = event;
      }
  }

  onReportClick(event: any) {
      this.report = event;
  }

  onSuccessTaskList(event: FilterRepresentationModel) {
      this.currentTaskId = this.activititasklist.getCurrentId();
  }

  onTaskRowClick(taskId) {
      this.router.navigate(['/ap/task', taskId]);
  }

  openTaskForm() {
      this.showDialog('task');
  }

  onFormCompleted(form) {
      this.activititasklist.reload();
  }

  onTaskCreated(data: any) {
      this.currentTaskId = data.parentTaskId;
      this.activititasklist.reload();
  }

  ngAfterViewInit() {
      // workaround for MDL issues with dynamic components
      if (componentHandler) {
          componentHandler.upgradeAllRegistered();
      }

      this.loadStencilScriptsInPageFromActiviti();
  }

  loadStencilScriptsInPageFromActiviti() {
      this.apiService.getInstance().activiti.scriptFileApi.getControllers().then(response => {
          if (response) {
              let s = document.createElement('script');
              s.type = 'text/javascript';
              s.text = response;
              this.elementRef.nativeElement.appendChild(s);
          }
      });
  }

  onProcessDetailsTaskClick(event: TaskDetailsEvent) {

      event.preventDefault();
      this.activeTab = 'tasks';
      let processTaskDataRow = new ObjectDataRow({
          id: event.value.id,
          name: event.value.name || 'No name',
          created: event.value.created
      });
      this.dataTasks.setRows([processTaskDataRow]);
      this.activititasklist.selectTask(event.value.id);
      this.currentTaskId = event.value.id;
  }

  getFiltersByAppIdT(appId?: number) {
      this.tasklistService.getTaskListFilters(appId.toString()).subscribe(
          (res: FilterRepresentationModel[]) => {
              res.forEach((filter) => {
                  if (this.filterNameT === 'default') {
                      this.filterNameT = 'My Tasks';
                  }
                  if (filter.name === this.filterNameT) {
                      this.taskFilter = filter;
                  }
                  this.filterObserverT.next(filter);
              });
          },
          (err) => {

          }
      );
  }

  getDashboardFlag() {
      return (this.initTab === 'dashboard');
  }

  backFromTaskCreation() {
      this.activeTab = 'tasks';
      this.router.navigateByUrl(this.router.url.replace('new-task;', 'tasks;filter=default;'));
  }

  getTaskListClass() {
      if (this.showTaskDetails) {
          return 'alf-am-tasklist-container';
      } else {
          return 'alf-am-tasklistfull-container';
      }
  }

  closeTaskDetailsLayout() {
      this.showTaskDetails = false;
      this.setTaskColumns();
      if (this.initTab === 'dashboard') {
          this.activeTab = 'dashboard';
      }
  }

  setTaskColumns() {
      if (this.showTaskDetails) {
          this.dataTasks.setColumns([
              { type: 'text', key: 'name', title: 'Task', cssClass: 'alf-am-dt-column-4', sortable: true },
              { type: 'text', key: 'formKey', title: 'Form', cssClass: 'alf-am-dt-column-2', sortable: true }
          ]);
      } else {
          this.dataTasks.setColumns([
              { type: 'text', key: 'name', title: 'Task', cssClass: 'alf-am-dt-column-4', sortable: true },
              { type: 'text', key: 'formKey', title: 'Form', cssClass: 'alf-am-dt-column-3', sortable: true },
              { type: 'text', key: 'assignee.firstName', title: 'Assignee', cssClass: 'alf-am-dt-column-3', sortable: true }
          ]);
      }
  }

  setTaskColumnsDefault(pageId: string) {
      if (pageId === 'dashboard') {
          this.dataTasks.setColumns([
              { type: 'text', key: 'name', title: 'Task', cssClass: 'full-width name-column', sortable: true },
              { type: 'text', key: 'created', title: 'Created', cssClass: 'hidden', sortable: true }
          ]);
      } else {
          this.dataTasks.setColumns([
            { type: 'text', key: 'name', title: 'Task', cssClass: 'alf-am-dt-column-4', sortable: true },
            { type: 'date', key: 'created', title: 'Created Date', cssClass: 'alf-am-dt-column-3', sortable: true },
            { type: 'text', key: 'priority', title: 'Priority', cssClass: 'alf-am-dt-column-3', sortable: true }
          ]);
      }
  }

  public showDialog(type: string) {
      let dialog: any = null;
      if (type === 'task') {
          dialog = this.taskFullFormDialog;
      } else if (type === 'process') {
          dialog = this.processFullFormDialog;
      }
      if (!dialog.nativeElement.showModal) {
          dialogPolyfill.registerDialog(dialog.nativeElement);
      }

      if (dialog) {
          dialog.nativeElement.showModal();
      }
  }

  private closeDialog(type: string) {
      let dialog: any = null;
      if (type === 'task') {
          dialog = this.taskFullFormDialog;
      } else if (type === 'process') {
          dialog = this.processFullFormDialog;
      }

      if (dialog) {
          dialog.nativeElement.close();
      }
  }

  onTaskBackClick() {
      this.closeDialog('task');
  }

  onProcessBackClick() {
      this.closeDialog('process');
  }

  getPageDescription(pageId: string) {
      switch (pageId) {
          case 'dashboard': return 'Dashboard';
          case 'tasks': return 'Tasks';
          case 'processes': return 'Processes';
          case 'reports': return 'Reports';
          case 'new-task': return 'New Task';
          case 'new-case': return 'New Process';
          default: return '';
      }
  }

  navigateToCrumb(crumb: BreadCrumb) {
      let pageName = crumb.getId();
      let crumbType = crumb.getType();
      let urlWoAppId = this.router.url.split(';appId')[0];

      if (crumbType === 'refresh') {
          this.router.navigateByUrl(urlWoAppId + ';refresh=' + (++this.refreshCount));
          return;
      }

      switch (pageName) {
          case 'alfrescoapps':
              this.refreshCount = 0;
              this.router.navigate(['/']);
              break;
          case 'dashboard':
          case 'tasks':
          case 'processes':
          case 'reports':
              let navUrl: string = '/adfpage/' + this.selectedAppName + '/' + pageName + ';filter=default';
              if (navUrl === urlWoAppId) {
                  navUrl += ';refresh=' + (++this.refreshCount);
              } else {
                  this.refreshCount = 0;
              }
              this.router.navigateByUrl(navUrl);
              break;
          default:
              navUrl = '/adfpage/' + this.selectedAppName + '/dashboard;filter=default';
              if (navUrl === urlWoAppId) {
                  navUrl += ';refresh=' + (++this.refreshCount);
              } else {
                  this.refreshCount = 0;
              }
              this.router.navigateByUrl(navUrl);
              break;
      }
  }
}
