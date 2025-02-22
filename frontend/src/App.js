import logo from './logo.svg';
import './App.css';

import { Container, Box } from "@mui/material";
import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

 
const App = () => {
  const [reload, setReload] = useState(false);

  const refreshTasks = () => setReload(!reload);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "start", height: "100vh", gap: 4, padding: 4, backgroundColor: "#f0f0f0" }}>
      <TaskForm onTaskAdded={refreshTasks} />
      <TaskList key={reload} />
    </Box>
  );
};

export default App;