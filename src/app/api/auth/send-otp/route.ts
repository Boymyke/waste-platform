import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

function normalizePhone(input: string){
  return input.replace(/\s+/g,'').replace(/^0/,'+234').replace(/^234/,'+234');
}

export async function POST(req: Request){
  try{
    const { phone } = await req.json();
    const normalized = normalizePhone(String(phone || ''));
    if(!/^\+234\d{10}$/.test(normalized)) return NextResponse.json({error:'Enter a valid Nigerian WhatsApp number.'},{status:400});

    const recent = await prisma.otpCode.findFirst({where:{phone:normalized,createdAt:{gt:new Date(Date.now()-60_000)}}});
    if(recent) return NextResponse.json({error:'Please wait 60 seconds before requesting another code.'},{status:429});

    const code = String(crypto.randomInt(100000,1000000));
    const codeHash = crypto.createHash('sha256').update(code + (process.env.OTP_SECRET || 'dev-secret')).digest('hex');
    await prisma.otpCode.create({data:{phone:normalized,codeHash,expiresAt:new Date(Date.now()+10*60_000)}});

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const template = process.env.WHATSAPP_OTP_TEMPLATE || 'wasteos_login_code';
    if(!token || !phoneNumberId){
      if(process.env.NODE_ENV !== 'production') return NextResponse.json({message:'Development OTP generated.',devCode:code});
      return NextResponse.json({error:'WhatsApp verification is not configured.'},{status:503});
    }

    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,{
      method:'POST',
      headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        messaging_product:'whatsapp',
        to:normalized.replace('+',''),
        type:'template',
        template:{name:template,language:{code:'en'},components:[{type:'body',parameters:[{type:'text',text:code}]}]}
      })
    });
    if(!response.ok){
      const details = await response.text();
      console.error('WhatsApp OTP failed',details);
      return NextResponse.json({error:'Could not send the WhatsApp code. Please try again.'},{status:502});
    }
    return NextResponse.json({message:'OTP sent to WhatsApp.'});
  }catch(error){
    console.error(error);
    return NextResponse.json({error:'Something went wrong.'},{status:500});
  }
}
