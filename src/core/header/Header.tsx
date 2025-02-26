import './header.css';
import logo from '../../assets/COREbuild.svg';
import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from '../../lib/hooks/reduxTypedHooks';
import { useEffect, useState } from 'react';
import logout from '../../lib/actions/logout';
import { setUserToGuest } from '../../redux/userSlice';

export default function Header() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);
    const navigate = useNavigate();
    const [trigger, setTrigger] = useState(false);
    useEffect(() => {
        async function logoutUser() {
            if (trigger) {
                await logout();
                dispatch(setUserToGuest());
                navigate('/');
                setTrigger(false);
            }
        }
        logoutUser();
    }, [trigger]);
    const triggerLogout = function() {
        setTrigger(true);
    }
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} alt="COREbuild" className="logo-svg" />
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-3 mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#">TODO</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Products
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
                        </ul>

                        <form className="d-flex me-auto" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>

                        <ul className="navbar-nav me-3 mb-2 mb-lg-0">
                            {
                                userData.userID > 0 ?
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {userData.username}
                                        </a>
                                        <ul className="dropdown-menu userAccountActionsDropdown">
                                            <li><NavLink className="dropdown-item" to="/profile">Profile</NavLink></li>
                                            <li><NavLink className="dropdown-item logoutButton" to="#" onClick={triggerLogout}>Log Out</NavLink></li>
                                        </ul>
                                    </li>
                                    :
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" aria-current="page" to="login">Log In</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" aria-current="page" to="register">Register</NavLink>
                                        </li>
                                    </>
                            }
                        </ul>

                    </div>
                </div>
            </nav>
        </header>
    );
}