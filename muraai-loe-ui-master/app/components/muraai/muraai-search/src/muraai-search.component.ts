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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AlfrescoTranslationService} from 'ng2-alfresco-core';
import {FieldDetails} from '../../../../models/mu-field.model';

@Component({
  selector: 'muraai-search-new',
  styleUrls: ['./muraai-search.component.scss'],
  templateUrl: './muraai-search.component.html'
})
export class MuraaiSearchComponent implements OnInit {

  @Input('fields') formData: FieldDetails<any>[];

  @Input('placeholder') name: string;

  @Output()
  onSearchResponse: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  refresh: EventEmitter<any> = new EventEmitter<any>();

  openAdvanceSearch: boolean;
  icon: string;

  constructor(private translateService: AlfrescoTranslationService) {
    if (translateService) {
      translateService.addTranslationFolder('muraai-search', '/custom-translation/muraai-search');
    }
    this.openAdvanceSearch = false;
    this.icon = 'keyboard_arrow_down';
  };

  ngOnInit() {
    this.name = this.name !== undefined && this.name !== '' ? this.name : 'Search';
  }

  public toggleAdvanceSearch(): void {
    this.openAdvanceSearch = !this.openAdvanceSearch;
    if ( this.openAdvanceSearch === false) {
      this.icon = 'keyboard_arrow_down';
    } else {
      this.icon = 'keyboard_arrow_up';
    }
  }

  public closeAdvanceSearch(): void {
    this.openAdvanceSearch = false;
    this.icon = 'keyboard_arrow_down';
  }

  public submit(value: { [name: string]: any }): void {
    this.onSearchResponse.emit(value);
    this.closeAdvanceSearch();
  }

  public onSearch(data): void {
    this.onSearchResponse.emit(data);
  }
  public onBtnClicked (event): void {
    this.refresh.emit(event);
  }
}
