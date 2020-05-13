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

export class UserMasterModel {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    modifiedBy: string;
    createdBy: string;
    modifiedOn: Date;
    createdOn: Date;
    status: number;
    constructor(obj: any) {
        this.userId = obj && obj.userId || null;
        this.firstName = obj && obj.firstName || null;
        this.lastName = obj && obj.lastName || null;
        this.email = obj && obj.email || null;
        this.createdOn = obj && obj.createdOn || null;
        this.createdBy = obj && obj.createdBy || null;
        this.modifiedBy = obj && obj.modifiedBy || null;
        this.modifiedOn = obj && obj.modifiedOn || null;
        this.status = obj && obj.status || null;
    }
}
