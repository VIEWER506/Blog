import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import {fetchAuthMe, fetchUserData, selectIsAuth} from "../../redux/slices/auth"
import {Navigate, useNavigate} from "react-router-dom"

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const {register, handleSubmit,formState: {errors}} = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onChange"
  })
  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserData(values))

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
  console.log("auth", isAuth)
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
        className={styles.field}
        label="E-Mail"
        error={Boolean(errors.email?.message)}
        helperText={errors.email?.message}
        {... register("email", {required: "Укажите почту"})}
        fullWidth
        type="email"
        />
        <TextField 
        className={styles.field}
        label="Пароль" fullWidth
        error={Boolean(errors.password?.message)}
        helperText={errors.password?.message}
        {... register("password", {required: "Укажите пароль"})}/>
        <Button type="submit" size="large" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Paper>
  );
};
