import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HttpExceptionFilter } from '../http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let logger: jest.Mocked<Pick<PinoLogger, 'error' | 'setContext'>>;
  let res: { status: jest.Mock; json: jest.Mock };

  beforeEach(() => {
    logger = {
      setContext: jest.fn(),
      error: jest.fn(),
    };
    filter = new HttpExceptionFilter(logger as unknown as PinoLogger);
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  const host = (req: Record<string, unknown>) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          originalUrl: '/test',
          headers: {},
          ...req,
        }),
        getResponse: () => res,
      }),
    }) as unknown as ArgumentsHost;

  it('formats HttpException with code', () => {
    const exception = new HttpException(
      { code: 'TEST_CODE', message: 'Bad' },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, host({ id: 'req-1' }));
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: 'Bad',
        code: 'TEST_CODE',
        requestId: 'req-1',
      }),
    );
  });

  it('masks 500 errors', () => {
    filter.catch(new Error('boom'), host({}));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Внутренняя ошибка сервера',
      }),
    );
  });

  it('formats validation message array', () => {
    const exception = new HttpException(
      { message: ['a', 'b'] },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    filter.catch(exception, host({}));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'a\nb' }),
    );
  });

  it('handles string exception response', () => {
    const exception = new HttpException('plain error', HttpStatus.FORBIDDEN);
    filter.catch(exception, host({}));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'plain error' }),
    );
  });

  it('passes gateway error message through', () => {
    const exception = new HttpException(
      { message: 'upstream down' },
      HttpStatus.BAD_GATEWAY,
    );
    filter.catch(exception, host({}));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'upstream down' }),
    );
  });
});
