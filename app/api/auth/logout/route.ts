import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.headers.set('Set-Cookie', 'agentclinic_session=; Max-Age=0; HttpOnly; Path=/')
  return response
}