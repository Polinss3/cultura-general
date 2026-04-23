export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
  unlocked: boolean;
}

interface ProfileStats {
  total_answered?: number;
  total_correct?: number;
  streak?: number;
  best_streak?: number;
  speed_record?: number;
}

export function computeAchievements(profile: ProfileStats | null): Achievement[] {
  const answered = profile?.total_answered ?? 0;
  const correct = profile?.total_correct ?? 0;
  const bestStreak = profile?.best_streak ?? 0;
  const speedRecord = profile?.speed_record ?? 0;
  const accuracy = answered > 0 ? correct / answered : 0;

  return [
    {
      id: 'first_answer',
      icon: '🎯',
      title: 'Primera respuesta',
      desc: 'Responde tu primera pregunta',
      color: '#e8a030',
      unlocked: answered >= 1,
    },
    {
      id: 'ten_answers',
      icon: '📚',
      title: 'Estudiante',
      desc: '10 preguntas respondidas',
      color: '#2ec87a',
      unlocked: answered >= 10,
    },
    {
      id: 'hundred_answers',
      icon: '🏛️',
      title: 'Erudito',
      desc: '100 preguntas respondidas',
      color: '#a030e8',
      unlocked: answered >= 100,
    },
    {
      id: 'five_hundred_answers',
      icon: '🧠',
      title: 'Genio',
      desc: '500 preguntas respondidas',
      color: '#e83060',
      unlocked: answered >= 500,
    },
    {
      id: 'streak_3',
      icon: '🔥',
      title: 'En racha',
      desc: 'Racha máxima de 3 días',
      color: '#e8a030',
      unlocked: bestStreak >= 3,
    },
    {
      id: 'streak_7',
      icon: '⚡',
      title: 'Imparable',
      desc: 'Racha máxima de 7 días',
      color: '#a030e8',
      unlocked: bestStreak >= 7,
    },
    {
      id: 'streak_30',
      icon: '👑',
      title: 'Leyenda',
      desc: 'Racha máxima de 30 días',
      color: '#e8a030',
      unlocked: bestStreak >= 30,
    },
    {
      id: 'accuracy_80',
      icon: '🎓',
      title: 'Precisión',
      desc: '80% de aciertos (mín. 20 preguntas)',
      color: '#2ec87a',
      unlocked: answered >= 20 && accuracy >= 0.8,
    },
    {
      id: 'accuracy_95',
      icon: '💎',
      title: 'Perfeccionista',
      desc: '95% de aciertos (mín. 50 preguntas)',
      color: '#30a8e8',
      unlocked: answered >= 50 && accuracy >= 0.95,
    },
    {
      id: 'speed_5',
      icon: '🏃',
      title: 'Velocista',
      desc: '5 aciertos en modo rápido',
      color: '#a030e8',
      unlocked: speedRecord >= 5,
    },
    {
      id: 'speed_10',
      icon: '🚀',
      title: 'Cohete',
      desc: '10 aciertos en modo rápido',
      color: '#30a8e8',
      unlocked: speedRecord >= 10,
    },
    {
      id: 'speed_20',
      icon: '🏆',
      title: 'Campeón',
      desc: '20 aciertos en modo rápido',
      color: '#e8a030',
      unlocked: speedRecord >= 20,
    },
  ];
}

export function unlockedCount(profile: ProfileStats | null): number {
  return computeAchievements(profile).filter(a => a.unlocked).length;
}
