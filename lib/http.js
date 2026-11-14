import { NextResponse } from 'next/server';
export function fail(error,status=400){return NextResponse.json({message:error?.message||'Something went wrong'},{status});}
