import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import { addTask, updateTask } from '../api/TaskApi';

jest.mock('../api/TaskApi');

describe('TaskForm Component', () => {
  let onTaskAdded, clearSelectedTask, handleCloseDialog;

  beforeEach(() => {
    onTaskAdded = jest.fn();
    clearSelectedTask = jest.fn();
    handleCloseDialog = jest.fn();
  });

  it('renders the form with initial empty values', () => {
    render(
      <TaskForm
        onTaskAdded={onTaskAdded}
        selectedTask={null}
        clearSelectedTask={clearSelectedTask}
        handleCloseDialog={handleCloseDialog}
      />
    );

    expect(screen.getByLabelText(/Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
  });

  it('calls addTask API function when adding a new task', async () => {
    addTask.mockResolvedValue({});

    render(
      <TaskForm
        onTaskAdded={onTaskAdded}
        selectedTask={null}
        clearSelectedTask={clearSelectedTask}
        handleCloseDialog={handleCloseDialog}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(addTask).toHaveBeenCalledWith({ title: 'Test Task', description: 'Test Description' });
    });
    expect(onTaskAdded).toHaveBeenCalled();
  });

  it('displays an error message when API call fails', async () => {
    // Mock console.error to suppress error logs
    jest.spyOn(console, 'error').mockImplementation(() => {});

    addTask.mockRejectedValue(new Error('Failed to add task'));

    render(
      <TaskForm
        onTaskAdded={onTaskAdded}
        selectedTask={null}
        clearSelectedTask={clearSelectedTask}
        handleCloseDialog={handleCloseDialog}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByText(/Save/i));

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });

    // Restore console.error
    console.error.mockRestore();
  });

  it('clears the form when the clear button is clicked', () => {
    render(
      <TaskForm
        onTaskAdded={onTaskAdded}
        selectedTask={null}
        clearSelectedTask={clearSelectedTask}
        handleCloseDialog={handleCloseDialog}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Description' } });

    // Use the correct button text based on the screen size
    const clearButton = screen.getByRole('button', { name: /Clear|Cancel/i });
    fireEvent.click(clearButton);

    expect(screen.getByLabelText(/Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
  });
});