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

export class Lable {

lableName: string;
key: any;

lableMetaData: [
   {
      'lableName': 'Invoice No',
      'key': 'invoiceNo'
   },
   {
      'lableName': 'PO Number',
      'key': 'poNumber'
   },
   {
      'lableName': 'PO Value',
      'key': 'poValue'
   },
   {
      'lableName': 'Total Invoice GrossValue',
      'key': 'totalInvoiceGrossValue'
   },
   {
      'lableName': 'Invoice Date',
      'key': 'invoiceDate'
   },
   {
      'lableName': 'Invoice Status',
      'key': 'invoiceStatus'
   },
   {
      'lableName': 'NetInvoice Value',
      'key': 'netInvoiceValue'
   },
   {
      'lableName': 'Tax',
      'key': 'tax'
   },
   {
      'lableName': 'Currency',
      'key': 'currency'
   },
   {
      'lableName': 'Vendor',
      'key': 'vendor'
   },
   {
      'lableName': 'GrossInvoice Value',
      'key': 'grossInvoiceValue'
   },
   {
      'lableName': 'Remaining PoValue',
      'key': 'remainingPoValue'
   },
   {
      'lableName': 'ThreeWayMatching Status',
      'key': 'threeWayMatchingStatus'
   },
   {
      'lableName': 'TillDate Cleared AmountDiscount',
      'key': 'tillDateClearedAmountDiscount'
   },
   {
      'lableName': 'Payment Terms',
      'key': 'paymentTerms'
   },
   {
      'lableName': 'Amount TobePaid',
      'key': 'amountTobePaid'
   },
   {
      'lableName': 'Line',
      'key': 'line'
   },
   {
      'lableName': 'Material',
      'key': 'material'
   },
   {
      'lableName': 'Material Desc',
      'key': 'materialDesc'
   },
   {
      'lableName': 'Quantity',
      'key': 'quantity'
   },
   {
      'lableName': 'Rate',
      'key': 'rate'
   },
   {
      'lableName': 'Tax Percentage',
      'key': 'taxPercentage'
   }
];

constructor() {
    this.key = '';
    this.lableName = '';
}

}
