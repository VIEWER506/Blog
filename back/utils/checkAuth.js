import jwt from "jsonwebtoken"

export default function checkAuth(req, res, next) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decoded = jwt.verify(token, "secret123");
            req.userId = decoded._id;
            return next(); 
        } catch (e) {
            return res.status(403).json({
                message: "Нет доступа (токен недействителен)"
            });
        }
    } else {
        return res.status(403).json({
            message: "Нет доступа (токен отсутствует)"
        });
    }
}
