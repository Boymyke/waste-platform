import crypto from 'crypto';

export type SessionPayload = { userId: string; role: 'USER'|'COLLECTOR'|'ADMIN'|'SUPER_ADMIN'; exp: number };

function secret(){ return process.env.SESSION_SECRET || process.env.OTP_SECRET || 'development-session-secret'; }

export function signSession(payload: SessionPayload){
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256',secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(token?: string | null): SessionPayload | null {
  if(!token) return null;
  const [body,sig]=token.split('.');
  if(!body||!sig) return null;
  const expected=crypto.createHmac('sha256',secret()).update(body).digest('base64url');
  if(sig.length!==expected.length || !crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected))) return null;
  const data=JSON.parse(Buffer.from(body,'base64url').toString()) as SessionPayload;
  if(data.exp < Date.now()) return null;
  return data;
}
