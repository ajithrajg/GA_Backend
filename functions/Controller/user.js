const { run } = require('../Database/db');

/*
 *  *** INSERT DOCUMENTS ***
 *
 * You can insert individual documents using collection.insert().
 * In this example, we're going to create four documents and then
 * insert them all in one call with collection.insertMany().
 */

exports.getMessages = async (req, res) => {
  try {
    const cursor = await req.mongoCollection.find().sort({ name: 1 });
    await cursor.forEach(recipe => {
      console.log(recipe);
    });
    // add a linebreak
    res.status(200).send(cursor.toArray());
  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
    res.status(500).send(err.message);
  }
}
exports.getMessage = async (req, res) => {
  try {
    const query = { messageID: req.body.id }
    const document = await req.mongoCollection.findOne(query);

    if (document) {
      console.log(document);
      res.status(200).send(document);
    } else {
      console.log("No matching document found.");
      res.status(200).send("No matching document found.");
    }

  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
    res.status(500).send(err.message);
  }
}
exports.postMessage = async (req, res) => {
  try {
    const insert = await req.mongoCollection.insertOne(req.body);
    console.log(`${insert.insertedCount} documents successfully inserted.\n`);      
    res.status(200).send({"message": `${insert.insertedCount} documents successfully inserted.`, "data":insert});
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    res.status(500).send(err.message);
  }
}
exports.updateMessage = async (req, res) => {
  const { client, collection } = await run();

  const findOneQuery = { messageID: req.body.id };

  /*
   * *** UPDATE A DOCUMENT ***
   *
   * You can update a single document or multiple documents in a single call.
   *
   * Here we update the PrepTimeInMinutes value on the document we
   * just found.
   */
  const updateDoc = { $set: { message: req.body.message } };

  // The following updateOptions document specifies that we want the *updated*
  // document to be returned. By default, we get the document as it was *before*
  // the update.
  const updateOptions = { returnOriginal: false };

  try {
    const updateResult = await req.mongoCollection.findOneAndUpdate(
      findOneQuery,
      updateDoc,
      updateOptions,
    );
    console.log(`Here is the updated document:\n${JSON.stringify(updateResult.value)}\n`);
    res.status(200).send(`Here is the updated document:\n${JSON.stringify(updateResult.value)}`);
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
    res.status(500).send(err.message);
  }
}
exports.deleteMessage = async (req, res) => {
  const deleteQuery = { messageID: req.body.id };
  try {
    const deleteResult = await req.mongoCollection.deleteOne(deleteQuery);
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
    res.status(200).send(`Deleted ${deleteResult.deletedCount} documents\n`);
  } catch (err) {
    console.error(`Something went wrong trying to delete documents: ${err}\n`);
    res.status(500).send(err.message);
  }
}
exports.patchMessage = async (req, res) => {
  const findOneQuery = { messageID: req.body.id };

  /*
   * *** UPDATE A DOCUMENT ***
   *
   * You can update a single document or multiple documents in a single call.
   *
   * Here we update the PrepTimeInMinutes value on the document we
   * just found.
   */
  const updateDoc = { $set: { message: req.body.message } };

  // The following updateOptions document specifies that we want the *updated*
  // document to be returned. By default, we get the document as it was *before*
  // the update.
  const updateOptions = { returnOriginal: false };

  try {
    const updateResult = await req.mongoCollection.findOneAndUpdate(
      findOneQuery,
      updateDoc,
      updateOptions,
    );
    console.log(`Here is the updated document:\n${JSON.stringify(updateResult.value)}\n`);
    res.status(200).send(`Here is the updated document:\n${JSON.stringify(updateResult.value)}`);
  } catch (err) {
    console.error(`Something went wrong trying to update one document: ${err}\n`);
    res.status(500).send(err.message);
  }
}
exports.invalid = async (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Invalid path',
  });
};