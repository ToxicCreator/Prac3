import { NavLink, Outlet, useLocation } from "react-router-dom";

export const Auth = () => {
    const {pathname} = useLocation();
    return (
        <div>
            <p><Outlet /></p>
            {!pathname.includes("register") && <p><NavLink to="register">Зарегестрироваться</NavLink></p>}
            {!pathname.includes("login") &&  <p><NavLink to="login">Войти</NavLink></p>}
        </div>
    );
};
