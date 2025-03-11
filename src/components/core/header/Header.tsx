import './header.css';
import logo from '../../../assets/COREbuild.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import { useEffect, useRef, useState } from 'react';
import logout from '../../../lib/actions/logout';
import { ProductInCart } from '../../../lib/definitions';

import { setUserToGuest } from '../../../redux/userSlice';
import { setMessageData } from '../../../redux/popupMessageSlice';

export default function Header() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);
    const cartData = useAppSelector(state => state.cart);
    const navigate = useNavigate();
    const isHeaderMounted = useRef(false);
    const [trigger, setTrigger] = useState(false);
    const [countOfProductsInCart, setCountOfProductsInCart] = useState(0);

    const triggerLogout = function () {
        setTrigger(true);
    }
    const searchButtonHandler = function (e: React.SyntheticEvent) {
        e.preventDefault();
        const form = ((e.target as HTMLButtonElement).parentElement as HTMLFormElement);
        const formData = new FormData(form);
        const nameSearchParam = formData.get('name') as string || null;
        form.reset();
        navigate(`products-catalog?currentPage=1&itemsPerPage=12&name=${nameSearchParam || ''}&`);
    }
    const searchWithEnterHandler = function (e: React.SyntheticEvent) {
        e.preventDefault();
        const form = (e.target as HTMLFormElement);
        const formData = new FormData(form);
        const nameSearchParam = formData.get('name') as string || null;
        form.reset();
        navigate(`products-catalog?currentPage=1&itemsPerPage=12&name=${nameSearchParam || ''}&`);
    }

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

    useEffect(() => {
        if (isHeaderMounted.current) {
            let count = 0;
            cartData.forEach(p => count += p.count);
            setCountOfProductsInCart(count);
            dispatch(setMessageData({
                duration: 3000,
                isShown: true,
                text: 'Product added to cart!',
                type: 'success'
            }));
        } else {
            isHeaderMounted.current = true;
        }
    }, [cartData]);


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
                                <NavLink className="nav-link" to="products-catalog">Products</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    About
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <NavLink className="dropdown-item" to="about">About Us</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="dropdown-item" to="terms">Terms & Services</NavLink>
                                    </li>
                                    {/* <li><hr className="dropdown-divider" /></li> */}
                                    <li>
                                        <NavLink className="dropdown-item" to="privacy">Privacy Policy</NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <form className="d-flex me-auto" role="search" onSubmit={searchWithEnterHandler}>
                            <input className="form-control me-2" type="search" placeholder="Name of product" aria-label="Search" name='name' />
                            <button className="btn btn-outline-success" type="button" onClick={searchButtonHandler}>Search</button>
                        </form>
                        {
                            !userData.is_employee ?
                                <button className="btn btn-outline-warning cartButton" type="button" onClick={() => navigate('shopping-cart')}>
                                    <FontAwesomeIcon icon={faCartShopping} />{countOfProductsInCart}
                                </button>
                                : ''
                        }

                        <ul className="navbar-nav me-3 mb-2 mb-lg-0">
                            {
                                userData.userID > 0 ?
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {userData.username}
                                        </a>
                                        <ul className="dropdown-menu userAccountActionsDropdown">
                                            {
                                                userData.is_employee ?
                                                    <>
                                                        <li>
                                                            <NavLink className="dropdown-item" to="/add-product">Add Product</NavLink>
                                                        </li>
                                                    </>
                                                    : ''
                                            }
                                            <li>
                                                <NavLink className="dropdown-item" to="/profile">Profile</NavLink>
                                            </li>
                                            <li>
                                                <NavLink className="dropdown-item logoutButton" to="#" onClick={triggerLogout}>Log Out</NavLink>
                                            </li>
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