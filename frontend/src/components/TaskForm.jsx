import { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import axios from "axios";

const TaskForm = ({ onTaskAdded, selectedTask, clearSelectedTask}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: "", description: "" });
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
    setErrors({ title: "", description: "" });
  }, [selectedTask]);

  const validateForm = () => {
    let newErrors = { title: "", description: "" };

    if (!title.trim()) newErrors.title = "Title is required.";
    else if (title.length > 50) newErrors.title = "Title cannot exceed 50 characters.";

    if (!description.trim()) newErrors.description = "Description is required.";
    else if (description.length > 255) newErrors.description = "Description cannot exceed 255 characters.";

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedTask) {
        await axios.put(`http://localhost:8080/api/tasks/${selectedTask.id}`, { title, description });
      } else {
        await axios.post("http://localhost:8080/api/tasks", { title, description });
      }
      onTaskAdded();
      clearSelectedTask();
      clearForm();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    clearSelectedTask();
    setErrors({ title: "", description: "" });
  };

  return (
    <Paper elevation={6} sx={{ p: 3, width: isMobile ? "90%":"40%", backgroundColor: "#f9f9f9", borderRadius: 3 }}>
      <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{  fontWeight: "bold", color: "#333", textAlign: "center" }}>
        {selectedTask ? "Edit Task" : "Add a New Task"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
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
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        { !selectedTask ? (
          <Button variant="outlined" sx={{ borderRadius: 2 }} onClick={clearForm}>
            Clear
          </Button>
          ):(
            <Button variant="outlined" sx={{ borderRadius: 2 }} onClick={clearForm}>
            Cancel
          </Button>
          )}
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", color: "#fff", borderRadius: 2 }}
            type="submit"
            disabled={!title.trim() || !description.trim()}
          >
            Save
            
          </Button>
          
        </Box>
      </Box>
    </Paper>
  );
};

export default TaskForm;
