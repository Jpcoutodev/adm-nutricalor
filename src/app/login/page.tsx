'use client';

import { useActionState, useEffect } from 'react';
import { login } from '@/app/actions/auth';
import styles from './page.module.css';
import { Lock, Mail } from 'lucide-react';

const initialState = {
  error: null as string | null,
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      return { error: result.error };
    }
    return { error: null };
  }, initialState);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>NutriCalor Admin</div>
          <p className={styles.subtitle}>Faça login para acessar o painel</p>
        </div>

        <form action={formAction} className={styles.form}>
          {state.error && (
            <div className={styles.error}>
              {state.error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isPending}>
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
