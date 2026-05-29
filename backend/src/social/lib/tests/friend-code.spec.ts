import {
  FRIEND_CODE_MAX,
  FRIEND_CODE_MIN,
  formatFriendCode,
  parseFriendCodeInput,
  randomFriendCode,
} from '../friend-code';

describe('friend-code', () => {
  it('formatFriendCode prefixes hash', () => {
    expect(formatFriendCode(1492)).toBe('#1492');
  });

  it('parseFriendCodeInput accepts number and #string', () => {
    expect(parseFriendCodeInput(1492)).toBe(1492);
    expect(parseFriendCodeInput('#1492')).toBe(1492);
    expect(parseFriendCodeInput('1492')).toBe(1492);
  });

  it('parseFriendCodeInput rejects invalid', () => {
    expect(parseFriendCodeInput('12')).toBeNull();
    expect(parseFriendCodeInput('12345')).toBeNull();
    expect(parseFriendCodeInput(999)).toBeNull();
    expect(parseFriendCodeInput(FRIEND_CODE_MAX + 1)).toBeNull();
  });

  it('randomFriendCode stays in range', () => {
    for (let i = 0; i < 50; i++) {
      const code = randomFriendCode();
      expect(code).toBeGreaterThanOrEqual(FRIEND_CODE_MIN);
      expect(code).toBeLessThanOrEqual(FRIEND_CODE_MAX);
    }
  });
});
