import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import App from './App.tsx';
import { Auth } from './page/Auth.tsx';
import { Login } from './page/Login.tsx';
import { Register } from './page/Register.tsx';
import { Profile } from './page/Profile.tsx';
import './index.css';


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Profile />} />
            <Route path="auth" element={<Auth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
