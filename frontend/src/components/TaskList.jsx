import { useEffect, useState } from "react";
import {Typography, Box, Card, CardContent, CardActions, IconButton } from "@mui/material";
import axios from "axios";
import { Delete, CheckCircle } from "@mui/icons-material";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDone = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Box sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 2 }}>
      {tasks.map((task) => (
        <Card key={task.id} sx={{ backgroundColor: "#fff", borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>{task.title}</Typography>
            <Typography variant="body2" color="text.secondary">{task.description}</Typography>
          </CardContent>
          <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => handleDone(task.id)} sx={{ color: "#1976d2" }}>
              <CheckCircle />
            </IconButton>
            <IconButton onClick={() => handleDone(task.id)} sx={{ color: "red" }}>
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default TaskList;