function getEntitlements(request, admin) {
    return new Promise(async (resolve, reject) => {
        try {

            let reports = await firebaseread(admin);

            if (reports) { if (reports['result']) resolve(reports); } else reject(reports);
        }
        catch (e) {
            throw e;
        }
    });

}

function GetProducts(request, admin) {
    return new Promise(async (resolve, reject) => {
        try {

            let reports = await firebaseread(admin);

            if (reports) { if (reports['result']) resolve(reports); } else reject(reports);
        }
        catch (e) {
            throw e;
        }
    });

}

async function firebaseread(admin) {
    try {

        var dbRef = admin.database();
        var ref = dbRef.ref("ga-admin-tool");
        const snapshot = await ref.once('value');

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Process the data as needed

            return {
                "ga-admin-tool": data,
                "result": true
            };
        } else {

            return {
                "ga-admin-tool": "No Data Found" + snapshot.val(),
                "result": true
            };
        }
    } catch (error) {
        console.error('Error reading data:', error);
        return {
            "ga-admin-tool": error,
            "result": false
        };
    }
}

module.exports = { getEntitlements }