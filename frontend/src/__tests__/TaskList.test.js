import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TaskList from '../components/TaskList';
import { fetchTasks } from '../api/TaskApi';

// Mock the API function
jest.mock('../api/TaskApi');
jest.mock('react-lottie', () => () => <div>Lottie Animation</div>);

describe('TaskList Component', () => {

  it('displays fetched tasks', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false, createdAt: '2023-10-01T12:00:00Z' }
    ];
    fetchTasks.mockResolvedValue(mockTasks);

    render(<TaskList onEdit={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  it('displays error message if fetching tasks fails', async () => {
    fetchTasks.mockRejectedValue(new Error('Failed to fetch'));

    render(<TaskList onEdit={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });
  });
});