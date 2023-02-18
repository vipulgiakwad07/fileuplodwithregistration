const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3001;

// Replace the following with your MongoDB connection string
const uri = "mongodb://localhost:27017";

// Name of the database and collection to store the data
const dbName = "my-db";
const collectionName = "registrations";

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Enable CORS for all requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Store registration data in database
async function storeRegistration(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
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
      confirmPassword: confirmPassword,
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

// Handle POST requests to the registration endpoint
app.post("/register", (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    file
  } = req.body;
  // Check if password and confirm password match
  if (password !== confirmPassword) {
    res.status(400).send("Password and Confirm Password fields do not match");
    return;
  }
  // Store registration data in database
  storeRegistration(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    file.name
  );
  // Return a success response
  res.status(200).send("Registration successful");
});

// Handle all other requests by serving the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
