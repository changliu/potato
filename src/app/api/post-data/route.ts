import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { temperature, humidity } = await request.json();
    console.log("temp", temperature)
    console.log("humidity", humidity)
    await sql`
      INSERT INTO sensor_data (temperature, humidity, timestamp) VALUES (${temperature}, ${humidity}, NOW())`;

    return NextResponse.json({ message: 'Data stored successfully' });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
