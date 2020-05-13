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
import {Http, Response, Headers} from '@angular/http';
import { MuraaiConf } from '../common/muraai-conf';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class MuraaiHttpCoreServices {

  constructor(private http: Http) {}

  public httpGet(url) {
    let headers = new Headers();
    this.createAuthorizationHeader();
    return this.http.get(MuraaiConf.API_SOCKET1 + url, {
      headers: headers
    }).map(
      res => { return res.json();
      }
    ).catch(this.handleError);
  }

  public httpPost(url, data) {
    // let headers = new Headers();
    return this.http.post(MuraaiConf.API_SOCKET1 + url, data, {
      headers: this.createAuthorizationHeader()
    }).map(
      res => { return res.json();
      }
    ).catch(this.handleError);
  }

  public httpPut(url, data) {
    // let headers = new Headers();
    return this.http.put(MuraaiConf.API_SOCKET1 + url, data, {
      headers: this.createAuthorizationHeader()
    }).map(
      res => { return res.json();
      }
    ).catch(this.handleError);
  }

  public httpDelete(url) {
    // let headers = new Headers();
    this.createAuthorizationHeader();
    return this.http.delete(MuraaiConf.API_SOCKET1 + url, {
      headers: this.createAuthorizationHeader()
    }).map(
      res => { return res.json();
      }
    ).catch(this.handleError);
  }
  private handleError(error: Response) {
    return Observable.throw(error || 'Some error occured');
  }

  private createAuthorizationHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
 public httpGetPoc(url) {
    // let headers = new Headers();
    return this.http.get(MuraaiConf.POC_URL + url, {
      headers: this.createAuthorizationHeader()
    }).map(
      res => { return res.json();
      }
    ).catch(this.handleError);
  }
}
