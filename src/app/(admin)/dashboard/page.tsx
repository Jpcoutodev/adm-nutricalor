import { supabase } from '@/lib/supabase';
import styles from './page.module.css';
import { Users, Utensils, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let usersCount = 0;
  let mealsCount = 0;
  let onboardingCount = 0;

  try {
    const [profilesRes, mealsRes, onboardingRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('meals').select('*', { count: 'exact', head: true }),
      supabase.from('onboarding_events').select('*', { count: 'exact', head: true })
    ]);
    usersCount = profilesRes.count || 0;
    mealsCount = mealsRes.count || 0;
    onboardingCount = onboardingRes.count || 0;
  } catch (error) {
    console.error('Erro ao buscar dados do Supabase:', error);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral da plataforma</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Users size={24} />
            </div>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>Total de Usuários</p>
            <h2 className={styles.cardValue}>{usersCount || 0}</h2>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Utensils size={24} />
            </div>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>Refeições Registradas</p>
            <h2 className={styles.cardValue}>{mealsCount || 0}</h2>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIconWrapper} style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <ArrowUpRight size={24} />
            </div>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.cardLabel}>Eventos de Onboarding</p>
            <h2 className={styles.cardValue}>{onboardingCount || 0}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
