import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google4fdfab1ab320b437.html', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
