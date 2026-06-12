import { HabitPolarity } from '../../generated/prisma/enums';

export const HABIT_ONBOARDING_PRESETS: {
  title: string;
  polarity: HabitPolarity;
}[] = [
  { title: 'Проверить почту', polarity: HabitPolarity.BOTH },
  { title: 'Прогулка 20 мин', polarity: HabitPolarity.POSITIVE },
  { title: 'Не есть после 20:00', polarity: HabitPolarity.NEGATIVE },
];

export const DAILY_ONBOARDING_PRESETS: { title: string }[] = [
  { title: 'Утренняя зарядка' },
  { title: '8 стаканов воды' },
];
