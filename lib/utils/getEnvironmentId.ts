import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export default function getEnvironmentId() {
  const response = NextResponse.next()
  const envid = response.cookies.get('kontent-ai-hermes-envid').value
  return envid ? envid : process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID
}