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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from './services/client.service';
@Component({
    selector: 'check-form',
    templateUrl: './check-form.component.html',
    providers: [ClientService]
})
export class CheckFormComponent {
    status: boolean = true;
    constructor(public clientService: ClientService,  public  router: Router) {

    }
    checkStatus() {
        if (this.status) {
                this.router.navigate(['/ap/client-upload']);
        }else {
               this.router.navigate(['/ap/client-form']);
        }
    }
}
