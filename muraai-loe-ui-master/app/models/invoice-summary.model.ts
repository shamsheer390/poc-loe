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

export class InvoiceSummaryDetails {
  invoiceNo: number;
  type: string;
  invoiceDate: string;
  venderName: string;
  venderCode: number;
  poNumber: string;
  value: string;
  tax: string;
  pendingWith: string;
  status: boolean;
  errorDescription: boolean;
  appTheme: string;
  entityCode: string;
  entityName: string;

  constructor() {
    this.invoiceNo = 0;
    this.type = '';
    this.invoiceDate = '';
    this.venderName = '';
    this.venderCode = 0;
    this.poNumber = '';
    this.value = '';
    this.status = false;
    this.errorDescription = false;
    this.entityCode = '';
    this.entityName = '';

  }

}
