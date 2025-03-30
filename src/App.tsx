import styles from './app.module.css';

import { Routes, Route, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from './lib/hooks/reduxTypedHooks';
import { useEffect, useRef } from 'react';
import validateCoookie from './lib/actions/validateCookie';
import { setUserToGuest, updateUserData } from './redux/userSlice';
import { PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import getFavoriteForUser from './lib/actions/favorite/getFavoriteForUser';
import { updateFavorite } from './redux/favoriteSlice';
import useEventListerner from './lib/hooks/useEventListener';

import Header from './components/core/header/Header';
import Main from './components/core/main/Main';
import Footer from './components/core/footer/Footer';
import Home from './components/general/home/Home';
import Login from './components/account/login/Login';
import Register from './components/account/register/Register';
import Profile from './components/account/profile/Profile';
import Page404 from './components/general/notFound/page404/Page404';
import AddProduct from './components/product/addProduct/AddProduct';
import PopupMessage from './components/general/popupMessage/PopupMessage';
import ProductsCatalog from './components/product/productsCatalog/ProductsCatalog';
import ShoppingCart from './components/product/shoppingCart/ShoppingCart';
import ProductDetails from './components/product/productDetails/productDetails';
import EditProduct from './components/product/editProduct/EditProduct';
import Orders from './components/orders/Orders';
import Contact from './components/general/contact/Contact';
import TicketsOverview from './components/ticket/TicketsOverview';
import About from './components/general/about/About';
import Terms from './components/general/terms/Terms';
import Privacy from './components/general/privacy/Privacy';
import Return from './components/general/return/Return';

const PAYPAL_INIT_OPTIONS: ReactPayPalScriptOptions = {
  clientId: "ATKglcYBI2PZ2DazP0H2hcnyOzjxVk0twgEzIA35pJwjqsjhC-xzwY542wpgc1g0j1agukEIeaWyO1vJ",
  currency: "EUR",
  intent: "capture",
};

export default function App() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.user);
  const navigate = useNavigate();

  const isComponentFirstMount = useRef(true);

  useEffect(() => {
    checkCookieAndData();
    isComponentFirstMount.current = false;
  }, []);

  useEventListerner(document, 'visibilitychange', tabChangeEventListner);

  async function checkCookieAndData() {
    const action = await validateCoookie();
    if (action.responseStatus === 200) {
      dispatch(updateUserData(action.data! || {}));
      if (action.data!.is_employee) {
        return;
      }
      const favoriteProductsAction = await getFavoriteForUser(action.data!.userID || 0);
      if (favoriteProductsAction.responseStatus === 200) {
        dispatch(updateFavorite(favoriteProductsAction.data!));
      }
    } else {
      dispatch(setUserToGuest());
      if (!isComponentFirstMount) {
        navigate('/');
      }
    }
  }

  async function tabChangeEventListner(_e: Event) {
    if (document.visibilityState === 'visible') {
      await checkCookieAndData();
    }
  }

  return (
    <div className={styles.wrapper}>
        <PayPalScriptProvider options={PAYPAL_INIT_OPTIONS}>

          <Header />
          <Routes>
            <Route element={<Main />}>

              <Route index element={<Home />}></Route>
              <Route path='products-catalog' element={<ProductsCatalog />}></Route>
              <Route path='product-details/:productID?' element={<ProductDetails />}></Route>
              <Route path='contact' element={<Contact />}></Route>
              <Route path='about' element={<About />}></Route>
              <Route path='terms' element={<Terms />}></Route>
              <Route path='privacy' element={<Privacy />}></Route>
              <Route path='return' element={<Return />}></Route>
              {/* guest only */}
              {
                !userData.userID ?
                  <>
                    <Route path='login' element={<Login />}></Route>
                    <Route path='register' element={<Register />}></Route>
                  </>
                  : ''
              }
              {/* user only */}
              {
                userData.userID ?
                  <>
                    <Route path='profile' element={<Profile />}></Route>
                    <Route path='orders' element={<Orders />}></Route>
                  </>
                  : ''
              }
              {/* employees only */}
              {
                userData.is_employee ?
                  <>
                    <Route path='add-product' element={<AddProduct />}></Route>
                    <Route path='edit-product/:productID?' element={<EditProduct />}></Route>
                    <Route path='tickets' element={<TicketsOverview />}></Route>
                  </>
                  : ''
              }
              {/* customer only */}
              {
                !userData.is_employee ?
                  <>
                    <Route path='shopping-cart' element={<ShoppingCart />}></Route>
                  </>
                  : ''
              }

              <Route path='*' element={<Page404 />}></Route>

            </Route>
          </Routes>
          <Footer />

          <PopupMessage />

        </PayPalScriptProvider> 
    </div>
  )
}
