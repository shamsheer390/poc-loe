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

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { AlfrescoSettingsService, StorageService } from 'ng2-alfresco-core';

@Component({
  selector: 'auth-handler',
  moduleId: module.id.toString(),
  templateUrl: 'auth-handler.component.html'
})
export class AuthHandlerComponent {
    loggedin: boolean;
    password: any;
    username: any;
    taskId: any;
    showMenu: boolean = false;
    authenticated: boolean;

    ecmHost: string = 'http://localhost:9999/ecm/';
    bpmHost: string = 'http://localhost:9999/bpm/';

    ticket: string;

  constructor(private authService: AlfrescoAuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private settingsService: AlfrescoSettingsService,
              private storage: StorageService) {

    localStorage.setItem('user_role', '');
    localStorage.setItem('providers', 'BPM');
    this.showMenu = this.getShowMenu();
    this.setBpmHost();
    this.setEcmHost();
    this.setProvider();
  }
  ngOnInit() {
   this.getUrl();
   this.login();
  }

  private getUrl(): void {
    this.route.params.subscribe(params => {
    if (params['taskId'] !== undefined) {
      this.taskId = params['taskId'];
      this.username = atob(params['username']);
      this.password = atob(params['password']);
      console.log(this.username + '&' + this.password);
    }
    });
  }

  private getShowMenu() {
    let _showMenu = localStorage.getItem('showMenu');
    return _showMenu === 'true';
  }

  private setBpmHost() {
    if (this.storage.hasItem(`bpmHost`)) {
      this.settingsService.bpmHost = this.storage.getItem(`bpmHost`);
      this.bpmHost = this.storage.getItem(`bpmHost`);
    } else {
      this.settingsService.bpmHost = this.bpmHost;
    }
  }

  private setEcmHost() {
    if (this.storage.hasItem(`ecmHost`)) {
      this.settingsService.ecmHost = this.storage.getItem(`ecmHost`);
      this.ecmHost = this.storage.getItem(`ecmHost`);
    } else {
      this.settingsService.ecmHost = this.ecmHost;
    }
  }

  private setProvider() {
    if (this.storage.hasItem(`providers`)) {
      this.settingsService.setProviders(this.storage.getItem(`providers`));
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
        ticket => {
            console.log(ticket);
            this.ticket = this.authService.getTicketBpm();
            this.authenticated = true;
            this.storage.setItem('loginEmail', JSON.stringify(this.username));
            this.router.navigate(['ap/task/' + this.taskId]);
        },
        error => {
            console.log(error);
            this.authenticated = false;
        });
}
}
