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

import {Injectable, EventEmitter, Output} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { MuraaiConf } from '../components/common/muraai-conf';

@Injectable()
export class InvoiceSummaryService {

  @Output()
  dataLimit: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: Http) {

  }
  getInvoiceHeaderByInvoiceHeaderId( headerId: number): any {
    return this.http.get(MuraaiConf.API_SOCKET1 +  'rest/services/getInvoiceHeaderByInvoiceHeaderId?invoiceHeaderId=' + headerId).map(
      res => {
        console.log(res);
        return res;
      }
    );
  }

  getInvoiceSummarySearch(serchObj: any): any {
    const body = JSON.stringify(serchObj);
    return this.http.post(MuraaiConf.API_SOCKET1 + 'rest/services/searchInvoices', body, {
      headers: this.createAuthorizationHeader()
    }).map(
      res => { return res.json(); }
    );
  }

  getInvoiceHeader(requestObj: any): any {
    const body = JSON.stringify(requestObj);
    return this.http.post(MuraaiConf.API_SOCKET + 'services/invoice-header', body, {
      headers: this.createAuthorizationHeader()
    }).map(
      (data: Response) => data.json);
  }

  private createAuthorizationHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getInvoiceDetail(invoiceNumber: number): any {
    return this.http.get(MuraaiConf.API_SOCKET + 'services/invoice-by-invoiceno?invoiceNo=' + invoiceNumber).map(
      res => {
        return res.json();
      }
    );
  }

  getInvoiceDetailByInvoiceNo(invoiceNumber: number): any {
    return this.http.get(MuraaiConf.API_SOCKET + '/services/invoice-detail-by-invno?invoiceNo=' + invoiceNumber).map(
      res => {
        return res.json();
      }
    );
  }

  getThreeWayDetailsByInvoiceNo(invoiceNumber: number): any {
    return this.http.get(MuraaiConf.API_SOCKET + '/services/invoice-threeWayMatching?invoiceNo=' + invoiceNumber).map(
      res => {
        return res.json();
      }
    );
  }

  getAllInvoiceBankDetailsByInvoiceNo(invoiceNumber: number): any {
    return this.http.get(MuraaiConf.API_SOCKET + '/services/invoice-bank-detail?invoiceNo=' + invoiceNumber).map(
      res => {
        return res.json();
      }
    );
  }

  getInvoiceBankDetailsByInvoiceNo(invoiceNumber: number, offset: number, limit: number): any {
    return this.http.get(MuraaiConf.API_SOCKET + '/services/paginated-bank-detail?invoiceNo=' + invoiceNumber + '&pageNo=' + offset + '&pageSize=' + limit).map(
      res => {
        return res.json();
      }
    );
  }

  getVenderBankDetailsByInvoiceNo(invoiceNumber: number): any {
    return this.http.get(MuraaiConf.API_SOCKET + '/services/vendor-bank-detail?vendorCode=' + invoiceNumber).map(
      res => {
        return res.json();
      }
    );
  }

}
