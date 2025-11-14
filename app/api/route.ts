import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI ;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Reutiliza el cliente entre requests/refresh en dev
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

const DB_NAME = 'bracket_competition';
const COMP_COLLECTION = 'competitors';
const DOC_ID = '21813C39A073FEE8C4A8C5CB';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COMP_COLLECTION);

    const doc = await collection.findOne({ _id: new ObjectId(DOC_ID) });

    return NextResponse.json({
      success: true,
      competitors: doc?.data || []
    });
  } catch (error) {
    console.error('Error fetching competitors:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { competitors } = await request.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COMP_COLLECTION);

    await collection.updateOne(
      { _id: new ObjectId(DOC_ID) },
      { $set: { data: competitors, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Competitors saved' });
  } catch (error) {
    console.error('Error saving competitors:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}