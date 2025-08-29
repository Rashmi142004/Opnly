'use client'
import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import PostCard, { Post } from '@/components/PostCard'
import Link from 'next/link'


export default function HomePage() {
const [posts, setPosts] = useState<Post[]>([])
const [loading, setLoading] = useState(true)


useEffect(() => {
const run = async () => {
const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
const snap = await getDocs(q)
const list: Post[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
setPosts(list)
setLoading(false)
}
run()
}, [])


return (
<div className="space-y-4">
<div className="flex items-center justify-between">
<h1 className="text-3xl font-bold text-gray-900">Home</h1>
<Link href="/new" className="btn btn-primary">New Post</Link>
</div>
{loading && <div className="card">Loading…</div>}
{!loading && posts.length === 0 && (
<div className="card text-center">No posts yet. Be the first to share!</div>
)}
<div className="space-y-4">
{posts.map((p) => (
<PostCard key={p.id} post={p} />
))}
</div>
</div>
)
}
