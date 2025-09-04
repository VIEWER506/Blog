import {body} from "express-validator"

export const loginValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password","Пароль минимум 5 символов").isLength({min: 5}),
]
export const registerValidation = [
    body("email", "Неверный формат почты").isEmail(),
    body("password","Пароль минимум 5 символов").isLength({min: 5}),
    body("fullName","Укажите имя").isLength({min: 3}),
    body("avatar","Неверная ссылка на аватарку").optional().isURL()
]
export const postCreateValidation = [
    body("title", "Введите заголовок статьи").isLength({min: 3}).isString(),
    body("text","Введите текст статьи").isLength({min: 5}).isString(),
    body("tags").optional({ nullable: true }).isArray().withMessage("Tags должен быть массивом").custom(arr => arr.every(tag => typeof tag === 'string')).withMessage("Каждый тег должен быть строкой"),
    body("imageUrl","Неверная ссылка на изображение").optional().isString()
]