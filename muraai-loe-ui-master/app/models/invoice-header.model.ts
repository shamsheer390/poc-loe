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

export class InvoiceHeaderDetails {

    invoiceNo: string;
    poNumber: number;
    poValue: number;
    totalInvoiceGrossValue: number;
    invoiceDate: string;
    invoiceStatus: string;
    netInvoiceValue: number;
    tax: number;
    currency: string;
    vendor: string;
    grossInvoiceValue: number;
    remainingPoValue: number;
    threeWayMatchingStatus: string;
    tillDateClearedAmountDiscount: number;
    paymentTerms: string;
    amountTobePaid: string;
    line: string;
    material: string;
    materialDesc: string;
    quantity: string;
    rate: string;
    taxPercentage: number;

    constructor() {
        this.invoiceNo = '';
        this.poNumber = 0;
        this.poValue = 0;
        this.totalInvoiceGrossValue = 0;
        this.invoiceDate = '';
        this.invoiceStatus = '';
        this.netInvoiceValue = 0;
        this.tax = 0;
        this.currency = '';
        this.vendor = '';
        this.grossInvoiceValue = 0;
        this.remainingPoValue = 0;
        this.threeWayMatchingStatus = '';
        this.tillDateClearedAmountDiscount = 0;
        this.paymentTerms = '';
        this.amountTobePaid = '';
        this.line = '';
        this.material = '';
        this.materialDesc = '';
        this.quantity = '';
        this.rate = '';
        this.taxPercentage = 0;
    }

}
