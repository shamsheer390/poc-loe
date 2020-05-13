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

 import { ModuleWithProviders }  from '@angular/core';
 import { Routes, RouterModule } from '@angular/router';
 import { AuthGuardBpm } from 'ng2-alfresco-core';
 import {
    LoginDemoComponent,
    SettingComponent,
    MyTaskInboxComponent,
    ADFTaskFromComponent,
    DemoComponent,
    MuraaiStatusSpinnerDemoComponent,
    ClientComponent,
    ClientUpload,
    ClientFormComponent,
    MuraaiSignatureDemoComponent,
    ContractEntryComponent,
    LoeUiComponent,
    AuthHandlerComponent,
    MyStartTaskComponent,
    ProcessServiceDashboardComponent,
    DocusignResultCapture
} from './components';
import {DemoSearchComponent} from './components/muraai/muraai-search/src/muraai-search-demo';

 export const appRoutes: Routes = [
     { path: 'login', component: LoginDemoComponent },
     { path: 'settings', component: SettingComponent },
     { path: '', redirectTo: 'ap/tasks', pathMatch: 'full'},
     { path: 'ap/tasks', component: MyTaskInboxComponent, canActivate: [AuthGuardBpm] },
     { path: 'ap/data-entry', component: MyStartTaskComponent, canActivate: [AuthGuardBpm] },
     { path: 'ap/task/:taskId', component: ADFTaskFromComponent, canActivate: [AuthGuardBpm] },
     { path: 'ap/dashboard/:appId', component: ProcessServiceDashboardComponent, canActivate: [AuthGuardBpm] },
     { path: 'ap/search-demo', component: DemoSearchComponent },
     { path: 'ap/form-demo' , component: DemoComponent },
     { path: 'ap/status-spinner-demo', component: MuraaiStatusSpinnerDemoComponent },
     { path: 'ap/client-verfication', component: ClientComponent, canActivate: [AuthGuardBpm] },
     { path: 'ap/client-upload', component: ClientUpload, canActivate: [AuthGuardBpm] },
     { path: 'ap/client-form', component: ClientFormComponent, canActivate: [AuthGuardBpm] },
     { path: 'ap/signature', component: MuraaiSignatureDemoComponent },
     { path: 'ap/start-process', component: ContractEntryComponent },
     { path: 'ap/loe-ui', component: LoeUiComponent },
     { path: 'ap/auth-handler/:taskId/:username/:password', component: AuthHandlerComponent},
     { path: 'ap/sign-result', component: DocusignResultCapture}

 ];

 export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: true});
