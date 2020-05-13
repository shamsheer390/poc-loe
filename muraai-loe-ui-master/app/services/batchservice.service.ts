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
import {Http , Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { MuraaiConf } from '../components/common/muraai-conf';

@Injectable()
export class BatchserviceService {

  constructor(private http: Http) {
  }

  private createAuthorizationHeader() {
      // ZXBoZXNvZnQ6ZGVtbw== is btoa form of username and password
    return   new Headers({'Authorization': 'Basic ZXBoZXNvZnQ6ZGVtbw=='});
  }

  getbatchbystatus(status: string): any {
    return this.http.get( MuraaiConf.EPSOFTSERVICE_SOCKET + status, { headers: this.createAuthorizationHeader()})
        .map(
            res => {
              return res.json();
            }
        );

  }

  getAllActiveBatch(): Observable<any[]> {
      return this.http.get( MuraaiConf.EPSOFTSERVICE_SOCKET + '/status/active' , { headers: this.createAuthorizationHeader() })
        .map(
          res => {
              return res.json();
          }
      );
  }

}
