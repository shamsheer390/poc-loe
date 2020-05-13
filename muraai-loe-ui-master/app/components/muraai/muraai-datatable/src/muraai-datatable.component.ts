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
import { Component, OnInit, Input, Output, EventEmitter, ContentChild, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { ObjectDataTableAdapter, DataTableComponent } from 'ng2-alfresco-datatable';
import { DataColumnListComponent } from 'ng2-alfresco-core';
import { Pagination } from 'alfresco-js-api';
import { MdDialog } from '@angular/material';
import { MuraaiDialogComponent } from '../../muraai-dialog/src/muraai-dialog.component';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
declare let componentHandler: any;

@Component({
    selector: 'muraai-data-table',
    styleUrls: ['./muraai-datatable.component.scss'],
    templateUrl: './muraai-datatable.component.html'
})
export class MuraaiDataTableComponent implements OnInit, AfterViewInit, AfterContentInit {
    @Input()
    tableData: ObjectDataTableAdapter;

    @Input()
    rowData = [];

    @Input()
    header: string;

    @Input()
    selectionMode: string = 'single';

    @Input()
    noHeader: boolean = false; // if header is not required then set noheader =true

    @Input()
    addHeader: string;

    @Input()
    editHeader: string;

    @Input()
    formField: any;

    @Input()
    pagination: Pagination;

    @Input()
    showAdd: boolean = false;

    @Input()
    showRemove: boolean = false;

    @Input()
    showUpdateAll: boolean = false;

    @Input()
    showSave: boolean = false;

    @Input()
    showPagination: boolean = false;

    @Input()
    mutltiSelect: boolean = false;

    @Input()
    noAddAction: boolean = true;

    @Input()
    noRowDbAction: boolean = true; // this property for rowdb click  we don't want dilaog then set true;

    deletedRecord = [];

    selectedRecord = [];

    @Output()
    add: EventEmitter<EventListener> = new EventEmitter<EventListener>();

    @Output()
    delete: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    nextClick: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    previousClick: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    pageSizeChange: EventEmitter<Pagination> = new EventEmitter<Pagination>();

    @Output()
    update: EventEmitter<EventListener> = new EventEmitter<EventListener>();

    @Output()
    saveAll: EventEmitter<any> = new EventEmitter<any>();

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @ViewChild(DataTableComponent)
    muraaiDataTable: DataTableComponent;

    constructor(public dialog: MdDialog, private translateService: AlfrescoTranslationService) {
        if (translateService) {
            translateService.addTranslationFolder('muraai-datatable', '/custom-translation/muraai-datatable');
        }
    };
    ngOnInit() {
    }

    addClick(): void {
        if (!this.noAddAction) {
            let dialogRef = this.dialog.open(MuraaiDialogComponent, { disableClose: true, width: '70%' });
            dialogRef.componentInstance.formData = this.formField;
            dialogRef.componentInstance.header = this.addHeader;
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.add.emit(result);
                }
            });
        } else {
            this.add.emit();
        }
    }
    deleteClick(): void {
        if (this.tableData !== undefined) {
            this.tableData.getRows().filter(item => {
                if (item.isSelected) {
                    this.deletedRecord.push(item);
                }
            });
            this.tableData.setRows(this.tableData.getRows().filter(item => (!item.isSelected)));
            this.delete.emit(this.deletedRecord);
        } else {
            this.delete.emit(this.selectedRecord);
        }
    }
    rowDblClick(event): void {
        if (!this.noRowDbAction) {
            this.formField.forEach(function (item, key, object) {
                if (key === 0) { // this for disabled id of object in edit case ;
                    item.disabled = true;
                }
                if (event.value.obj.hasOwnProperty(item.name)) {
                    item.value = event.value.obj[item.name];
                }
            });
            let dialogRef = this.dialog.open(MuraaiDialogComponent, { disableClose: true, width: '70%' });
            dialogRef.componentInstance.formData = this.formField;
            dialogRef.componentInstance.header = this.editHeader;
            dialogRef.afterClosed().subscribe(result => {
                if (result !== undefined) {
                    this.update.emit(result);
                }
            });
        } else {
            this.update.emit(event);
        }
    }

    nextPage(event: Pagination): void {
        this.nextClick.emit(event);
    }

    prevPage(event: Pagination): void {
        this.previousClick.emit(event);
    }

    changeSize(event: Pagination): void {
        this.pageSizeChange.emit(event);
    }
    ngAfterViewInit() {
        this.setupMaterialComponents(componentHandler);
    }
    ngAfterContentInit() {
        if (this.muraaiDataTable !== undefined) {
            this.muraaiDataTable.columnList = this.columnList;
        }
    }
    setupMaterialComponents(handler?: any): boolean {
        // workaround for MDL issues with dynamic components
        let isUpgraded: boolean = false;
        if (handler) {
            handler.upgradeAllRegistered();
            isUpgraded = true;
        }
        return isUpgraded;
    }
    isLoading(): boolean {
        let loader;
        if (this.tableData != null) {
            loader = false;
        }
        if (this.rowData != null) {
            loader = false;
        } else {
            loader = true;
        }
        return loader;
    }
    saveAllClick() {
        this.saveAll.emit(this.rowData);
    }
    getSelectedRow(event) {
        this.selectedRecord = [];
        if (event.detail.selection.length > 0) {
            event.detail.selection.forEach(element => {
                this.selectedRecord.push(element.obj);
            });
        }
    }
    getUnselectedRow(event) {
        this.selectedRecord = [];
        if (event.detail.selection.length > 0) {
            event.detail.selection.forEach(element => {
                this.selectedRecord.push(element.obj);
            });
        }
    }

}
