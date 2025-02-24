import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-lottie', () => () => <div>Lottie Animation</div>);

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Add a New Task/i)).toBeInTheDocument();
  });
});