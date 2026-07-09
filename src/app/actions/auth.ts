'use server';

import { encrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    // Autenticação bem sucedida
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 dia
    const session = await encrypt({ user: email, expires });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true });
    
    redirect('/dashboard');
  } else {
    // Autenticação falhou
    return { error: 'Email ou senha incorretos' };
  }
}
