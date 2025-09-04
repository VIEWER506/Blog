import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { setAboutMe, setFullName } from "../../redux/slices/auth";
import styles from "./style.css"

export const Edit = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.data);
    const [inputAboutMe, setInputAboutMe] = useState(user?.UseData?.aboutMe || "");
    const [inputFullName, setInputFullName] = useState(user?.UseData?.fullName || "")

    
    const handleAboutMeChange = (e) => {
        setInputAboutMe(e.target.value); 
    };
    const handleFullNameChange = (e) => {
        setInputFullName(e.target.value)
    }
    const updateAboutMe = async () => {
        try {
            const response = await axios.patch(
                "/updateAboutMe",
                {   fullName: inputFullName,
                    aboutMe: inputAboutMe,
                    _id: user?.UseData?._id,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            
            dispatch(setAboutMe(inputAboutMe)); 
            dispatch(setFullName(inputFullName))
            console.log(user)
        } catch (error) {
            console.error("Ошибка при обноенивли данных:", error);
        }
    };
    
    return (
        <div>
            <div className="header_edit">
            <div className="remove">
                <p className="text">Краткая информация:</p>
            <textarea
                placeholder="Введите информацию о себе"
                className="about_me"
                value={inputAboutMe}
                onChange={handleAboutMeChange}
            />
            </div>
            <div className="remove2">
                <p className="text">Изменить почту:</p>
            <textarea
                placeholder="Введите информацию о себе"
                className="about_me"
                value={inputFullName}
                onChange={handleFullNameChange}
            />
            </div>
            <button onClick={updateAboutMe} className="save">Сохранить</button>            
        </div>
        </div>
        
    );
};