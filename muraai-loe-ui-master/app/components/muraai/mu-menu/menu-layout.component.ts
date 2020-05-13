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

import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import {Observer, Observable} from 'rxjs/Rx';

import {ActivitiTaskListService} from 'ng2-activiti-tasklist';
import {ActivitiProcessService} from 'ng2-activiti-processlist';
import {AnalyticsService} from 'ng2-activiti-analytics';

import {FilterRepresentationModel} from '../../../models/task-filter.model';
import {MenuService} from './services/menu.service';
import {Router, NavigationEnd} from '@angular/router';

declare var document: any;

@Component({
  selector: 'alfresco-side-menu',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss'],
  providers: [MenuService]
})
export class AppsMenuComponent implements OnInit {

  @Input()
  appId: number = null;
  @Input()
  expand: boolean = true;

  @Output()
  onMenuSelection: EventEmitter<any> = new EventEmitter<any>();

  taskMenuData: Array<any>;
  taskMenuBackup: Array<any>;

  private filterObserverT: Observer<FilterRepresentationModel>;
  filterT$: Observable<FilterRepresentationModel>;
  filtersT: Array<FilterRepresentationModel> = [];

  report$: Observable<any>;

  selectedMenuId: any = null;
  selectedSubMenuId: any = null;
  routingAddress: any;

  constructor(private analyticsService: AnalyticsService,
              private tasklistService: ActivitiTaskListService,
              private processlistService: ActivitiProcessService,
              private menuservice: MenuService,
              private router: Router) {

    this.filterT$ = new Observable<FilterRepresentationModel>(observer => this.filterObserverT = observer).share();
    this.routingAddress = this.router.url;
  }

  ngOnInit() {
    this.onMenuResponse();
    this.onMenuSelectionFromRouter();
    this.filterT$.subscribe((filter: FilterRepresentationModel) => {
      this.filtersT.push(filter);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let appId = changes['appId'];
    if (appId && (appId.currentValue) && appId.currentValue >= 0) {
      this.getFiltersByAppIdT();
      return;
    }
  }

  setTaskMenuData(data) {
    this.taskMenuData = data;
  }

  getFiltersByAppIdT() {
    this.filtersT.length = 0;
    this.tasklistService.getTaskListFilters(this.appId.toString()).subscribe(
      (res: FilterRepresentationModel[]) => {
        res.forEach((filter) => {
          this.filterObserverT.next(filter);
        });
      },
      (err) => {
      }
    );
  }

  public toggleSubMenu(menuHead: any): void {
    menuHead.subListExpanded = !menuHead.subListExpanded;
  }

  getExpandSubMenuIcon(subListExpanded: boolean) {
    if (subListExpanded) {
      return 'expand_less';
    } else {
      return 'expand_more';
    }
  }

  public onSubMenuClick(subMenuItem: any): void {
    this.onMenuSelection.emit(subMenuItem);
  }

  public onMenuClick(menuHead: any): void {
    this.onMenuSelection.emit(menuHead);
  }

  private onMenuResponse(): void {
    this.menuservice.getCurrentUserInfo().subscribe(
      (x) => {
        this.getParticularUserMenu(x.id);
      },
      (err) => {
      }
    );

  }

  private getParticularUserMenu(id): void {
    this.menuservice.getMenu(id).subscribe(
      (res) => {
        this.HandleResponse(res);
      },
      (err) => {
        console.log('error', err);
      });
  }

  private HandleResponse(data) {
    let parent: any;
    let child: any;
    parent = this.createParent(data);
    child = this.addChild(parent, data);
    this.setTaskMenuData(child);
    this.taskMenuBackup = child;
  }

  private createId(id: string): string {
    let route = id.toString();
    route = route.toLowerCase();
    route = route.trim();
    route = route.replace(/\s/g, '-');
    return route;
  }

  private createParent(data): any {
    let p = [];
    data.forEach(x => {
      if (x.parentId === null) {
        p.push({
          'id': this.createId(x.menuDesc),
          'pid': x.menuId,
          'name': x.menuDesc,
          'icon': x.icon,
          subListExpanded: false,
          subList: []
        });
      }
    });
    return p;
  }

  private getParentId(parent, id): number {
    let x1 = 0;
    let count = 0;
    parent.forEach(x => {
      count++;
      if (x.pid === id) {
        x1 = count;
      }
    });
    return ( x1 - 1 );
  }

  private addChild(parent, data): any {
    data.forEach(x1 => {
      if (x1.parentId !== null) {
        let x = this.getParentId(parent, x1.parentId);
        if (x !== -1) {
          parent[x].subList.push({'id': this.createId(x1.menuDesc), 'name': x1.menuDesc});
        }
      }
    });
    return parent;
  }

  private searchJson(data, query): any {
    const queryReg = new RegExp(query, 'i');
    let result = [];
    data.forEach(item => {
      const parentMatch = queryReg.test(item.name);
      let subMatch = false;
      if (item.subList) {
        let subResult = this.searchJson(item.subList, query);
        subMatch = subResult.length > 0;
        item.subList = subMatch ? subResult : [];
      }
      if (parentMatch || subMatch) {
        result.push(item);
      }

    });

    return result;
  }

  private search(input, query): any {
    let result;
    result = this.searchJson(JSON.parse(JSON.stringify(input)), query);
    return result.length === 0 ? [] : result;
  }

  private manualToggleSubmenu(result): void {
    for (let i = 0; i < result.length; i++) {
      if (result[i].subList.length > 0) {
        result[i].subListExpanded = false;
        this.toggleSubMenu(result[i]);
      }
    }
  }

  public onSearchMenu(value): void {
    if (value !== '') {
      let result = this.search(this.taskMenuBackup, value);
      if (result.length > 0) {
        this.taskMenuData = result;
        this.manualToggleSubmenu(result);
      }
      if (result.length === 0) {
        this.taskMenuData = [];
      }
    } else {
      this.onResetMenu();
    }
  }

  public onResetMenu(): void {
    this.taskMenuData = this.taskMenuBackup;
  }

  private onMenuSelectionFromRouter() {
    this.router.events.subscribe(
      x1 => {
        if ( x1 instanceof NavigationEnd  ) {
          this.routingAddress = x1.urlAfterRedirects;
        }
      });
  }

  public setBackgroundColor(d): boolean {
    if (this.routingAddress.search(d.id) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
