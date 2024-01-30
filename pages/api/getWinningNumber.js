import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  // Set up the connection URL and database name
  const uri = process.env.MONGODB_URL;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const dbName = 'test';

  // Connect to the database
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('fetchResults');

    // Extract the draw time from the request payload
    const { drawTime } = req.query;

    // Find the document with the corresponding draw time
    const result = await collection.findOne({ drawTime: { $eq: drawTime } });
   
    // If a document is found, return the winning number
    if (result) {
      res.status(200).json({ couponNum: result.couponNum });
    } else {
      res.status(404).json({ message: `No winning number found for draw time: ${drawTime}` });
    }

  } catch (err) {
    console.log('Error connecting to database:', err);
    res.status(500).json({ message: 'Error connecting to database' });
  } finally {
    await client.close();
  }
}
