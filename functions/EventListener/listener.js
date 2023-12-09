
var EventingManagerService = require('../EventManager/event');
const run = require('../Database/db').run;
async function newUser(payload) {
    console.log(payload);
    const { client, collection } = await run("ChatRoom", "RoomDetails");
    console.log('I opened a connection');
    try {
        const insert = await collection.insertOne(payload);
        console.log(`${insert} user successfully signed in.\n`);      
      } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
      }
      finally {
        client.close();
        console.log('I closed the connection');
      }
}

async function passwd(payload) {
    console.log(payload);
    const { client, collection } = await run("ChatRoom", "RoomDetails");
    console.log('I opened a connection');
    try {
        const query = { user: payload['user'], room: payload['room'] };
        console.log('query: '+JSON.stringify(query));
        console.log('full payload: '+JSON.stringify(payload));
        const update = { $set: { password: payload['password'] } };
      
        await collection.updateOne(query, update, function(err, result) {
            if (err) {
              console.error('Error updating document:', err);
            } else {
              console.log('Document updated successfully:', result.modifiedCount, 'document(s) modified');
            }
        
            // Close the connection
            client.close();
            console.log('I closed the connection');
        });

      } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
      }
}

async function storeMessage(payload) {
    console.log(payload);
    const { client, collection } = await run("ChatSpace", "ChatMessage");
    console.log('I opened a connection');
    try {
        const insert = await collection.insertOne(payload);
        console.log(`${insert} documents successfully inserted.\n`);      
      } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
      }
      finally {
        client.close();
        console.log('I closed the connection');
      }
}

async function LoginNewUser(payload) {
  const { client, collection } = await run("GA_DATA", "GA_Logs");
  console.log('I opened a connection');
  try {
      const insert = await collection.insertOne(payload);
      console.log(`${insert} user logged in successfully .\n`);      
    } catch (err) {
      console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }
    finally {
      client.close();
      console.log('I closed the connection');
    }
}

function subscribeAllEvents() {
    EventingManagerService.subscribe('new_user', newUser);
    EventingManagerService.subscribe('password', passwd);
    EventingManagerService.subscribe('record_message', storeMessage);
    EventingManagerService.subscribe('login_new_user', LoginNewUser);
}

module.exports = {
    subscribeAllEvents
};
