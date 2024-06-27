import { useContext, useState } from "react";
import { UsersContext } from "../../App";
import styles from "./styles.module.css"; 

export const MessageForm = ({currentUserId}: {currentUserId: number}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const users = useContext(UsersContext);
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget;
        const formElements = form.elements as (typeof form.elements & {
          to: {value: string},
          title: {value: string},
          description: {value: string}
        });
        setIsLoading(true);
        setHasError(false);
        sendMessage(
            currentUserId,
            Number(formElements.to.value),
            formElements.title.value,
            formElements.description.value || ""
        )
            .catch(() => { setHasError(() => true) })
            .finally(() => { setIsLoading(() => false) });
    }
    return (
        <form 
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <label>
                Кому:{' '}
                <select id="to" required>
                    {
                        users
                            .filter(({id}) => id !== currentUserId)
                            .map((user) => (
                                <option key={user.id} value={user.id}>{user.fio}#{user.id}</option>
                            ))
                    }
                </select>
            </label>
            <input
                id="title"
                placeholder="Заголовок сообщения"
                disabled={isLoading}
                required
            />
            <input
                id="description"
                placeholder="Текст сообщения"
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>Отправить сообщение</button>
            {hasError && <p style={{color: 'red'}}>Ошибка отправки сообщения</p>}
        </form>
    );
};

async function sendMessage(from: number, to: number, title: string, description: string) {
    const response = await fetch(`http://localhost:5105/api/send`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to,
            title,
            description
        })
    });
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
}
