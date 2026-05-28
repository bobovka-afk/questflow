import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckinStreakCounter } from './CheckinStreakCounter';

describe('CheckinStreakCounter', () => {
  it('renders streak value and aria label', () => {
    render(<CheckinStreakCounter streak={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByLabelText('Серия: 5 дней')).toBeInTheDocument();
  });

  it('adds rolling class when streak increases', () => {
    const { container } = render(<CheckinStreakCounter streak={10} animateFrom={9} />);
    const root = container.querySelector('.trello-checkin-streak');
    expect(root).toHaveClass('trello-checkin-streak--rolling');
  });
});
