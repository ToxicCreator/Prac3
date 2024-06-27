import { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import { User } from './types';


export const UsersContext = createContext<User[]>([]);

function App() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        getAllUsers()
            .then((res) => {
                setUsers(res);
            })
    }, []);
    return (
        <div>
            <UsersContext.Provider value={users}>
                <Outlet />
            </UsersContext.Provider>
        </div>
    );
}

async function getAllUsers() {
    const response = await fetch(`http://localhost:5105/api/users`);
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
}

export default App;