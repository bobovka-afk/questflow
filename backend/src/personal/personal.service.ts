import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HabitPolarity } from '../generated/prisma/enums';
import { DAILY_ACTIVITY_XP_MAX } from '../gamification/config/rewards';
import { getTodayGameDayKey } from '../gamification/core/game-day';
import { resolveGameDayTimeZone } from '../gamification/lib/resolve-game-day-timezone';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import { HABIT_ONBOARDING_PRESETS, DAILY_ONBOARDING_PRESETS } from './config/habit-presets';
import {
  CreatePersonalHabitDto,
  CreatePersonalDailyDto,
  CreatePersonalTodoDto,
  UpdatePersonalHabitDto,
  UpdatePersonalDailyDto,
  UpdatePersonalTodoDto,
  ReorderPersonalDto,
} from './dto/personal.dto';

@Injectable()
export class PersonalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getTimeZone(): string {
    return resolveGameDayTimeZone(this.configService.get<string>('GAME_DAY_TZ'));
  }

  async getBoard(userId: number) {
    const tz = this.getTimeZone();
    const todayKey = getTodayGameDayKey(tz);
    const todayStr = todayKey.toISOString().slice(0, 10);

    const [habits, dailies, todos, character] = await Promise.all([
        this.prisma.personalHabit.findMany({
          where: { userId, archivedAt: null },
          orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        }),
        this.prisma.personalDaily.findMany({
          where: { userId, archivedAt: null },
          orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        }),
        this.prisma.personalTodo.findMany({
          where: { userId, archivedAt: null, isCompleted: false },
          orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        }),
        this.prisma.character.findUnique({
          where: { userId },
          select: { dailyActivityXpEarned: true },
        }),
      ]);

    return {
      dayKey: todayStr,
      stats: {
        activityXpToday: character?.dailyActivityXpEarned ?? 0,
        activityXpMax: DAILY_ACTIVITY_XP_MAX,
      },
      habits: habits.map((h) => this.mapHabit(h)),
      dailies: dailies.map((d) => ({
        ...this.mapDaily(d),
        completedToday:
          d.lastCompletedDayKey?.toISOString().slice(0, 10) === todayStr,
      })),
      todos: todos.map((t) => this.mapTodo(t)),
    };
  }

  async createHabit(userId: number, dto: CreatePersonalHabitDto) {
    const maxOrder = await this.prisma.personalHabit.aggregate({
      where: { userId, archivedAt: null },
      _max: { sortOrder: true },
    });
    const habit = await this.prisma.personalHabit.create({
      data: {
        userId,
        title: dto.title.trim(),
        polarity: dto.polarity ?? HabitPolarity.BOTH,
        emoji: dto.emoji ?? null,
        color: dto.color ?? null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
    return this.mapHabit(habit);
  }

  async updateHabit(userId: number, id: number, dto: UpdatePersonalHabitDto) {
    await this.assertHabit(userId, id);
    const habit = await this.prisma.personalHabit.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.polarity !== undefined ? { polarity: dto.polarity } : {}),
        ...(dto.emoji !== undefined ? { emoji: dto.emoji } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.archived === true ? { archivedAt: new Date() } : {}),
      },
    });
    return this.mapHabit(habit);
  }

  async reorderHabits(userId: number, dto: ReorderPersonalDto) {
    await this.reorder(userId, 'personalHabit', dto.orderedIds);
    return { ok: true as const };
  }

  async createDaily(userId: number, dto: CreatePersonalDailyDto) {
    const maxOrder = await this.prisma.personalDaily.aggregate({
      where: { userId, archivedAt: null },
      _max: { sortOrder: true },
    });
    const daily = await this.prisma.personalDaily.create({
      data: {
        userId,
        title: dto.title.trim(),
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
    return this.mapDaily(daily);
  }

  async updateDaily(userId: number, id: number, dto: UpdatePersonalDailyDto) {
    await this.assertDaily(userId, id);
    const daily = await this.prisma.personalDaily.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.archived === true ? { archivedAt: new Date() } : {}),
      },
    });
    return this.mapDaily(daily);
  }

  async reorderDailies(userId: number, dto: ReorderPersonalDto) {
    await this.reorder(userId, 'personalDaily', dto.orderedIds);
    return { ok: true as const };
  }

  async createTodo(userId: number, dto: CreatePersonalTodoDto) {
    const maxOrder = await this.prisma.personalTodo.aggregate({
      where: { userId, archivedAt: null, isCompleted: false },
      _max: { sortOrder: true },
    });
    const todo = await this.prisma.personalTodo.create({
      data: {
        userId,
        title: dto.title.trim(),
        notes: dto.notes?.trim() || null,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });
    return this.mapTodo(todo);
  }

  async updateTodo(userId: number, id: number, dto: UpdatePersonalTodoDto) {
    await this.assertTodo(userId, id);
    const todo = await this.prisma.personalTodo.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes?.trim() || null } : {}),
        ...(dto.dueAt !== undefined
          ? { dueAt: dto.dueAt ? new Date(dto.dueAt) : null }
          : {}),
        ...(dto.archived === true ? { archivedAt: new Date() } : {}),
      },
    });
    return this.mapTodo(todo);
  }

  async reorderTodos(userId: number, dto: ReorderPersonalDto) {
    await this.reorder(userId, 'personalTodo', dto.orderedIds);
    return { ok: true as const };
  }

  async listCompletedTodos(userId: number, pagination: PaginationDto) {
    const where = { userId, archivedAt: null, isCompleted: true };
    const [todos, total] = await Promise.all([
      this.prisma.personalTodo.findMany({
        where,
        orderBy: [{ completedAt: 'desc' }, { id: 'desc' }],
        take: pagination.limit,
        skip: pagination.offset,
      }),
      this.prisma.personalTodo.count({ where }),
    ]);
    return {
      items: todos.map((t) => this.mapTodo(t)),
      total,
      limit: pagination.limit,
      offset: pagination.offset,
    };
  }

  async applyOnboardingPresets(userId: number) {
    const existing = await this.prisma.personalHabit.count({ where: { userId } });
    if (existing > 0) {
      return { ok: true as const, skipped: true };
    }
    await this.prisma.$transaction(async (tx) => {
      for (let i = 0; i < HABIT_ONBOARDING_PRESETS.length; i += 1) {
        const preset = HABIT_ONBOARDING_PRESETS[i];
        await tx.personalHabit.create({
          data: {
            userId,
            title: preset.title,
            polarity: preset.polarity,
            sortOrder: i,
          },
        });
      }
      for (let i = 0; i < DAILY_ONBOARDING_PRESETS.length; i += 1) {
        const preset = DAILY_ONBOARDING_PRESETS[i];
        await tx.personalDaily.create({
          data: {
            userId,
            title: preset.title,
            sortOrder: i,
          },
        });
      }
    });
    return { ok: true as const, skipped: false };
  }

  private async reorder(
    userId: number,
    model: 'personalHabit' | 'personalDaily' | 'personalTodo',
    orderedIds: number[],
  ) {
    const findMany =
      model === 'personalHabit'
        ? this.prisma.personalHabit.findMany.bind(this.prisma.personalHabit)
        : model === 'personalDaily'
          ? this.prisma.personalDaily.findMany.bind(this.prisma.personalDaily)
          : this.prisma.personalTodo.findMany.bind(this.prisma.personalTodo);
    const update =
      model === 'personalHabit'
        ? this.prisma.personalHabit.update.bind(this.prisma.personalHabit)
        : model === 'personalDaily'
          ? this.prisma.personalDaily.update.bind(this.prisma.personalDaily)
          : this.prisma.personalTodo.update.bind(this.prisma.personalTodo);

    const rows = await findMany({
      where: { userId, archivedAt: null, id: { in: orderedIds } },
      select: { id: true },
    });
    if (rows.length !== orderedIds.length) {
      throw new NotFoundException({
        code: 'PERSONAL_REORDER_INVALID',
        message: 'Invalid reorder ids',
      });
    }
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        update({ where: { id }, data: { sortOrder: index } }),
      ),
    );
  }

  private async assertHabit(userId: number, id: number) {
    const row = await this.prisma.personalHabit.findFirst({
      where: { id, userId, archivedAt: null },
    });
    if (!row) {
      throw new NotFoundException({ code: 'PERSONAL_HABIT_NOT_FOUND', message: 'Habit not found' });
    }
  }

  private async assertDaily(userId: number, id: number) {
    const row = await this.prisma.personalDaily.findFirst({
      where: { id, userId, archivedAt: null },
    });
    if (!row) {
      throw new NotFoundException({ code: 'PERSONAL_DAILY_NOT_FOUND', message: 'Daily not found' });
    }
  }

  private async assertTodo(userId: number, id: number) {
    const row = await this.prisma.personalTodo.findFirst({
      where: { id, userId, archivedAt: null },
    });
    if (!row) {
      throw new NotFoundException({ code: 'PERSONAL_TODO_NOT_FOUND', message: 'Todo not found' });
    }
  }

  private mapHabit(h: {
    id: number;
    title: string;
    polarity: HabitPolarity;
    emoji: string | null;
    color: string | null;
    sortOrder: number;
    streakCurrent: number;
    streakBest: number;
    positiveCount: number;
    negativeCount: number;
  }) {
    return {
      id: h.id,
      title: h.title,
      polarity: h.polarity,
      emoji: h.emoji,
      color: h.color,
      sortOrder: h.sortOrder,
      streakCurrent: h.streakCurrent,
      streakBest: h.streakBest,
      positiveCount: h.positiveCount,
      negativeCount: h.negativeCount,
    };
  }

  private mapDaily(d: {
    id: number;
    title: string;
    sortOrder: number;
    streakCurrent: number;
    streakBest: number;
    lastCompletedDayKey: Date | null;
  }) {
    return {
      id: d.id,
      title: d.title,
      sortOrder: d.sortOrder,
      streakCurrent: d.streakCurrent,
      streakBest: d.streakBest,
      lastCompletedDayKey: d.lastCompletedDayKey?.toISOString().slice(0, 10) ?? null,
    };
  }

  private mapTodo(t: {
    id: number;
    title: string;
    notes: string | null;
    dueAt: Date | null;
    isCompleted: boolean;
    sortOrder: number;
    completedAt?: Date | null;
  }) {
    return {
      id: t.id,
      title: t.title,
      notes: t.notes,
      dueAt: t.dueAt?.toISOString() ?? null,
      isCompleted: t.isCompleted,
      sortOrder: t.sortOrder,
      completedAt: t.completedAt?.toISOString() ?? null,
    };
  }
}
