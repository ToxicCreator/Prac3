import { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION_STORAGE_USER_KEY } from "../constants";

export const Login = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setLoading(true);
        setHasError(false);
        loginRequest(login, password)
            .then((user) => {
                sessionStorage.setItem(SESSION_STORAGE_USER_KEY, JSON.stringify(user));
                navigate("/");
            })
            .catch(() => {
                setHasError(() => true);
            })
            .finally(() => {
                setLoading(() => false);
            });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>
                    <input
                        name="login"
                        placeholder="логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value.trim())}
                        disabled={isLoading}
                        required
                    />
                </p>
                <p>
                    <input
                        name="password"
                        type="password"
                        placeholder="пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.trim())}
                        disabled={isLoading}
                        required
                    />
                </p>
                <p>
                    <button type="submit" disabled={isLoading}>
                        Войти
                    </button>
                </p>
                {hasError && <p style={{color: 'red'}}>Ошибка входа</p>}
            </form>
        </div>
    );

    async function loginRequest(login: string, password: string) {
        const response = await fetch(`http://localhost:5105/api/login?login=${login}&password=${password}`);
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
        return await response.json();
    }
};
