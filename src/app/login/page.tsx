'use client';
import { useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Recycle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage(){
  const [step,setStep]=useState<'phone'|'otp'>('phone');
  const [phone,setPhone]=useState('');
  const [otp,setOtp]=useState(['','','','','','']);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');

  async function sendOtp(){
    setBusy(true);setMessage('');
    const res=await fetch('/api/auth/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:`+234${phone.replace(/^0/,'')}`})});
    const data=await res.json();setBusy(false);
    if(res.ok){setStep('otp');setMessage(data.message||'OTP sent to WhatsApp');}else setMessage(data.error||'Could not send OTP');
  }
  async function verifyOtp(){
    setBusy(true);setMessage('');
    const res=await fetch('/api/auth/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone:`+234${phone.replace(/^0/,'')}`,code:otp.join('')})});
    const data=await res.json();setBusy(false);
    if(res.ok){setMessage('Verified successfully.');setTimeout(()=>location.href='/',700)}else setMessage(data.error||'Invalid OTP');
  }

  return <div className="auth-shell"><section className="auth-visual"><div className="brand"><div className="brandmark" style={{background:'rgba(255,255,255,.15)'}}><Recycle size={20}/></div><span>WasteOS</span></div><div><span className="role-chip" style={{background:'rgba(255,255,255,.12)',color:'#fff'}}><ShieldCheck size={14}/> Secure WhatsApp verification</span><h1>Waste pickup that feels simple, trusted and local.</h1><p style={{maxWidth:520,color:'#d6eee3',lineHeight:1.7}}>Request collections, track collectors, pay securely and earn from recyclable materials — all from one account.</p></div><small>Built for cleaner communities and smarter collection operations.</small></section><section className="auth-card-wrap"><div className="auth-card">{step==='phone'?<><div className="brand"><div className="brandmark"><Recycle size={20}/></div><span>WasteOS</span></div><h2>Welcome</h2><p className="muted">Enter your WhatsApp number to continue. We’ll send a 6-digit verification code.</p><div className="field"><label>WhatsApp number</label><div className="phone-row"><input value="🇳🇬 +234" readOnly/><input inputMode="tel" placeholder="801 234 5678" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,11))}/></div></div><button className="btn full" disabled={busy||phone.length<10} onClick={sendOtp}><MessageCircle size={17} style={{verticalAlign:'middle',marginRight:8}}/>{busy?'Sending...':'Send code on WhatsApp'}</button>{message&&<p className="muted">{message}</p>}<p className="muted" style={{marginTop:20}}>By continuing, you agree to the WasteOS terms and privacy policy.</p></>:<><button className="iconbtn" onClick={()=>setStep('phone')}><ArrowLeft size={18}/></button><h2>Check WhatsApp</h2><p className="muted">We sent a verification code to +234 {phone}.</p><div className="field"><label>6-digit code</label><div className="otp-boxes">{otp.map((v,i)=><input key={i} maxLength={1} inputMode="numeric" value={v} onChange={e=>{const next=[...otp];next[i]=e.target.value.replace(/\D/g,'');setOtp(next);const el=e.currentTarget.nextElementSibling as HTMLInputElement|null;if(next[i]&&el)el.focus();}}/>)}</div></div><button className="btn full" disabled={busy||otp.join('').length!==6} onClick={verifyOtp}><CheckCircle2 size={17} style={{verticalAlign:'middle',marginRight:8}}/>{busy?'Verifying...':'Verify & continue'}</button>{message&&<p className="muted">{message}</p>}</>}</div></section></div>
}
