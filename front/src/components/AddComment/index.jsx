import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Button, TextField, Box, CircularProgress, Snackbar } from "@mui/material";
import axios from "../../axios";
import Alert from "@mui/material/Alert";

export const AddComment = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector(state => state.auth.data?.UseData);

  const handleSubmit = async () => {
    try {
      if (!text.trim()) {
        setError("Комментарий не может быть пустым");
        return;
      }
      if (!currentUser?._id) {
        setError("Требуется авторизация");
        return;
      }

      setIsSubmitting(true);
      setError(null);
      
      const response = await axios.post("/createComment", {
        text,
        postId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const newComment = {
        ...response.data,
      };

      onCommentAdded(newComment);
      setText("");

    } catch (err) {
      console.error("Ошибка отправки комментария:", err);
      setError(err.response?.data?.message || "Не удалось отправить комментарий");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => setError(null);

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 3, alignItems: 'flex-start' }}>
      <Avatar src={currentUser?.avatarUrl} />
      <Box sx={{ flexGrow: 1 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написать комментарий..."
          disabled={isSubmitting}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!text.trim() || isSubmitting}
          sx={{ mt: 1 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Отправить'}
        </Button>
      </Box>


      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};