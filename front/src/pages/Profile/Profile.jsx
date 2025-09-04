import styles from "./style.css";
import notPhoto from './notPhoto.jpg';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchPosts } from '../../redux/slices/post';
import { Link } from "react-router-dom";
import { setAboutMe } from "../../redux/slices/auth";

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector(state => state.auth.data?.UseData._id);
  const user = useSelector(state => state.auth.data?.UseData);
  const posts = useSelector(state => state.posts.posts?.items || []); 
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

 
  
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  

  const handleUrlChange = async () => {
    const value = prompt("Введите URL фотографии");
    
    if (value === null || value.trim() === "") {
      return;
    }

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

  const postsWithImages = posts.filter(post => post?.imageUrl);

  if (!userData ) {
    return <div>Загрузка данных пользователя...</div>;
  }
  
  if (postsWithImages.length === 0) {
    return <div>Загрузка фотографий пользователя...</div>;
  }
  console.log(posts)
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
        {user.aboutMe ? (
          <div>
            <p className="infoValue">{user.aboutMe}</p> 
          </div>
        ) : (
          <div>
            <Link to={`/edit/${userId}`}><p className="info" >Укажите информацию о себе</p></Link>
          </div>
        )}
        <Link to={`/edit/${userId}`}>
          <button className="update_profile">Редактировать профиль</button>
        </Link>
      </div>
      
      <div className="all_photo">
        <p className="all_photo_title">Фото</p>
        <div className="all_photo_3">
          {postsWithImages.length < 3 ? (
            postsWithImages.map((post) => (
              <div key={post._id}>
                <img 
                  src={`http://localhost:4444${post.imageUrl}`} 
                  alt={`Изображение ${post._id}`}
                  className="images"
                />
              </div>
            ))
          ) : (
            postsWithImages.slice(postsWithImages.length - 3).map((post) => (
              <div key={post._id}>
                <img 
                  src={`http://localhost:4444${post.imageUrl}`} 
                  alt={`Изображение ${post._id}`}
                  className="images"
                />
              </div>
            ))
          )}
          {postsWithImages.length > 3 && (
            <div className="show_more">Показать все ({postsWithImages.length - 3})</div>
          )}
        </div>
      </div>
    </div>
  );
};