import React, { useState } from 'react';
import { Link } from "react-router-dom";
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteFilledIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { fetchRemovePosts } from '../../redux/slices/post';
import axios from "../../axios"

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  likesCount: initialLikesCount = 0, // переименовываем пропс
  commentsCount,
  isLiked: initialIsLiked = false,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
}) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentLikesCount, setCurrentLikesCount] = useState(initialLikesCount); // используем переименованное значение

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm("Вы точно хотите удалить статью")) {
      dispatch(fetchRemovePosts(id));
    }
  };

  const handleLike = async () => {
    try {
      setIsAnimating(true);
      const newIsLiked = !isLiked;
      
      if (newIsLiked) {
        const response = await axios.post(
          "/likePost",
          { id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setCurrentLikesCount(response.data.likesCount);
      } else {
        // Добавьте здесь запрос для удаления лайка, если нужно
        setCurrentLikesCount(prev => prev - 1);
      }
      
      setIsLiked(newIsLiked);
    } catch (err) {
      console.error("Ошибка лайка:", err);
      setIsLiked(initialIsLiked);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
            <li className={styles.likeItem}>
              <IconButton 
                onClick={handleLike}
                disabled={isAnimating}
                className={clsx({
                  [styles.likeButton]: true,
                  [styles.animate]: isAnimating,
                })}
              >
                {isLiked ? (
                  <FavoriteFilledIcon color="error" />
                ) : (
                  <FavoriteIcon />
                )}
              </IconButton>
              <span>{currentLikesCount}</span> 
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};