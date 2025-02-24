import axios from 'axios';
import { fetchTasks, deleteTask, markTaskAsDone, addTask, updateTask } from '../api/TaskApi';

jest.mock('axios');

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

describe('Task API functions', () => {
  it('fetchTasks should return data on successful API call', async () => {
    const mockData = [{ id: 1, title: 'Test Task', description: 'Test Description' }];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchTasks();
    expect(result).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(BASE_URL);
  });

  it('deleteTask should call axios.delete with the correct URL', async () => {
    const taskId = 1;
    axios.delete.mockResolvedValue({});

    await deleteTask(taskId);
    expect(axios.delete).toHaveBeenCalledWith(`${BASE_URL}/${taskId}`);
  });

  it('markTaskAsDone should call axios.put with the correct URL', async () => {
    const taskId = 1;
    axios.put.mockResolvedValue({});

    await markTaskAsDone(taskId);
    expect(axios.put).toHaveBeenCalledWith(`${BASE_URL}/${taskId}/done`);
  });

  it('addTask should call axios.post with the correct data', async () => {
    const task = { title: 'New Task', description: 'New Task Description' };
    axios.post.mockResolvedValue({});

    await addTask(task);
    expect(axios.post).toHaveBeenCalledWith(BASE_URL, task);
  });

  it('updateTask should call axios.put with the correct URL and data', async () => {
    const taskId = 1;
    const updatedTask = { title: 'Updated Task', description: 'Updated Description' };
    axios.put.mockResolvedValue({});

    await updateTask(taskId, updatedTask);
    expect(axios.put).toHaveBeenCalledWith(`${BASE_URL}/${taskId}`, updatedTask);
  });
});
