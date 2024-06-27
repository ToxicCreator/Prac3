import { useEffect, useState } from "react";
import { SESSION_STORAGE_USER_KEY } from "../constants";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import { MessageForm } from "../components/MessageForm/MessageForm";
import { MessagesList } from "../components/MessagesList/MessagesList";

export const Profile = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const sessionUser = getUserFromSessionStorage();
        if (!sessionUser) {
            navigate("/auth");
        }
        setCurrentUser(sessionUser);
    }, [navigate]);
    if (!currentUser) return null;
    return (
        <section>
            <h3>ФИО:</h3>
            <p>{currentUser.fio}</p>
            <hr />
            <h3>Отправка сообщений:</h3>
            <MessageForm currentUserId={currentUser.id} />
            <br />
            <hr />
            <h3>Список сообщений:</h3>
            <MessagesList currentUser={currentUser} />
        </section>
    );
};

function getUserFromSessionStorage(): User | null {
    const item = sessionStorage.getItem(SESSION_STORAGE_USER_KEY);
    if (!item) return null;
    return JSON.parse(item);
}
