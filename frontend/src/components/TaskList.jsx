import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Delete, CheckCircle, Edit } from "@mui/icons-material";
import Lottie from "react-lottie";
import emptyAnimation from "../assets/empty.json";
import CustomSnackbar from "./CustomSnackbar";
import ConfirmationDialog from "./ConfirmationDialog";
import { formatDateTime } from "../helpers/TaskHelper";
import { fetchTasks, deleteTask, markTaskAsDone } from "../api/TaskApi";
import PropTypes from "prop-types";

const TaskList = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        if (error.response) {
          setSnackbarMessage(error.response.data.message || 'An error occurred. Please try again.');
        } else if (error.request) {
          setSnackbarMessage('Network error. Please check your connection.');
        } else {
          setSnackbarMessage('An unexpected error occurred. Please try again.');
        }
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      setLoading(false);
    };
    getTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setSnackbarMessage("Task deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTasks(await fetchTasks()); 
    } catch (error) {
      if (error.response) {
        setSnackbarMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setSnackbarMessage('Network error. Please check your connection.');
      } else {
        setSnackbarMessage('An unexpected error occurred. Please try again.');
      }
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Error deleting task:", error);
    }
  };

  const handleDone = async (id) => {
    try {
      await markTaskAsDone(id);
      setSnackbarMessage("Task updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTasks(await fetchTasks()); 
    } catch (error) {
      if (error.response) {
        setSnackbarMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else if (error.request) {
        setSnackbarMessage('Network error. Please check your connection.');
      } else {
        setSnackbarMessage('An unexpected error occurred. Please try again.');
      }
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Error editing task:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenDialog = (taskId) => {
    setTaskToDelete(taskId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      handleDelete(taskToDelete);
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ width: isMobile ? "100%" : "50%", display: "flex", flexDirection: "column", gap: 2 }}>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && tasks.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Lottie
            options={{ animationData: emptyAnimation, loop: true, autoplay: true }}
            height={150}
            width={150}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#555" }}>
            No Tasks Available
          </Typography>
          <Typography variant="body2" sx={{ color: "#777" }}>
            Get started by adding a new task!
          </Typography>
        </Box>
      )}

      {!loading &&
        tasks.length > 0 &&
        tasks.map((task) => (
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
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}>
                  {task.title}
                </Typography>
              </Box>
              <IconButton name="editIcon" sx={{ color: "#1976d2" }} onClick={() => onEdit(task)}>
                <Edit fontSize="small" />
              </IconButton>
            </CardContent>

            <CardContent>
              <Typography color="text.secondary" variant={isMobile ? "caption" : "body2"}>
                {task.description}
              </Typography>
            </CardContent>

            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                {formatDateTime(task.updatedAt)}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: isMobile ? "0.65rem" : "0.875rem",
                    padding: isMobile ? "4px 8px" : "6px 12px",
                    minWidth: "80px",
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
                    fontSize: isMobile ? "0.65rem" : "0.875rem",
                    padding: isMobile ? "4px 8px" : "6px 12px",
                    minWidth: "80px",
                  }}
                  onClick={() => handleOpenDialog(task.id)}
                >
                  <Delete /> Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

      <CustomSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={handleCloseSnackbar} />
      <ConfirmationDialog open={openDialog} onClose={handleCloseDialog} onConfirm={handleConfirmDelete} message={`Are you sure you want to delete the task ${taskToDelete}?`} />
    </Box>
  );
};

TaskList.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

export default TaskList;
