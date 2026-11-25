import {handleLogin} from '@/lib/authHandlers';
export async function POST(req){return await handleLogin(req,'admin');}
