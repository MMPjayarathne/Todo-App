import { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, useMediaQuery, IconButton } from '@mui/material';
import axios from 'axios';
import CustomSnackbar from './CustomSnackbar';
import CloseIcon from '@mui/icons-material/Close'; 

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
        await axios.put(`http://localhost:8080/api/tasks/${selectedTask.id}`, { title, description });
        setSnackbarMessage('Task updated successfully!');
        setSnackbarSeverity('success');
      } else {
        await axios.post('http://localhost:8080/api/tasks', { title, description });
        setSnackbarMessage('Task added successfully!');
        setSnackbarSeverity('success');
      }
      setOpenSnackbar(true);
      onTaskAdded();
      clearSelectedTask();
      clearForm();
    } catch (error) {
      setSnackbarMessage('Error adding or updating task!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Error adding task:', error);
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
          fontSize: isMobile ? '1.3rem' : '1.6rem' // Adjust font size based on screen size
        }}
      >
        {selectedTask ? 'Edit Task' : 'Add a New Task'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Title"
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
              sx={{ borderRadius: 2, fontSize: isMobile ? "0.65rem": "0.875rem", padding: isMobile? "4px 8px" : "6px 12px", }} 
              onClick={!isMobile ? clearForm  : handleCloseDialog}
            >
              {isMobile? "Cancle" : "Clear"}
            </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: 2, fontSize: isMobile ? "0.65rem": "0.875rem", padding: isMobile? "4px 8px" : "6px 12px", }}
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
