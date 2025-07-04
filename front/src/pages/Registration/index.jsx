import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReister, selectIsAuth } from '../../redux/slices/auth';
import styles from './Login.module.scss';
import { useForm } from 'react-hook-form';
import {fetchUserData} from "../../redux/slices/auth"
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch()
    const {register, handleSubmit,formState: {errors}} = useForm({
      defaultValues: {
        fullName: "",
        email: '',
        password: ''
      },
      mode: "onChange"
    })
    const onSubmit = async (values) => {
        const data = await dispatch(fetchReister(values))
    
        if(!data.payload){
          alert("Не удалось авторизоваться")
        }
        if("token" in data.payload){
          window.localStorage.setItem("token", data.payload.token)
        }
      }
      if(isAuth){
        return <Navigate to="/"/>
      }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField 
        error={Boolean(errors.fullName?.message)}
        helperText={errors.fullName?.message}
        {... register("fullName", {required: "Укажите полное имя"})} 
        className={styles.field} 
        label="Полное имя" 
        fullWidth />
        <TextField 
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {... register("email", {required: "Укажите почту"})} 
        className={styles.field} 
        label="E-Mail" 
        fullWidth />
        <TextField 
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {... register("password", {required: "Укажите пароль"})} 
        className={styles.field} 
        label="Пароль" 
        fullWidth />
        <Button type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
        