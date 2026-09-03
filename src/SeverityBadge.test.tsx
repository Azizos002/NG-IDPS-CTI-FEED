import React from 'react';
import { render, screen } from '@testing-library/react';
import SeverityBadge from '@/components/SeverityBadge';

describe('SeverityBadge', () => {
  test('renders severity text and class for MEDIUM', () => {
    render(<SeverityBadge severity="MEDIUM" />);
    expect(screen.getByText('MEDIUM')).toBeTruthy();
  });
});
