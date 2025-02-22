import { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import axios from "axios";


const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription]= useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/tasks", { title, description });
      onTaskAdded();
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: 3, width: "40%", backgroundColor: "#f9f9f9", borderRadius: 3 }}> 
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
        Add a New Task
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Title" variant="outlined" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField label="Description" variant="outlined" multiline rows={3} fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button variant="contained" sx={{ backgroundColor: "#1976d2", color: "#fff", borderRadius: 2 }} type="submit">
          Add Task
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskForm;