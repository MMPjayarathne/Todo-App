import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { Delete, CheckCircle, Edit } from "@mui/icons-material";
import CustomSnackbar from "./CustomSnackbar";


const TaskList = ({onEdit}) => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tasks");
      console.log(response.data);
      setTasks(response.data); //No need to filterout top 5 task, backend is handling it, alternatively we could get all the tasks and use pagination.
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setSnackbarMessage('Task deleted successfully!');
      setSnackbarSeverity('success');
      fetchTasks();
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error deleting task!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error("Error deleting task:", error);
    }
  };

  const handleDone = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${id}/done`);
      setSnackbarMessage('Task updated successfully!');
      setSnackbarSeverity('success');
      fetchTasks();
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error updating task!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error("Error editing task:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  const formatDateTime = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString();
    const formattedTime = newDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  
    return (
      <>
        {formattedDate} <br /> {formattedTime}
      </>
    );
  };
  
  return (
    <Box sx={{ width: isMobile ? "100%":"50%", display: "flex", flexDirection: "column", gap: 2 }}>
      {tasks.map((task) => (
        <Card
          key={task.id}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            boxShadow: 3,
            padding: 2,
          }}
        >
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Typography  variant= {isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}>
                {task.title}
              </Typography>
            </Box>
            <IconButton sx={{ color: "#1976d2" }} onClick={() => onEdit(task)}>
              <Edit fontSize="small"/>
            </IconButton>
          </CardContent>
  
          <CardContent>
            <Typography color="text.secondary"  variant={isMobile ? "caption" : "body2"}>
              {task.description}
            </Typography>
          </CardContent>
  
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
              {formatDateTime(task.updatedAt)}
            </Typography>
            <Box sx={{ display: "flex", gap: 1,flexDirection: { xs: "column", sm: "row" } }}>
              <Button 
                variant="contained"
                color="success"
                sx={{ 
                  borderRadius: 2, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1,
                  fontSize: isMobile ? "0.65rem": "0.875rem",
                  padding: isMobile? "4px 8px" : "6px 12px",
                  minWidth: "80px"
                }}
                onClick={() => handleDone(task.id)}
              >
                <CheckCircle /> Done
              </Button>
              <Button 
                variant="contained"
                color="error"
                sx={{ 
                borderRadius: 2, 
                display: "flex", 
                alignItems: "center", 
                gap: 1,
                fontSize: isMobile ? "0.65rem": "0.875rem",
                padding: isMobile? "4px 8px" : "6px 12px",
                minWidth: "80px"
                }}
                onClick={() => handleDelete(task.id)}
              >
                <Delete /> Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

    <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </Box>

    
  );
}  

export default TaskList;
