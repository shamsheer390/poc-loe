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

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {AlfrescoApiService, LogService} from 'ng2-alfresco-core';
import {BpmUserModel} from '../../../../models/bpm-user.model';
import { MuraaiHttpCoreServices } from '../../../core/muraai-http-core-services';

@Injectable()
export class MenuService {

  constructor(private http: Http,
              private apiService: AlfrescoApiService,
              private logService: LogService, private muraaiHttpCoreServices: MuraaiHttpCoreServices) {

  }

  getMenu(id): Observable<any[]> {
    let url = 'rest/services/getMenuMasterByMenuId?userId=' + id;
    return this.muraaiHttpCoreServices.httpGet(url)
      .map(
        res => {
          return res;
        });
  }

  getCurrentUserInfo(): Observable<BpmUserModel> {
    return Observable.fromPromise(this.apiService.getInstance().activiti.profileApi.getProfile())
      .map((data) => <BpmUserModel> data)
      .catch(err => this.handleError(err));
  }

  private handleError(error: Response) {
    this.logService.error(error);
    return Observable.throw(error || 'Server error');
  }

}
