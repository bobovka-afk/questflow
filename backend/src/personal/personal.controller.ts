import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import type { AuthedRequest } from '../common/type';
import {
  CreatePersonalDailyDto,
  CreatePersonalHabitDto,
  CreatePersonalTodoDto,
  LogHabitDto,
  ReorderPersonalDto,
  UpdatePersonalDailyDto,
  UpdatePersonalHabitDto,
  UpdatePersonalTodoDto,
} from './dto/personal.dto';
import { PaginationDto } from '../workspace/dto/pagination.dto';
import { PersonalRewardService } from './personal-reward.service';
import { PersonalService } from './personal.service';

@ApiTags('personal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('personal')
export class PersonalController {
  constructor(
    private readonly personalService: PersonalService,
    private readonly personalRewardService: PersonalRewardService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Personal board summary' })
  getBoard(@Req() req: AuthedRequest) {
    return this.personalService.getBoard(req.user.id);
  }

  @Post('habits')
  createHabit(@Req() req: AuthedRequest, @Body() dto: CreatePersonalHabitDto) {
    return this.personalService.createHabit(req.user.id, dto);
  }

  @Patch('habits/:id')
  updateHabit(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonalHabitDto,
  ) {
    return this.personalService.updateHabit(req.user.id, id, dto);
  }

  @Post('habits/:id/log')
  logHabit(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: LogHabitDto,
  ) {
    return this.personalRewardService.logHabit(req.user.id, id, dto.direction);
  }

  @Post('habits/reorder')
  reorderHabits(@Req() req: AuthedRequest, @Body() dto: ReorderPersonalDto) {
    return this.personalService.reorderHabits(req.user.id, dto);
  }

  @Post('dailies')
  createDaily(@Req() req: AuthedRequest, @Body() dto: CreatePersonalDailyDto) {
    return this.personalService.createDaily(req.user.id, dto);
  }

  @Patch('dailies/:id')
  updateDaily(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonalDailyDto,
  ) {
    return this.personalService.updateDaily(req.user.id, id, dto);
  }

  @Post('dailies/:id/complete')
  completeDaily(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.personalRewardService.completeDaily(req.user.id, id);
  }

  @Post('dailies/reorder')
  reorderDailies(@Req() req: AuthedRequest, @Body() dto: ReorderPersonalDto) {
    return this.personalService.reorderDailies(req.user.id, dto);
  }

  @Post('todos')
  createTodo(@Req() req: AuthedRequest, @Body() dto: CreatePersonalTodoDto) {
    return this.personalService.createTodo(req.user.id, dto);
  }

  @Get('todos/completed')
  @ApiOperation({ summary: 'Completed personal todos (archive)' })
  listCompletedTodos(
    @Req() req: AuthedRequest,
    @Query() pagination: PaginationDto,
  ) {
    return this.personalService.listCompletedTodos(req.user.id, pagination);
  }

  @Patch('todos/:id')
  updateTodo(
    @Req() req: AuthedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonalTodoDto,
  ) {
    return this.personalService.updateTodo(req.user.id, id, dto);
  }

  @Post('todos/:id/complete')
  completeTodo(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.personalRewardService.completeTodo(req.user.id, id);
  }

  @Post('todos/:id/uncomplete')
  uncompleteTodo(@Req() req: AuthedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.personalRewardService.uncompleteTodo(req.user.id, id);
  }

  @Post('todos/reorder')
  reorderTodos(@Req() req: AuthedRequest, @Body() dto: ReorderPersonalDto) {
    return this.personalService.reorderTodos(req.user.id, dto);
  }

  @Post('onboarding/apply-presets')
  applyPresets(@Req() req: AuthedRequest) {
    return this.personalService.applyOnboardingPresets(req.user.id);
  }
}
