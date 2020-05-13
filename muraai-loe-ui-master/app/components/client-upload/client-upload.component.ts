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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClientUploadService } from './services/client-upload.service';
import { MuraaiConf } from '../common/muraai-conf';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

declare let dialogPolyfill: any;

@Component({
  selector: 'client-upload',
  templateUrl: './client-upload.component.html',
  styleUrls: ['./client-upload.component.scss'],
  providers: [ClientUploadService]
})
export class ClientUpload implements OnInit {

  @ViewChild('confirmbox')
  confirmbox: any;

  currentFolderPath: string;

  constructor(private uploadService: ClientUploadService, private router: Router, private translateService: AlfrescoTranslationService) {

  }

  ngOnInit(): void {
    this.currentFolderPath = MuraaiConf.CONTENT_UPLOAD_DIRECTORY;
    if (this.translateService) {
      this.translateService.addTranslationFolder('invoice-upload', '/custom-translation/invoice-upload');
    }
  }

  onUploadSuccess(data: any) {
    console.log(data);
    let docDetailsObj = {
      'docName': data.value.entry.name,
      'docMimeType': data.value.entry.content.mimeType,
      'docRef': data.value.entry.id,
      'createdBy': data.value.entry.createdByUser.id,
      'createdOn': data.value.entry.createdAt,
      'invoiceNo': 'NA'
    };

    this.uploadService.insertDocumentDetails(docDetailsObj).subscribe(
      (response) => {
        let docId = response.inboundInvoiceDocId;
        let taskInputObj = {
          'processDefinitionKey': 'APInvoiceManagementCopy1',
          'variables': [{
            'name': 'inbound_invoice_doc_id',
            'type': 'integer',
            'value': docId
          }]
        };

        this.uploadService.triggerInvoiceTask(taskInputObj).subscribe(
          () => {
            this.showConfirm();
          }
        );

      }
    );

  }

   showConfirm() {

    if (!this.confirmbox.nativeElement.showModal) {
      dialogPolyfill.registerDialog(this.confirmbox.nativeElement);
    }
    if (this.confirmbox) {
      this.confirmbox.nativeElement.showModal();
    }
  }

  private closeConfirm() {
    if (this.confirmbox) {
      this.confirmbox.nativeElement.close();
    }

  }

  onYesClick() {
    this.closeConfirm();
  }

  onNoClick() {
    this.closeConfirm();
    this.router.navigate(['']);
  }
}
