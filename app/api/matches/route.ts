import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI ;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

const DB_NAME = 'bracket_competition';
const COLL = 'matches';

export async function GET(request: Request){
  try {
    const client = await clientPromise;
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId') || undefined;

    const db = client.db(DB_NAME);
    const collection = db.collection(COLL);
    const query = tournamentId ? { tournamentId } : {};
    const matches = await collection.find(query).toArray();

    return NextResponse.json({ success: true, matches: matches || [] });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { matches } = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLL);

    if (Array.isArray(matches) && matches.length > 0) {
      const now = new Date();
      const matchesWithTimestamp = matches.map((m: any) => ({
        ...m,
        createdAt: m.createdAt ? new Date(m.createdAt) : now,
        updatedAt: now
      }));

      const bulkOps = matchesWithTimestamp.map((m: any) => ({
        updateOne: {
          filter: {
            tournamentId: m.tournamentId,
            roundIndex: m.roundIndex,
            matchIndex: m.matchIndex
          },
          update: { $set: m },
          upsert: true
        }
      }));

      await collection.bulkWrite(bulkOps, { ordered: false });
    }

    return NextResponse.json({ success: true, message: 'Matches saved' });
  } catch (error) {
    console.error('Error saving matches:', error);
    return NextResponse.json({ success: false, error: 'Failed to save' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('tournamentId');
    if (!tournamentId) {
      return NextResponse.json({ success: false, error: 'Missing tournamentId' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLL);
    const result = await collection.deleteMany({ tournamentId });
    return NextResponse.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('Error deleting matches:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}