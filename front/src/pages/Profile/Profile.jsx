import styles from "./style.css";
import notPhoto from './notPhoto.jpg';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchPosts } from '../../redux/slices/post';

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector(state => state.auth.data?.UseData._id);
  const user = useSelector(state => state.auth.data?.UseData);
  const posts = useSelector(state => state.posts.posts?.items || []); // Защита от undefined
  const [userData, setUserData] = useState(null);
  const [selected, setSelected] = useState(false);
  const [infoValue, setInfoValue] = useState("");
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const remove = () => {
    setInfoValue(prompt("Введите информацию о себе", infoValue));
    setSelected(!selected);
  };

  const handleUrlChange = async () => {
    const value = prompt("Введите URL фотографии");
    if (!value) return;

    setIsLoading(true);
    try {
      const response = await axios.post("/add/avatar", {
        avatarUrl: value, 
        _id: userId
      }, {
        headers: {
          'Content-Type': 'application/json',  
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUserData(prev => ({ ...prev, avatarUrl: value }));
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Не удалось обновить аватар');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setUserData(user);
  }, [user]);

  if (!userData) {
    return <div>Загрузка данных пользователя...</div>;
  }

  const postsWithImages = posts.filter(post => post?.imageUrl);

  return (
    <div>
      <div className="header">
        <div className="avatar">
          <img 
            src={userData.avatarUrl || notPhoto} 
            alt="Аватар" 
            className="avatar_photo"
          />   
          <Button 
            className="add_photo" 
            onClick={handleUrlChange}
            variant="contained"
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Загрузка...' : 'Загрузить фотографию'}
          </Button>
        </div>
        <p className="name">{userData.fullName}</p>
        <p className="info" onClick={remove}>Укажите информацию о себе</p>
        <button className="update_profile">Редактировать профиль</button>
      </div>
      
      <div className="all_photo">
        <p className="all_photo_title">Фото</p>
        <div className="all_photo_3">
          {postsWithImages.slice(postsWithImages.length - 3, postsWithImages.length).map((post) => (
            <div key={post._id}>
              <img 
                src={`http://localhost:4444${post.imageUrl}`} 
                alt={`Изображение ${post._id}`}
                className="images"
              />
            </div>
          ))}
          {postsWithImages.length > 3 && (
            <div className="show_more">Показать все ({postsWithImages.length - 3})</div>
          )}
        </div>
      </div>
    </div>
  );
};