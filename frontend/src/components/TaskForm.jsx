import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, useMediaQuery } from '@mui/material';
import CustomSnackbar from './CustomSnackbar';
import { addTask, updateTask } from '../api/TaskApi';


const TaskForm = ({ onTaskAdded, selectedTask, clearSelectedTask, handleCloseDialog }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
    } else {
      setTitle('');
      setDescription('');
    }
    setErrors({ title: '', description: '' });
  }, [selectedTask]);

  const validateForm = () => {
    let newErrors = { title: '', description: '' };

    if (!title.trim()) newErrors.title = 'Title is required.';
    else if (title.length > 50) newErrors.title = 'Title cannot exceed 50 characters.';

    if (!description.trim()) newErrors.description = 'Description is required.';
    else if (description.length > 255) newErrors.description = 'Description cannot exceed 255 characters.';

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, { title, description });
        setSnackbarMessage('Task updated successfully!');
        setSnackbarSeverity('success');
      } else {
        await addTask({ title, description });
        setSnackbarMessage('Task added successfully!');
        setSnackbarSeverity('success');
      }
      setOpenSnackbar(true);
      onTaskAdded();
      clearSelectedTask();
      clearForm();
    } catch (error) {
      console.error('Error:', error);

      
      if (error.response) {
        setSnackbarMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setSnackbarMessage('Network error. Please check your connection.');
      } else {
        setSnackbarMessage('An unexpected error occurred. Please try again.');
      }

      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    clearSelectedTask();
    setErrors({ title: '', description: '' });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={6} sx={{ p: 3, width: isMobile ? 'auto' : '40%', backgroundColor: '#f9f9f9', borderRadius: 3, position: isMobile ? 'static' : 'sticky', top: 20 }}>
      <Typography 
        variant={isMobile ? 'h6' : 'h5'} 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: '#333', 
          textAlign: 'center',
          fontSize: isMobile ? '1.3rem' : '1.6rem' 
        }}
      >
        {selectedTask ? 'Edit Task' : 'Add a New Task'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
          name="title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          sx={{ fontSize: isMobile ? "0.65rem": "0.875rem" }} 
        />
        <TextField
          label="Description"
          name="description"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ fontSize: isMobile ? "0.65rem": "0.875rem" }} 
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button 
              variant="outlined" 
              sx={{ borderRadius: 2, fontSize: isMobile ? "0.65rem": "0.875rem", padding: isMobile ? "4px 8px" : "6px 12px" }} 
              onClick={!isMobile ? clearForm : handleCloseDialog}
            >
              Cancel
            </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: 2, fontSize: isMobile ? "0.65rem": "0.875rem", padding: isMobile ? "4px 8px" : "6px 12px" }}
            type="submit"
            disabled={!title.trim() || !description.trim()}
          >
            Save
          </Button>
        </Box>
      </Box>

      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </Paper>
  );
};

export default TaskForm;