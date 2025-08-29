'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'


export default function LoginPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [err, setErr] = useState('')


const onSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setErr('')
try {
await signInWithEmailAndPassword(auth, email, password)
window.location.href = '/'
} catch (e: any) {
setErr(e.message)
}
}


return (
<div className="max-w-md mx-auto card space-y-4">
<h1 className="text-2xl font-bold">Log In</h1>
{err && <div className="text-red-600 text-sm">{err}</div>}
<form onSubmit={onSubmit} className="space-y-3">
<input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="btn btn-primary w-full" type="submit">Log In</button>
</form>
<p className="text-sm text-gray-500">No account? <Link className="text-lavender-700 underline" href="/auth/signup">Sign Up</Link></p>
</div>
)
}
