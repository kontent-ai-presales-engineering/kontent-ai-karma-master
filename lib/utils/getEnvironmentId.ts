import { NextResponse } from 'next/server'

export default function getEnvironmentId() {
  const response = NextResponse.next()
  const envid = response.cookies.get('kontent-ai-hermes-envid') ? response.cookies.get('kontent-ai-hermes-envid') : process.env.NEXT_PUBLIC_KONTENT_ENVIRONMENT_ID
  return envid
}