import './globals.css'
import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'


export const metadata: Metadata = {
title: 'Opnly',
description: 'Speak. Heal. Connect.'
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<div className="container">
<header className="py-6 flex items-center justify-between">
<div className="flex items-center gap-3">
<img src="/logo.svg" alt="Opnly" className="h-8" />
</div>
<div className="hidden sm:block text-sm text-gray-500">Speak. Heal. Connect.</div>
</header>
</div>
<main className="container pb-24">{children}</main>
<NavBar />
</body>
</html>
)
}
