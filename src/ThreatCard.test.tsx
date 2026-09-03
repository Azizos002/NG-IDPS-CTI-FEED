import React from 'react';
import { render, screen } from '@testing-library/react';
import ThreatCard from '@/components/ThreatCard';
import { Actuality } from '@/models/actuality';

const sample: Actuality = {
  id: '1',
  title: 'Threat One',
  summary: 'Summary',
  content: 'Details',
  type: 'TECHNICAL_THREAT',
  severity: 'HIGH',
  status: 'PUBLISHED',
  tags: ['t1'],
  iocs: [],
  references: [],
  createdAt: new Date().toISOString(),
};

describe('ThreatCard', () => {
  test('renders title and summary', () => {
    render(<ThreatCard a={sample} />);
    expect(screen.getByText('Threat One')).toBeTruthy();
    expect(screen.getByText('Summary')).toBeTruthy();
  });
});
