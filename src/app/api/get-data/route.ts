import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { unstable_noStore } from 'next/cache';

export async function GET() {
    unstable_noStore();
  try {
    const result = await sql`SELECT temperature, humidity, timestamp FROM sensor_data ORDER BY timestamp DESC`;
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
