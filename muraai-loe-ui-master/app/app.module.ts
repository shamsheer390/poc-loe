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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import { CoreModule } from 'ng2-alfresco-core';
import { LoginModule } from 'ng2-alfresco-login';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiFormModule } from 'ng2-activiti-form';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { ActivitiProcessListModule } from 'ng2-activiti-processlist';
import { UserInfoComponentModule } from 'ng2-alfresco-userinfo';
import { DiagramsModule } from 'ng2-activiti-diagrams';
import { AnalyticsModule } from 'ng2-activiti-analytics';
import { UploadModule } from 'ng2-alfresco-upload';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import {MdlModule} from 'angular2-mdl';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { ToastModule}  from 'ng2-toastr';
import { SignaturePadModule } from 'angular2-signaturepad';

import {
  LoginDemoComponent,
  // ActivitiDemoComponent,
  SettingComponent,
  AppsMenuComponent,
  BreadCrumbsComponent,
  ADFTaskFromComponent,
  ADFTaskHeader,
  ADFTaskDetails,
  ADFProcessComments,
  ADFStartTaskComponent,
  ADFDateWidget,
  MyTaskInboxComponent,
  TaskApprovalButtonListComponent,
  MuraaiDialogComponent,
  MuraaiDataTableComponent,
  DemoComponent,
  MuraaiFormComponent,
  MuraaiFieldComponent,
  MuraaiStatusSpinnerComponent,
  MuraaiStatusSpinnerDemoComponent,
  UserProfileComponent,
  ClientComponent,
  ClientUpload,
  ClientFormComponent,
  MuraaiSignatureComponent,
  MuraaiSignatureDemoComponent,
  ContractEntryComponent,
  LoeUiComponent,
  AuthHandlerComponent,
  MyStartTaskComponent,
  ProcessServiceDashboardComponent,
  DocusignResultCapture,
  CreateAttachmentComponent
} from './components';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { MuraaiHttpCoreServices } from './components/core/muraai-http-core-services';
import {MuraaiSearchComponent} from './components/muraai/muraai-search/src/muraai-search.component';
import {DemoSearchComponent} from './components/muraai/muraai-search/src/muraai-search-demo';
let appConfigFile = './../app.config-dev.json';
if (process.env.ENV === 'production') {
    appConfigFile = './../app.config-prod.json';
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    CoreModule.forRoot({
            appConfigFile: appConfigFile
      }),
    LoginModule,
    UploadModule,
    ActivitiFormModule.forRoot(),
    ActivitiTaskListModule.forRoot(),
    ActivitiProcessListModule.forRoot(),
    UserInfoComponentModule.forRoot(),
    DiagramsModule.forRoot(),
    AnalyticsModule.forRoot(),
    DocumentListModule.forRoot(),
    ViewerModule.forRoot(),
    DataTableModule,
    ChartsModule,
    MdlModule,
    MaterialModule,
    ToastModule.forRoot(),
    MdNativeDateModule,
    SignaturePadModule
  ],
  declarations: [
    AppComponent,
    LoginDemoComponent,
    // ActivitiDemoComponent,
    SettingComponent,
    AppsMenuComponent,
    BreadCrumbsComponent,
    ADFTaskFromComponent,
    ADFTaskHeader,
    ADFTaskDetails,
    ADFProcessComments,
    ADFStartTaskComponent,
    ADFDateWidget,
    MyTaskInboxComponent,
    TaskApprovalButtonListComponent,
    MuraaiDialogComponent,
    MuraaiDataTableComponent,
    DemoComponent,
    MuraaiFormComponent,
    MuraaiFieldComponent,
    MuraaiSearchComponent,
    DemoSearchComponent,
    MuraaiStatusSpinnerComponent,
    MuraaiStatusSpinnerDemoComponent,
    UserProfileComponent,
    ClientComponent,
    ClientUpload,
    ClientFormComponent,
    MuraaiSignatureComponent,
    MuraaiSignatureDemoComponent,
    ContractEntryComponent,
    LoeUiComponent,
    AuthHandlerComponent,
    MyStartTaskComponent,
    ProcessServiceDashboardComponent,
    DocusignResultCapture,
    CreateAttachmentComponent
  ],
  entryComponents: [MuraaiDialogComponent],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, MuraaiHttpCoreServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
