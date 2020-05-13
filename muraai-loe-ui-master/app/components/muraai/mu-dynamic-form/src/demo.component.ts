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

import { Component, ViewChild } from '@angular/core';
import { FieldDetails }         from '../../../../models/mu-field.model';
import { Validators }           from '@angular/forms';
import { MuraaiFormComponent }  from './mu-form.component';

@Component({
    selector: 'form-demo',
    templateUrl: './demo.component.html',
    styleUrls: ['./demo.component.scss']
  })
  export class DemoComponent {
    @ViewChild(MuraaiFormComponent) form: MuraaiFormComponent;

    formData: FieldDetails<any>[] = [
      {
        label: 'Invoice Number' ,
        id: 'invoiceNumber',
        name: 'invoiceNumber',
        type: 'text',
        controlType: 'textbox',
        placeholder: 'Enter invoice number',
        disabled: false,
        validation: [Validators.required],
        cssClass: 'mu-inputField',
        width: 3
      },
      {
        label: 'Invoice Status' ,
        id: 'invoiceStatus',
        name: 'invoiceStatus',
        value: 'invoiceStatus',
        type: 'select',
        controlType: 'selectbox',
        placeholder: 'Select invoice status',
        options: ['Clarification Provided', 'GL Code and Cost Centre Mapped', 'Invoice Approved', 'Invoice Data Extracted', 'Invoice Rejected'],
        validation: [],
        disabled: false,
        cssClass: 'mu-selectField',
        width: 3
      },
      {
        label: 'Vendor Name' ,
        id: 'vendorName',
        name: 'vendorName',
        type: 'text',
        controlType: 'textbox',
        placeholder: 'Enter vendor name',
        disabled: false,
        validation: [Validators.required],
        cssClass: 'mu-inputField',
        width: 3
      },
      {
        label: 'Invoice From Date' ,
        id: 'fromDate',
        name: 'fromDate',
        type: 'date',
        controlType: 'datepicker',
        placeholder: 'Enter from date',
        disabled: false,
        validation: [],
        cssClass: 'mu-inputField',
        width: 3
      },
      {
        label: 'Comment' ,
        id: 'coment',
        name: 'comment',
        type: 'textarea',
        controlType: 'textarea',
        placeholder: 'Type some comment',
        disabled: false,
        validation: [],
        cssClass: 'mu-inputField',
        width: 3
      },
      {
        name: 'Save',
        type: 'submit',
        controlType: 'button'
      },
      {
        name: 'Reset',
        type: 'button',
        controlType: 'button'
      }
    ];
    submit(value: {[name: string]: any}) {
      console.log(value);
    }
    onDataChange($event) {
      console.log($event);
    }
  }
