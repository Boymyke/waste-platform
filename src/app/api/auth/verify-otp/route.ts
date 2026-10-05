import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { signSession } from '@/lib/session';

export async function POST(req: Request){
  try{
    const { phone, code } = await req.json();
    const normalized = String(phone || '').replace(/\s+/g,'');
    if(!/^\+234\d{10}$/.test(normalized) || !/^\d{6}$/.test(String(code||''))) return NextResponse.json({error:'Invalid verification details.'},{status:400});

    const otp = await prisma.otpCode.findFirst({where:{phone:normalized,usedAt:null},orderBy:{createdAt:'desc'}});
    if(!otp || otp.expiresAt < new Date()) return NextResponse.json({error:'This code has expired. Request a new one.'},{status:400});
    if(otp.attempts >= 5) return NextResponse.json({error:'Too many attempts. Request a new code.'},{status:429});

    const hash = crypto.createHash('sha256').update(String(code)+(process.env.OTP_SECRET || 'dev-secret')).digest('hex');
    if(hash !== otp.codeHash){
      await prisma.otpCode.update({where:{id:otp.id},data:{attempts:{increment:1}}});
      return NextResponse.json({error:'Incorrect verification code.'},{status:400});
    }

    const user = await prisma.user.upsert({where:{phone:normalized},create:{phone:normalized,verifiedAt:new Date()},update:{verifiedAt:new Date()}});
    await prisma.otpCode.update({where:{id:otp.id},data:{usedAt:new Date(),userId:user.id}});

    const token = signSession({userId:user.id,role:user.role,exp:Date.now()+7*24*60*60*1000});
    const res = NextResponse.json({ok:true,role:user.role});
    res.cookies.set('wasteos_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:7*24*60*60});
    return res;
  }catch(error){
    console.error(error);
    return NextResponse.json({error:'Something went wrong.'},{status:500});
  }
}
