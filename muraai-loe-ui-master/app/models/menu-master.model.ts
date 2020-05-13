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
export class MenuMasterModel {
    menuId: number;
    icon: string;
    route: string;
    parentId: number;
    status: number;
    menuDesc: string;
    appId: number;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;
    constructor() {
        this.menuId =  null;
        this.icon = null;
        this.route =  null;
        this.parentId = null;
        this.status =  null;
        this.menuDesc = null;
        this.appId = 2;
        this.createdOn =  null;
        this.createdBy =  null;
        this.modifiedBy =  null;
        this.modifiedOn =  null;
    }
}
