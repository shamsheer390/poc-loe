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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder }                         from '@angular/forms';
import { FieldDetails }                                   from '../../../../models/mu-field.model';

@Component({
    selector: 'mu-form',
    templateUrl: './mu-form.component.html',
    styleUrls: ['./mu-form.component.scss']
  })
  export class MuraaiFormComponent implements OnInit {
  @Input()
    formData: FieldDetails<any>[] = [];
    form: FormGroup;

    @Output()
    save: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    btnClick: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    valueChange: EventEmitter<any> = new EventEmitter<any>();

    get controls() { return this.formData.filter(({controlType}) => controlType !== 'button'); }
    get changes() { return this.form.valueChanges; }
    get valid() { return this.form.valid; }
    get value() { return this.form.getRawValue(); }

    constructor(private fb: FormBuilder) {}
    ngOnInit() {
      this.form = this.createGroup();
    }

    createGroup(): FormGroup {
      const group = this.fb.group({});
      this.controls.forEach(control => group.addControl(control.name, this.createControl(control)));
      return group;
    }

    createControl(formData: FieldDetails<any>): any {
      const { disabled, validation, value } = formData;
      return this.fb.control({ disabled, value }, validation);
    }

    handleSubmit(event: Event): void {
      event.preventDefault();
      event.stopPropagation();
      this.save.emit(this.value);
    }
    onDataChange($event): void {
      this.valueChange.emit($event);
    }
    onButtonClick(event) {
     this.btnClick.emit(event);
    }
  }
