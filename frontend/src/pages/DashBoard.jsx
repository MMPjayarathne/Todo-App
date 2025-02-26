import React, { useState } from 'react';
import { Box, Dialog, Fab, useMediaQuery, DialogTitle, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';


const DashBoard = () => {
  const [reload, setReload] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);
  
  const isMobile = useMediaQuery("(max-width:768px)");

  const refreshTasks = () => setReload(!reload);
  
  const handleEdit = (task) => {
    console.log("Task to edit:", task);
    setSelectedTask(task);
    setOpen(true);
  };

  const clearSelectedTask = () => {
    setSelectedTask(null); 
  };

  const handleOpenDialog = () => {
    setSelectedTask(null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "start", 
        gap: 4, 
        padding: 4, 
        paddingX: isMobile ? "5%" : "10%", 
        backgroundColor: "#f0f0f0",
        flexDirection: isMobile ? "column" : "row"
      }}
    >
     
      {!isMobile && <TaskForm onTaskAdded={refreshTasks} selectedTask={selectedTask}  clearSelectedTask={clearSelectedTask}  />}

      <TaskList key={reload} onEdit={handleEdit} />

      {isMobile && (
        <Fab 
          color="primary" 
          name="addIcon"
          aria-label="add" 
          sx={{ 
            position: "fixed", 
            bottom: 16, 
            right: 16 
          }} 
          onClick={handleOpenDialog}
        >
          <AddIcon />
        </Fab>
      )}
      
      {isMobile && (
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">  
          <TaskForm 
            onTaskAdded={() => { refreshTasks(); handleCloseDialog(); }} 
            handleCloseDialog={handleCloseDialog} 
            selectedTask={selectedTask} 
            clearSelectedTask={clearSelectedTask}  
          />
        </Dialog>
      )}
    </Box>
  );
};

export default DashBoard;
