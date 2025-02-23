import './App.css';
import { Box, Dialog, Fab, useMediaQuery, DialogTitle, IconButton } from "@mui/material";
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DashBoard from './pages/DashBoard';


const App = () => {
  
  return(
    <DashBoard/>
  )
};

export default App;
