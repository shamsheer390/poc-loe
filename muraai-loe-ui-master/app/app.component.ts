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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import {
  AlfrescoTranslationService, AlfrescoAuthenticationService,
  AlfrescoSettingsService, StorageService, LogService,
  AlfrescoApiService
} from 'ng2-alfresco-core';
import {
  ActivitiTaskListService,
  AppDefinitionRepresentationModel
} from 'ng2-activiti-tasklist';

declare var document: any;

@Component({
  selector: 'alfresco-app',
  templateUrl: './app.component.html',
  styleUrls: ['../styles/_theming.scss', './app.component.scss'],
  providers: [ActivitiTaskListService],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  sub: Subscription;

  bpmHost: string = 'http://' + window.location.hostname + ':' + window.location.port + '/';
  ecmHost: string = 'http://' + window.location.hostname + ':' + window.location.port + '/';

  profilePicUrl: string;
  previousRouterUrl: string = '';

  menuExpanded: boolean = false;
  selectedAppName: string;
  showHeader: boolean = true;
  showMenu: boolean = false;
  showLogo: boolean = true;

  userFirstName: string = null;
  userLastName: string = null;
  crumbs = [];
  dynamicComponentObj: any;
  appList: AppDefinitionRepresentationModel[] = [];

  constructor(private authService: AlfrescoAuthenticationService, private router: Router,
              private route: ActivatedRoute,
              private settingsService: AlfrescoSettingsService,
              private translateService: AlfrescoTranslationService,
              private storage: StorageService,
              private logService: LogService,
              private alfrescoJsApi: AlfrescoApiService,
              private activitiTaskListService: ActivitiTaskListService) {
    localStorage.setItem('user_role', '');
    localStorage.setItem('providers', 'BPM');
    this.showMenu = this.getShowMenu();
    this.setBpmHost();
    this.setEcmHost();
    this.setProvider();

    if (translateService) {
      // process.env.ENV === 'production'
    }
  }

  ngOnInit() {
    if (localStorage.getItem('bpmHost') !== null || localStorage.getItem('bpmHost') !== undefined) {
      localStorage.setItem('bpmHost', this.bpmHost);
    }
    if (localStorage.getItem('ecmHost') !== null || localStorage.getItem('ecmHost') !== undefined) {
      localStorage.setItem('ecmHost', this.ecmHost);
    }
    this.load();
    this.createBreadCrumb();
  }

  isLoggedIn(): boolean {
    this.redirectToLoginPageIfNotLoggedIn();
    return this.authService.isLoggedIn();
  }

  redirectToLoginPageIfNotLoggedIn(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    this.authService.logout()
      .subscribe(
      () => {
        localStorage.setItem('user_role', '');
        localStorage.setItem('showMenu', 'false');
        this.profilePicUrl = '';
        this.navigateToLogin();
      },
      (error: any) => {
        if (error && error.response && error.response.status === 401) {
          this.navigateToLogin();
        } else {
          this.logService.error('An unknown error occurred while logging out', error);
          this.navigateToLogin();
        }
      }
      );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang);
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

  getBpmUserInfo(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    (Observable.fromPromise(this.alfrescoJsApi.getInstance().activiti.profileApi.getProfile())
      .map((data) => data).catch(this.handleError)).subscribe((userResp) => {
        localStorage.setItem('user_role', 'user');
        localStorage.setItem('showMenu', 'true');
        this.showMenu = true;
        this.userFirstName = userResp.firstName;
        this.userLastName = userResp.lastName;
      });
  }

  private handleError(error: Response) {
    return Observable.throw(error || 'Server error');
  }

  toggleMenu() {
    this.menuExpanded = !this.menuExpanded;
  }

  getMenuCollapseClass() {
    if (!this.menuExpanded) {
      return 'alf-menu-collapse';
    }
  }

  getHeaderExpandClass() {

    let className = '';
    if (!this.menuExpanded) {
      className += 'alf-main-expand';
    }

    if (!this.showMenu) {
      className += ' alf-womenu-full-view';
    }

    if (!this.showHeader) {
      className += ' alf-router-full-view';
    }

    return className;
  }

  getMainContainerExpandClass() {

    let className = '';
    if (!this.menuExpanded) {
      className += 'alf-main-expand';
    }

    if (!this.showMenu) {
      className += ' alf-womenu-full-view';
    }

    if (!this.showHeader) {
      className += ' alf-router-full-view';
    }

    return className;
  }

  getToggleMenuIcon() {
    if (this.menuExpanded) {
      return 'chevron_left';
    } else {
      return 'chevron_right';
    }
  }

  onMenuSelection(menuItem: any) {
    console.log(menuItem);
    if (menuItem === 'dashboard') {
      this.router.navigate(['/ap/' + menuItem + '/' + 7007 ]);
    } else {
      this.router.navigate(['/ap/' + menuItem]);
    }
  }

  onUserMenuSelect(menuName: string) {
    if (menuName === 'sign_out') {
      this.onLogout();
    }
  }

  private load() {
    this.appList = [];
    if (!this.authService.isLoggedIn()) {
      this.router.events.filter(event => event instanceof NavigationStart).subscribe(path => {
        if (this.previousRouterUrl === '/login' && path['url'] === '/') {
          this.activitiTaskListService.getDeployedApplications().subscribe(
            (res) => {
              this.appList.push(...res);
            },
            (err) => {
            }
          );
        }
        this.callRouterHandler(path);
      });
      return;
    } else {
      this.activitiTaskListService.getDeployedApplications().subscribe(
        (res) => {
          this.appList.push(...res);
          this.callRouterHandler(this.router);
          this.router.events.filter(event => event instanceof NavigationStart).subscribe(path => {
            this.callRouterHandler(path);
          });
        },
        (err) => {
        }
      );
    }
  }

  getAppId(appName: string): number {
    if (appName === undefined) {
      return -1;
    }
    let appObj = this.appList.find((app: AppDefinitionRepresentationModel) => {
      if (app.name === appName) {
        return true;
      }
    });
    return ((appObj === undefined) ? -1 : appObj.id);
  }

  callRouterHandler(path: any) {

    if (!this.authService.isLoggedIn() && path.url.indexOf('/login') === -1) {
      return;
    }
    this.selectedAppName = null;
    this.showHeader = true;
    if (path.url.indexOf('/login') >= 0 || path.url.indexOf('/settings') >= 0) {
      this.showHeader = false;
      this.menuExpanded = false;
      this.showMenu = false;
    }

    this.showLogo = true;

    if ((path.url === '/' && path.url !== this.previousRouterUrl)
      || ((path.url.indexOf('/adfpage/') >= 0 || path.url.indexOf('/adf/') >= 0) && this.previousRouterUrl === '')
      || (path.url !== this.previousRouterUrl)) {
      this.profilePicUrl = localStorage.getItem('bpmHost') + '/activiti-app/app/rest/admin/profile-picture';
      this.getBpmUserInfo();
    }
    this.previousRouterUrl = path.url;
  }

  private createBreadCrumb() {
    this.router.events.subscribe(
      x1 => {
        if (x1 instanceof NavigationEnd) {
          this.onBreadCrumb(x1.urlAfterRedirects);
        }
      });
  }

  private onBreadCrumb(url) {
    this.crumbs = [];
    let x = url.split('/');
    for (let i = 0, k = 0; i < x.length; i++) {
      if (x[2] === 'invoice-summary' && x.length > 3) {
        if (i === 3) {
          this.crumbs.push({ 'id': x[i], 'name': x[i], 'position': k++, 'show': false });
          i++;
        }
      }
      if (x[i] !== '') {
        if (x[i] === 'invoice-details') {
          this.crumbs.push({ 'id': x[i], 'name': 'Invoice Summary', 'position': k++, 'show': true });
        } else if (x[i] === 'ap') {
          this.crumbs.push({ 'id': x[i], 'name': 'LOE', 'position': k++, 'show': true });
        } else {
          this.crumbs.push({ 'id': x[i], 'name': this.onReplaceHyphen(x[i]), 'position': k++, 'show': true });
        }
      }
    }
  }

  private onReplaceHyphen(str): string {
    let splitStr = str.toLowerCase().split('-');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  public onChangeBreadsCrumb($event): void {
    let droute = '';
    for (let i = 0; i <= $event.position; i++) {
      droute += this.crumbs[i].id + '/';
    }
    if ($event.name === 'Task') {
      droute = 'ap/tasks/';
    } else if ($event.name === 'LOE') {
      droute += 'client';
    }
    this.router.navigate([droute]);
  }

  public onClickToRefresh($event): void {
    this.dynamicComponentObj.ngOnInit();
  }

  public onRefreshCrum($event): void {
    this.dynamicComponentObj = $event;
  }
}
