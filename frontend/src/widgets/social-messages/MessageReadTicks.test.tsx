import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MessageReadTicks } from './MessageReadTicks';

describe('MessageReadTicks', () => {
  it('shows single check when not read', () => {
    render(<MessageReadTicks read={false} />);
    expect(screen.getByLabelText('Доставлено')).toBeInTheDocument();
    expect(screen.getAllByText('✓')).toHaveLength(1);
  });

  it('shows double check when read', () => {
    render(<MessageReadTicks read />);
    expect(screen.getByLabelText('Прочитано')).toBeInTheDocument();
    expect(screen.getAllByText('✓')).toHaveLength(2);
  });
});
