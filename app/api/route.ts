import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://dariennlopezplaza_db_user:reecapt1234@cluster0.d1vc36j.mongodb.net/';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function GET() {
  try {
    await client.connect();
    const database = client.db('bracket_competition');
    const collection = database.collection('competitors');

    const competitors = await collection.findOne({ _id: 0 });

    return NextResponse.json({
      success: true,
      competitors: competitors?.data || []
    });
  } catch (error) {
    console.error('Error fetching competitors:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    const { competitors } = await request.json();
    
    await client.connect();
    const database = client.db('bracket_competition');
    const collection = database.collection('competitors');
    
    await collection.updateOne(
      { _id: 0 },
      { $set: { data: competitors, updatedAt: new Date() } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true, message: 'Competitors saved' });
  } catch (error) {
    console.error('Error saving competitors:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  } finally {
    await client.close();
  }
}