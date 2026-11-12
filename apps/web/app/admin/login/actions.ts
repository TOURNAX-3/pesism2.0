'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminCookieName, expectedAdminToken, verifyAdminPassword } from '@/lib/admin-session';

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '/admin');

  if (!verifyAdminPassword(password)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  const token = await expectedAdminToken();
  store.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(adminCookieName());
  redirect('/admin/login');
}
