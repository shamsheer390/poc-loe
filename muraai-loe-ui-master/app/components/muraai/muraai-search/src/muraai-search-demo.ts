import {Component, OnInit} from '@angular/core';
// import {Validators} from '@angular/forms';

@Component({
  selector: 'demo-search',
  templateUrl: './muraai-search-demo.html'
})
export class DemoSearchComponent implements OnInit {
  data: any = [
    {
      label: 'Invoice Number',
      id: 'invoiceNo',
      name: 'invoiceNo',
      type: 'text',
      controlType: 'textbox',
      placeholder: 'Enter invoice number',
      disabled: false,
      validation: [],
      width: 3,
      value: null
    },
    {
      label: 'PO Number',
      id: 'poNumber',
      name: 'poNumber',
      type: 'text',
      controlType: 'textbox',
      placeholder: 'Enter po number',
      disabled: false,
      validation: [],
      width: 3,
      value: null
    },
    {
      label: 'Invoice Status',
      id: 'invoiceStatus',
      name: 'invoiceStatus',
      type: 'select',
      controlType: 'selectbox',
      placeholder: 'Select invoice status',
      options: ['Clarification Provided', 'GL Code and Cost Centre Mapped', 'Invoice Approved', 'Invoice Data Extracted', 'Invoice Rejected'],
      validation: [],
      disabled: false,
      width: 3,
      value: null
    },
    {
      label: 'Vendor',
      id: 'vendor',
      name: 'vendor',
      type: 'text',
      controlType: 'textbox',
      placeholder: 'Enter vendor name',
      disabled: false,
      validation: [],
      width: 3,
      value: null
    },
    {
      label: 'Invoice From Date',
      id: 'invoiceFromDate',
      name: 'invoiceFromDate',
      type: 'date',
      controlType: 'datepicker',
      placeholder: 'Enter from date',
      disabled: false,
      validation: [],
      cssClass: 'mu-inputField',
      width: 3,
      value: null
    },
    {
      label: 'Invoice To Date',
      id: 'invoiceToDate',
      name: 'invoiceToDate',
      type: 'date',
      controlType: 'datepicker',
      placeholder: 'Enter to date',
      disabled: false,
      validation: [],
      width: 3,
      value: null
    },
    {
      label: 'Entity name',
      id: 'entityName',
      name: 'entityName',
      type: 'text',
      controlType: 'textbox',
      placeholder: 'Enter entity name',
      disabled: false,
      validation: [],
      width: 3,
      value: null
    },
    {
      name: 'Search',
      type: 'submit',
      controlType: 'button'
    },
    {
      name: 'Refresh',
      type: 'button',
      controlType: 'button'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  onResponsesearch($event) {
    console.log('output', $event);
  }
}
