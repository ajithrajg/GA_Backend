const fs = require('fs');
const { getDatabase } = require('firebase-admin/database');

//Firebase CSP methods
var reports = null;
function AddCspReport(reports, admin) {
    return new Promise(async (resolve, reject) => {
        try {

            const db = getDatabase();
            let existingData = await firebaseread(admin);
            let ref = db.ref('server');
            let cspreport = ref.child('data');
            let type = ref.child('IDs');
            let jsonData = typeof reports != 'object' ? JSON.parse(reports) : reports;

            let data = {};
            let IdAsString = "";
            var finalData = {};

            if (existingData != null && existingData != undefined) {
                if (existingData['result'] && existingData['server']['data']) {
                    IdAsString = existingData['server']['IDs'];
                    if (typeof existingData['server']['data'] != 'object') {
                        data = JSON.parse(existingData['server']['data']);
                    }
                    else {
                        data = existingData['server']['data'];
                    }
                }
            }


            let dataObj = {};
            if (jsonData) {
                let uuid = GetUUID(jsonData);

                if (!IdAsString.includes(uuid)) {
                    IdAsString += uuid + ",";
                    dataObj[uuid] = jsonData;
                    finalData = { ...dataObj, ...data };

                    cspreport.set(finalData);
                    type.set(IdAsString);


                    let cspReports = {
                        "server": 'Report has been added successfully!',
                        "result": true
                    }

                    resolve(cspReports);
                }
                else {
                    let cspReports = {
                        "server": 'Report Exists!',
                        "result": true
                    }

                    resolve(cspReports);
                }
            }
        }
        catch (err) {
            throw err;
        }

    });

}
function UpdateCspReport(request) {
    const db = getDatabase();
    let jsonReq = typeof request != 'object' ? JSON.parse(request) : request;
    let id = jsonReq['id'], report = jsonReq['report'];
    return new Promise((resolve, reject) => {
        try {

            const ref = db.ref('server/');
            let cspreports = ref.child('data/' + id);
            cspreports.set(report);
            resolve({
                "data": 'Csp report has been updated successfully!',
                "result": true
            });
        }
        catch (err) {
            throw err;
        }
    });

}
function DeleteCspReport(request) {
    const db = getDatabase();
    let jsonReq = typeof request != 'object' ? JSON.parse(request) : request;
    let id = jsonReq['id'];
    return new Promise(async (resolve, reject) => {
        try {

            const ref = db.ref('server/');
            let cspreports = ref.child('data/' + id);
            let type = ref.child('IDs');
            let IdAsString = "";
            let existingData = await firebaseread();
            if (existingData != null && existingData != undefined && typeof existingData != 'string') {
                if (existingData['result']) {
                    IdAsString = existingData['server']['IDs'];
                    IdAsString = IdAsString.replaceAll(id + ",", "");
                    type.set(IdAsString);
                    cspreports.remove();
                }
            }
            resolve({
                "data": 'Csp report has been deleted successfully!',
                "result": true
            });
        }
        catch (err) {
            throw err;
        }
    });

}
function GetUUID(csp) {
    try {

        if (csp['SourceFile'] && csp['ViolatedDirective'] && csp['LineNumber'] && csp['ColumnNumber'])
            return (csp['SourceFile'] + csp['ViolatedDirective'] + csp['LineNumber'] + csp['ColumnNumber']).replaceAll(/[#$/\[\]\.]/g, "");
        else
            return null;
    }
    catch (ex) {
        throw ex;
    }
}
async function ReadCspReports(admin) {
    return new Promise(async (resolve, reject) => {
        try {
            reports = await firebaseread(admin);

            if (reports) { if (reports['result']) resolve(reports); } else reject(reports);
        } catch (asyncError) {
            // Handle errors from the asynchronous operation
            let result = { "Error": asyncError, "result": false }
            reject(result);
        }
    });

}
async function firebaseread(admin) {
    try {

        var dbRef = admin.database();
        var ref = dbRef.ref("server");
        const snapshot = await ref.once('value');

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Process the data as needed

            return {
                "server": data,
                "result": true
            };
        } else {

            return {
                "server": "No Data Found",
                "result": true
            };
        }
    } catch (error) {
        console.error('Error reading data:', error);
        return {
            "server": error,
            "result": false
        };
    }
}

function FetchCSPReports() {
    return new Promise((resolve, reject) => {
        fs.readFile('./cspreports.txt', 'utf8', (err, data) => {
            let cspReports = null;
            if (err) {
                console.error('Error reading the file:', err);
                cspReports = {
                    "data": '' + err,
                    "result": false
                }
                reject(cspReports);
            }
            let content = null;


            if (data && data.length > 0) {
                content = data;
            }
            else {

                cspReports = {
                    "data": 'No Reports Found',
                    "result": false
                }
                resolve(cspReports);
            }

            cspReports = {
                "data": JSON.parse(content),
                "result": true
            }

            resolve(cspReports);
        });
    });
}
function StoreCSPReport(cspreport) {

    return new Promise((resolve, reject) => {
        let cspReports = null;


        fs.open('./cspreports.txt', JSON.stringify(cspreport), (err) => {
            if (err) {
                console.error('Error updating the file:', err);
                cspReports = {
                    "data": '[]',
                    "result": false
                }
                reject(cspReports);
            }
            else {

                cspReports = {
                    "data": "Updated successfully!",
                    "result": true
                }
                resolve(cspReports);
            }
        });
    });
}

module.exports = { FetchCSPReports, StoreCSPReport, ReadCspReports, AddCspReport, UpdateCspReport, DeleteCspReport }