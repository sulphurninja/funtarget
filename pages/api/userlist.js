import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URL;

export default async function handler(req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()

    const collection = client.db('test').collection('users')

    switch (req.method) {
      case 'GET':
        const users = await collection.find().toArray()
        res.status(200).json(users)
        break
      case 'PUT':
        const { id } = req.query
        const { userName, role } = req.body
        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { userName: userName, role: role } }
        )
        res.status(200).json({ message: 'User updated successfully' })
        break
        case 'DELETE':
          const userId = req.query.id;
          await collection.deleteOne({ _id: new ObjectId(userId) }); // Construct ObjectId using 'new'
          res.status(200).json({ message: 'User deleted successfully' });
          break;
  
        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          res.status(405).end(`Method ${req.method} Not Allowed`);
      }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    await client.close()
  }
}
