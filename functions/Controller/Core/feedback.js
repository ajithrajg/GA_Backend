const { getDatabase } = require('firebase-admin/database');

function writeWebFeedback(request, admin) {
    try {
        return new Promise(async (resolve, reject) => {
            const db = getDatabase();
            let ref = db.ref('ga-admin-tool');
            let feedback = ref.child('feedbacks');
            console.log(request);
            let new_feedback = [];
            let existingData = await fetchWebFeedback(admin);
            if (existingData != null && existingData != undefined) {
                if (existingData['result'] && existingData['feedback']) {
                    if (typeof existingData['feedback'] != 'object') {
                        new_feedback = (JSON.parse(existingData['feedback']));
                    }
                    else  {
                        new_feedback = (existingData['feedback']);
                    }
                }
            }
            new_feedback.push({
                "feedback": request,
                "Timestamp": (new Date().toDateString())+' '+(new Date())
            });
            feedback.update(new_feedback, (error)=> {
                let feedbackReport = {
                    "feedback": 'Backend service failure. platform: firebase, operation: write, statuc: failed, Error Message:'+error,
                    "result": false
                }
    
                reject(feedbackReport);
            });  
            let feedbackReport = {
                "feedback": 'Feedback has been recorded successfully!',
                "result": true
            }

            resolve(feedbackReport);
        });
    }
    catch (e) {
        throw e;
    }
}

async function fetchWebFeedback(admin) {
    try {

        var dbRef = admin.database();
        var ref = dbRef.ref("ga-admin-tool/feedbacks");
        const snapshot = await ref.once('value');

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Process the data as needed

            return {
                "feedback": data,
                "result": true
            };
        } else {

            return {
                "feedback": "No Data Found",
                "result": true
            };
        }
    } catch (error) {
        console.error('Error reading data:', error);
        return {
            "feedback": error,
            "result": false
        };
    }
}


module.exports = { writeWebFeedback }