import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function POST(request: Request) {
  try {
    const { temperature, humidity } = await request.json();
    console.log("temp", temperature)
    console.log("humidity", humidity)
    await client.query(
      'INSERT INTO sensor_data (temperature, humidity, timestamp) VALUES ($1, $2, NOW())',
      [temperature, humidity]
    );

    return NextResponse.json({ message: 'Data stored successfully' });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
