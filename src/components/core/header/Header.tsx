import './header.css';
import logo from '../../../assets/COREbuild.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import { useEffect, useState } from 'react';
import logout from '../../../lib/actions/logout';
import { ShoppingCart } from '../../../lib/definitions';

import { setUserToGuest } from '../../../redux/userSlice';
import getShoppingCart from '../../../lib/actions/getShoppingCart';
import { updateCart } from '../../../redux/cartSlice';

export default function Header() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);
    const cartData = useAppSelector(state => state.cart);
    const navigate = useNavigate();
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
        let count = 0;
        Object.values(cartData).forEach(c => count += c);
        setCountOfProductsInCart(count);
    }, [cartData]);

    useEffect(() => {
        if (userData.userID && !userData.is_employee) {
            (async () => {
                const res = await getShoppingCart(userData.userID);
                if (res.responseStatus === 200) {
                    dispatch(updateCart(res.data! as ShoppingCart));
                } else if ([400, 500].includes(res.responseStatus)) {
                    console.log('ERROR');
                }
            })();
        }
    }, [userData]);


    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">
                        <img src={logo} alt="COREbuild" className="logo-svg" />
                    </NavLink>

                    {
                        userData.userID && !userData.is_employee ?
                            <button className="navbar-toggler btn btn-outline-warning cartButton" type="button" onClick={() => navigate('shopping-cart')}>
                                <FontAwesomeIcon icon={faCartShopping} />{' ' + countOfProductsInCart}
                            </button>
                            : ''
                    }

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

                        <form className="d-flex me-auto searchBarForm" role="search" onSubmit={searchWithEnterHandler}>
                            <input className="form-control me-2" type="search" placeholder="Name of product" aria-label="Search" name='name' />
                            <button className="btn btn-outline-success" type="button" onClick={searchButtonHandler}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                        </form>
                        {
                            userData.userID && !userData.is_employee ?
                                <button className="btn btn-outline-warning cartButton inside" type="button" onClick={() => navigate('shopping-cart')}>
                                    <FontAwesomeIcon icon={faCartShopping} />{' ' + countOfProductsInCart}
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