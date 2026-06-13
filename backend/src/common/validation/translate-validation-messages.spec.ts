import {
  translateValidationMessageList,
  translateValidationMessages,
} from './translate-validation-messages';

describe('translateValidationMessages', () => {
  it('translates auth password errors', () => {
    expect(translateValidationMessages('Password is required.')).toBe('Укажите пароль.');
    expect(translateValidationMessages('Password must be at least 6 characters.')).toBe(
      'Пароль: минимум 6 символов.',
    );
  });

  it('translates multiple validation errors', () => {
    expect(
      translateValidationMessages(
        'Password must be at least 6 characters., Password is required.',
      ),
    ).toBe('Пароль: минимум 6 символов.\nУкажите пароль.');
  });

  it('translates class-validator defaults', () => {
    expect(translateValidationMessages('title must be longer than or equal to 1 characters')).toBe(
      'Название: минимум 1 символов.',
    );
    expect(translateValidationMessages('title must be longer than or equal to 3 characters')).toBe(
      'Название: минимум 3 символов.',
    );
    expect(translateValidationMessages('property foo should not exist')).toBe('Лишнее поле: foo');
  });

  it('passes through already russian text', () => {
    expect(translateValidationMessages('Укажите пароль.')).toBe('Укажите пароль.');
  });

  it('normalizes comma artifacts in russian validation text', () => {
    expect(
      translateValidationMessages(
        'Укажите корректный email., Пароль: минимум 6 символов., Укажите пароль.',
      ),
    ).toBe(
      'Укажите корректный email.\nПароль: минимум 6 символов.\nУкажите пароль.',
    );
  });
});

describe('translateValidationMessageList', () => {
  it('returns single string for one message', () => {
    expect(translateValidationMessageList(['Password is required.'])).toBe('Укажите пароль.');
  });

  it('returns array for multiple messages', () => {
    expect(
      translateValidationMessageList(['Password is required.', 'Email is required.']),
    ).toEqual(['Укажите пароль.', 'Укажите email.']);
  });
});
