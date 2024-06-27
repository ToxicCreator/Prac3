import { useContext, useEffect, useState } from "react";
import { Message, User } from "../../types";
import { UsersContext } from "../../App";
import styles from './styles.module.css';


type Props = {
    currentUser: User
}

export const MessagesList = (props: Props) => {
    const {currentUser} = props;
    const users = useContext(UsersContext);
    const [checked, setChecked] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [filtredMessages, setFiltredMessages] = useState<Message[]>([]);
    const [messagesHasError, setMessagesHasError] = useState(false);
    
    useEffect(() => {
        if (!currentUser) return;
        setMessagesHasError(false);
        getUserMessages(currentUser.id)
            .then((res: Message[]) => {
                setMessages(() => res);
                setFiltredMessages(() => res);
            })
            .catch(() => {
                setMessagesHasError(() => true);
            })
    }, [currentUser]);
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget;
        const {from, onlyUnread, fromDate, toDate} = form.elements as (typeof form.elements & {
          from: {value: string | undefined},
          onlyUnread: {checked: boolean},
          fromDate: {value: string},
          toDate: {value: string}
        });
        let filtredMessages = messages;
        if (onlyUnread.checked) {
            filtredMessages = filtredMessages.filter((message) => !message.status)
        }
        if (from.value) {
            filtredMessages = filtredMessages.filter((message) => message.from === Number(from.value))
        }
        if (fromDate.value) {
            filtredMessages = filtredMessages.filter((message) => 
                new Date(message.sendingDate) >= new Date(fromDate.value)
            )
        }
        if (toDate.value) {
            filtredMessages = filtredMessages.filter((message) => 
                new Date(message.sendingDate) <= new Date(toDate.value)
            )
        }
        setFiltredMessages(filtredMessages);
    }

    if (messagesHasError) {
        return (
            <p style={{color: 'red'}}>Ошибка загрузки сообщений</p>
        );
    }
    return (
        <>
            <section>
                <h4>Фильтры:</h4>
                <form className={styles.filters} onSubmit={handleSubmit}>
                    <label>
                        От кого:{' '}
                        <select id="from">
                            <option value="" >Выберете пользователя</option>
                            {
                                users
                                    .filter(({id}) => id !== currentUser.id)
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>{user.fio}#{user.id}</option>
                                    ))
                            }
                        </select>
                    </label>
                    <label>
                        Только непрочитанные:{' '}
                        <input
                            id="onlyUnread"
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked(c => !c)}
                        />
                    </label>
                    <label>
                        Дата отправки c:{' '}
                        <input id="fromDate" type="datetime-local" />
                        {' '}до:{' '}
                        <input id="toDate" type="datetime-local" />
                    </label>
                    <button type="submit">Найти</button>
                </form>
            </section>
            <section>
                {filtredMessages.map(({id, from, sendingDate, title, description}) => (
                    <p 
                        key={id}
                        style={{
                            padding: 16,
                            backgroundColor: '#131313',
                            borderRadius: 16
                        }}
                    >
                        От: <i>{users.find(({id}) => id === from)?.fio || "Неизвестный пользователь"}</i><br />
                        Отправлено: <i>{new Date(sendingDate).toDateString()}</i><br />
                        Заголовок: <b>"{title}"</b><br />
                        Текст сообщения: <b>"{description}"</b>      
                    </p>
                ))}
            </section>
        </>
    );
}

async function getUserMessages(userId: number) {
    const response = await fetch(`http://localhost:5105/api/messages?user_id=${userId}`);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
}
