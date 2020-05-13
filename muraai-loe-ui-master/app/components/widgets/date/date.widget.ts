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

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { WidgetComponent } from '../widget.component';
import * as moment from 'moment';

declare let mdDateTimePicker: any;

@Component({
    moduleId: module.id.toString(),
    selector: 'adf-date-widget',
    templateUrl: './date.widget.html',
    styleUrls: ['./date.widget.css']
})
export class ADFDateWidget extends WidgetComponent {

    @ViewChild('startElement')
    startElement: any;

    @Input()
    labelText: string;

    @Input()
    dateFormat: string;

    @Input()
    selectedDate: string;

    @Output()
    dateChanged: EventEmitter<any> = new EventEmitter<any>();

    debug: boolean = false;

    dialogStart: any;

    constructor(public elementRef: ElementRef) {
        super();
    }

    ngOnInit() {
        this.setDefaultValues();
        this.initForm();
        this.addAccessibilityLabelToDatePicker();
    }

    initForm() {
        let startDate = this.convertToMomentDate(this.selectedDate);

        this.initSartDateDialog(startDate);
    }

    initSartDateDialog(date: string) {
        let settings: any = {
            type: 'date',
            past: moment().subtract(100, 'years'),
            future: moment().add(100, 'years')
        };

        settings.init = moment(date, this.dateFormat);

        this.dialogStart = new mdDateTimePicker.default(settings);
        this.dialogStart.trigger = this.startElement.nativeElement;
    }

    toggleDatePicher() {
        this.dialogStart.toggle();
    }

    private addAccessibilityLabelToDatePicker() {
        let left: any = document.querySelector('#mddtp-date__left');
        if (left) {
            left.appendChild(this.createCustomElement('date left'));
        }

        let right: any = document.querySelector('#mddtp-date__right');
        if (right) {
            right.appendChild(this.createCustomElement('date right'));
        }

        let cancel: any = document.querySelector('#mddtp-date__cancel');
        if (cancel) {
            cancel.appendChild(this.createCustomElement('date cancel'));
        }

        let ok: any = document.querySelector('#mddtp-date__ok');
        if (ok) {
            ok.appendChild(this.createCustomElement('date ok'));
        }
    }

    private createCustomElement(text: string): HTMLElement {
        let span = document.createElement('span');
        span.style.visibility = 'hidden';
        let rightSpanText = document.createTextNode(text);
        span.appendChild(rightSpanText);
        return span;
    }

    onOkStart(inputEl: HTMLInputElement) {
        let date = this.dialogStart.time.format(this.dateFormat);
        let materialElemen: any = inputEl.parentElement;
        if (materialElemen) {
            materialElemen.MaterialTextfield.change(date);
            this.dateChanged.emit(date);
        }
    }

    public convertToMomentDateWithTime(date: string) {
        return moment(date, this.dateFormat, true).format(this.dateFormat) + 'T00:00:00.000Z';
    }

    private convertToMomentDate(date: string) {
        if (date) {
            return moment(date).format(this.dateFormat);
        } else {
            return moment().format(this.dateFormat);
        }
    }

    ngOnDestroy() {

    }

    setDefaultValues() {
        if (this.labelText === undefined || this.labelText === null || this.labelText === '') {
            this.labelText = 'Date';
        }

        if (this.dateFormat === undefined || this.dateFormat === null || this.dateFormat === '') {
            this.dateFormat = 'YYYY-MM-DD';
        }

        if (this.selectedDate === undefined || this.selectedDate === null || this.selectedDate === '') {
            this.selectedDate = moment(new Date()).format(this.dateFormat);
        }
    }
}
