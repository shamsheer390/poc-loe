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
import { MuraaiConf } from '../components/common/muraai-conf';

@Injectable()
export class DashBoardService {
  constructor(private http: Http) {

  }

  getVenderWiseDetails(): any {
    // return this.http.get(MuraaiConf.API_SOCKET + 'services/chart/vender').map(
    return this.http.get(MuraaiConf.DASHBOARD_CHART_SOCKET + 'services/chart/vender').map(
      res => {
        return res.json();
      }
    );
  }

  getStatusWiseDetails(): any {
    // return this.http.get(MuraaiConf.API_SOCKET + 'services/chart/status').map(
    return this.http.get(MuraaiConf.DASHBOARD_CHART_SOCKET + '/services/chart/status').map(
      res => {
        return res.json();
      }
    );
  }

  getVenderAnnualDetails(): any {
    // return this.http.get(MuraaiConf.API_SOCKET + 'services/chart/annual-invoice/vender').map(
    return this.http.get(MuraaiConf.DASHBOARD_CHART_SOCKET + '/services/chart/annual-invoice/vender').map(
      res => {
        return res.json();
      }
    );
  }

  getVenderMonthlyDetails(venderName: string): any {
    return this.http.get(MuraaiConf.DASHBOARD_CHART_SOCKET + '/services/chart/monthly-invoice/vender?vendorName=' + venderName).map(
      res => {
        return res.json();
      }
    );
  }

  getVenderMonthlyInvoiceDetails(venderName: string, venderMonth: string): any {
    return this.http.get(MuraaiConf.DASHBOARD_CHART_SOCKET + '/services/chart/monthly-invoice/status?vendorName=' + venderName + '&invoiceMonth=' + venderMonth).map(
      res => {
        return res.json();
      }
    );
  }

}
