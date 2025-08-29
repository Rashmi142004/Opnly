'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'


export default function SignUpPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [username, setUsername] = useState('')
const [err, setErr] = useState('')


const onSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setErr('')
try {
const res = await createUserWithEmailAndPassword(auth, email, password)
await updateProfile(res.user, { displayName: username })
await setDoc(doc(db, 'users', res.user.uid), { username, bio: '', photoURL: '', createdAt: Date.now() })
window.location.href = '/'
} catch (e: any) {
setErr(e.message)
}
}


return (
<div className="max-w-md mx-auto card space-y-4">
<h1 className="text-2xl font-bold">Create your account</h1>
{err && <div className="text-red-600 text-sm">{err}</div>}
<form onSubmit={onSubmit} className="space-y-3">
<input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
<input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="btn btn-primary w-full">Sign Up</button>
</form>
</div>
)
}
