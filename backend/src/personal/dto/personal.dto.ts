import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { HabitPolarity } from '../../generated/prisma/enums';

export class CreatePersonalHabitDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsEnum(HabitPolarity)
  polarity?: HabitPolarity;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  emoji?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  color?: string;
}

export class UpdatePersonalHabitDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsEnum(HabitPolarity)
  polarity?: HabitPolarity;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  emoji?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  color?: string | null;

  @IsOptional()
  archived?: boolean;
}

export class CreatePersonalDailyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;
}

export class UpdatePersonalDailyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  archived?: boolean;
}

export class CreatePersonalTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsString()
  dueAt?: string | null;
}

export class UpdatePersonalTodoDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;

  @IsOptional()
  @IsString()
  dueAt?: string | null;

  @IsOptional()
  archived?: boolean;
}

export class ReorderPersonalDto {
  @IsArray()
  @IsInt({ each: true })
  orderedIds!: number[];
}

export class LogHabitDto {
  @IsIn(['positive', 'negative'])
  direction!: 'positive' | 'negative';
}
