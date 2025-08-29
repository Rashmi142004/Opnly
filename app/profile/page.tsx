'use client'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db, storage } from '@/lib/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar'


export default function ProfilePage() {
const [user] = useAuthState(auth)
const [bio, setBio] = useState('')
const [username, setUsername] = useState('')


useEffect(() => {
const run = async () => {
if (!user) return
const snap = await getDoc(doc(db, 'users', user.uid))
const data = snap.data() || {}
setBio(data.bio || '')
setUsername(data.username || user.displayName || '')
}
run()
}, [user])


const save = async () => {
if (!user) return
await setDoc(doc(db, 'users', user.uid), { username, bio, photoURL: user.photoURL || '' }, { merge: true })
alert('Saved')
}


const uploadAvatar = async (e: React.C
