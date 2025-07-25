import React from 'react';
import Button from '@mui/material/Button';
import {Link} from "react-router-dom"
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import {useEffect} from "react"

export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const id = useSelector(state => state.auth.data?.UseData._id)
  useEffect(() => {
    console.log(id)
  }, [id])
  console.log(isAuth)
  // console.log("adsfsdf",id)
  const onClickLogout = () => {
    if(window.confirm("Вы точно хотите выйти"))
    dispatch(logout())
    window.localStorage.removeItem("token")
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>VIEWER BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написать статью</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Выйти
                </Button>
                <Link to={`/profile/${id}`}>
                  <Button variant="contained">Профиль</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
