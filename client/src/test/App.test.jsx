import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing and displays route content', () => {
    render(<App />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
