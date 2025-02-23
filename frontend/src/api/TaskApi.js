import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchTasks = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;  //No need to filterout top 5 task, backend is handling it, alternatively we could get all the tasks and use pagination.
  } catch (error) {
    throw new Error('Error fetching tasks: ' + error.message);
  }
};

export const deleteTask = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    throw new Error('Error deleting task: ' + error.message);
  }
};

export const markTaskAsDone = async (id) => {
  try {
    await axios.put(`${BASE_URL}/${id}/done`);
  } catch (error) {
    throw new Error('Error updating task: ' + error.message);
  }
};

export const addTask = async (task) => {
  try {
    await axios.post(BASE_URL, task);
  } catch (error) {
    throw new Error('Error adding task: ' + error.message);
  }
}

export const updateTask = async (id, task) => {
    try {
        await axios.put(`${BASE_URL}/${id}`, task);
    } catch (error) {
        throw new Error('Error updating task: ' + error.message);
    }
    }