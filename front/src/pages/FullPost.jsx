import { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { fetchPosts, fetchTags } from '../redux/slices/post';
import {
  Alert,
  CircularProgress,
  Box
} from "@mui/material";
import { useSelector } from "react-redux";

export const FullPost = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const posts = useSelector(state => state.posts.posts.items);
  const [currentPostIndex, setCurrentPostIndex] = useState(-1);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const index = posts.findIndex(p => p._id === id);
      setCurrentPostIndex(index);
    }
  }, [posts, id]);

  useEffect(() => {
    if (!id) {
      setError("Отсутствует ID поста");
      setIsLoading(false);
      return;
    }

    if (currentPostIndex !== -1 && posts && posts[currentPostIndex]) {
      setPost(posts[currentPostIndex]);
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`/posts/${id}`);
        
        if (!response.data) {
          throw new Error("Пост не найден");
        }

        setPost(response.data);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError(err.response?.data?.message || err.message || "Ошибка сервера");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, currentPostIndex, posts]);

  const handleCommentAdded = (newComment) => {
    setPost(prev => ({
      ...prev,
      comments: [{
        ...newComment,
        createdAt: new Date().toISOString()
      }, ...(prev.comments || [])],
      commentsCount: (prev.commentsCount || 0) + 1
    }));
    dispatch(fetchPosts());
  };

  const comments = post?.comments || [];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error} - Вы будете перенаправлены на главную страницу
      </Alert>
    );
  }

  if (!post) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Пост не найден
      </Alert>
    );
  }

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl ? `${axios.defaults.baseURL}${post.imageUrl}` : ""}
        createdAt={post.createdAt}
        viewsCount={post.viewsCount}
        commentsCount={post.comments?.length || 0}
        user={post.user}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      
      <CommentsBlock
        items={comments.map(comment => ({
          user: {
            fullName: comment.fullName|| "Аноним",
            avatarUrl: comment.avatarUrl || "https://mui.com/static/images/avatar/1.jpg",
          },
          text: comment.text,
          createdAt: comment.createdAt
        }))}
        isLoading={false}
      >
        <AddComment postId={id} onCommentAdded={handleCommentAdded} />
      </CommentsBlock>
    </>
  );
};