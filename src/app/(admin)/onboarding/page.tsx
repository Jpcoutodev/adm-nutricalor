import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  let events: any[] = [];

  try {
    const { data } = await supabase
      .from('onboarding_events')
      .select('session_id, step_name, step_index, created_at');
    events = data || [];
  } catch (error) {
    console.error('Erro ao buscar dados do Supabase:', error);
  }

  if (!events.length) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Funil de Onboarding</h1>
          <p className={styles.subtitle}>Nenhum evento registrado ainda.</p>
        </div>
      </div>
    );
  }

  // Cálculos do Funil
  // 1. Total de sessões únicas
  const uniqueSessions = new Set(events.map(e => e.session_id));
  const totalUsers = uniqueSessions.size;

  // 2. Agrupar sessões por etapa
  // Para cada step_name, vamos contar quantas sessions_ids únicas passaram por lá
  const stepsMap = new Map<string, { name: string, index: number, uniqueSessions: Set<string> }>();

  events.forEach(event => {
    if (!stepsMap.has(event.step_name)) {
      stepsMap.set(event.step_name, {
        name: event.step_name,
        index: event.step_index,
        uniqueSessions: new Set()
      });
    }
    stepsMap.get(event.step_name)?.uniqueSessions.add(event.session_id);
  });

  // Converter para array e ordenar pelo step_index
  const funnelSteps = Array.from(stepsMap.values()).sort((a, b) => a.index - b.index);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Funil de Onboarding</h1>
        <p className={styles.subtitle}>Análise de conversão dos usuários etapa por etapa.</p>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryLabel}>Total de Usuários (Sessões)</div>
        <div className={styles.summaryValue}>{totalUsers}</div>
      </div>

      <div className={styles.funnelContainer}>
        <h2 className={styles.funnelTitle}>Taxa de Conversão por Etapa</h2>
        <div className={styles.funnelList}>
          {funnelSteps.map((step, i) => {
            const count = step.uniqueSessions.size;
            const percentageTotal = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
            
            // Taxa de queda em relação à etapa anterior
            const prevCount = i === 0 ? totalUsers : funnelSteps[i - 1].uniqueSessions.size;
            const dropoffRate = prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0;

            return (
              <div key={step.name} className={styles.funnelStep}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepInfo}>
                    <span className={styles.stepIndex}>{step.index}</span>
                    <span className={styles.stepName}>{step.name}</span>
                  </div>
                  <div className={styles.stepStats}>
                    <span className={styles.stepCount}>{count} usuários</span>
                    <span className={styles.stepPercentage}>{percentageTotal}%</span>
                  </div>
                </div>
                
                {/* Barra de Progresso do Funil */}
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${percentageTotal}%` }}
                  ></div>
                </div>
                
                {/* Indicador de Abandono (Drop-off) */}
                {i > 0 && dropoffRate > 0 && (
                  <div className={styles.dropoffInfo}>
                    ↓ {dropoffRate}% de abandono em relação à etapa anterior
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
