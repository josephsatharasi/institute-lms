import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student batches heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /student batches/i })).toBeInTheDocument();
});
