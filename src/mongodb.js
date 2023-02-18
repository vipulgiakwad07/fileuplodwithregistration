const { MongoClient } = require("mongodb");

// Replace the following with your MongoDB connection string
const uri = "mongodb://localhost:27017";

// Name of the database and collection to store the data
const dbName = "my-db";
const collectionName = "registrations";

async function storeRegistration(
  firstName,
  lastName,
  email,
  password,
  fileName
) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      fileName: fileName,
      timestamp: new Date()
    });

    console.log(`Registration stored with id: ${result.insertedId}`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
