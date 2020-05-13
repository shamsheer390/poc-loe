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

export class MuraaiConf {
    public static API_SOCKET: string = 'http://119.82.126.250:8089/ap-invoice-services/';
    // public static DASHBOARD_CHART_SOCKET: string = 'http://192.168.0.105:8080/';
    public static DASHBOARD_CHART_SOCKET: string = 'http://119.82.126.250:8089/ap-invoice-services/';
    // public static API_SOCKET: string = 'http://192.168.0.112:8080/';
    public static CONTENT_UPLOAD_DIRECTORY: string = '/Sites/apinvoicesite/documentLibrary';
    public static EPSOFTSERVICE_SOCKET: string = 'http://119.82.126.250:9999/ocr/dcma/rest/v1/batch/batchInstance/';
    public static API_SOCKET1: string = 'http://ec2-107-22-141-69.compute-1.amazonaws.com/docushare/';
    public static POC_URL: string = 'http://119.82.126.250:8089/muraai-api-mgmt-poc-0.0.1-SNAPSHOT/';
    public static DOCUSIGN_BASE_URL = 'http://172.104.85.31:9999/docusign/';  // nginx address
    public static DOCUSHARE_BASE_URL = 'http://ec2-107-22-141-69.compute-1.amazonaws.com/docushare/'; // war name and ip address
}
