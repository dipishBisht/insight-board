// pages/api/auth/login.js
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function handler(req: NextRequest, res: NextResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            res.status(200).json({ message: 'User logged in!' });
        } catch (error) {
            res.status(400).json({ message: 'Error logging in', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}