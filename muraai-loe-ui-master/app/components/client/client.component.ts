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

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {ClientService} from './services/client.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
    selector: 'client-details',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    providers: [ClientService]
})
export class ClientComponent implements OnInit {
    public myForm: FormGroup;
    client: any = {};
    status: boolean = true;
    isTemplateGenration: boolean = false;
    constructor(public fb: FormBuilder, public clientService: ClientService,
                public  router: Router,  public toastr: ToastsManager, vcr: ViewContainerRef) {
                this.toastr.setRootViewContainerRef(vcr);
    }
    ngOnInit() {
        this.myForm = this.fb.group({
            email: ['', [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
            clientName: ['', [<any>Validators.required]]
        });
    }
    register(form) {
        this.isTemplateGenration = false;
        if (form.valid ) {
            let res = this.clientService.getDetails(this.client.email);
            if (res) {
                        localStorage.setItem('clientName', this.client.clientName);
                        localStorage.setItem('email', this.client.email);
                        this.isTemplateGenration = true;
            }else {
                    let res1 = this.clientService.checkConflict(this.client.email);
                    if ( res1 ) {
                        localStorage.setItem('clientName', this.client.clientName);
                        localStorage.setItem('email', this.client.email);
                        this.isTemplateGenration = true;
                    }else {
                        this.toastr.warning('Conflict client! This user is blocked by XEROX', 'Warning!');
                    }
            }
            }
    }
    checkStatus() {
        if (this.status) {
                this.router.navigate(['/ap/client-upload']);
        }else {
               this.router.navigate(['/ap/client-form']);
        }
    }
}
