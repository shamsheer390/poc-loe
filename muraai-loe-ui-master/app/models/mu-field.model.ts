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

import { ValidatorFn } from '@angular/forms';

 export class FieldDetails<T> {

    label?: string;
    id?: string;
    name: string;
    value?: any;
    type: string;
    controlType: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: any;
    validation?: ValidatorFn[];
    defaultValue?: any;
    cssClass?: any;
    width?: any;
    visibility?: boolean;
}
