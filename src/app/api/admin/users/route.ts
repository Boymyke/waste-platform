import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';

export async function GET(){
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get('wasteos_session')?.value);
  if(!session || !['ADMIN','SUPER_ADMIN'].includes(session.role)) return NextResponse.json({error:'Forbidden'},{status:403});
  const users = await prisma.user.findMany({select:{id:true,phone:true,name:true,role:true,active:true,verifiedAt:true,createdAt:true},orderBy:{createdAt:'desc'},take:100});
  return NextResponse.json({users});
}

export async function PATCH(req: Request){
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get('wasteos_session')?.value);
  if(!session || session.role !== 'SUPER_ADMIN') return NextResponse.json({error:'Only a Super Admin can change roles.'},{status:403});
  const {userId,role,active}=await req.json();
  const allowed=['USER','COLLECTOR','ADMIN','SUPER_ADMIN'];
  if(role && !allowed.includes(role)) return NextResponse.json({error:'Invalid role.'},{status:400});
  const user=await prisma.user.update({where:{id:userId},data:{...(role?{role}:{}),...(typeof active==='boolean'?{active}:{})}});
  await prisma.auditLog.create({data:{actorId:session.userId,action:'USER_ACCESS_UPDATED',entity:'User',entityId:userId,metadata:{role,active}}});
  return NextResponse.json({user});
}
