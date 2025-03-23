import { BrowserRouter, Routes, Route } from 'react-router';
import { useAppDispatch, useAppSelector } from './lib/hooks/reduxTypedHooks';
import { useEffect } from 'react';
import validateCoookie from './lib/actions/validateCookie';
import { setUserToGuest, updateUserData } from './redux/userSlice';
import { PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

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

const PAYPAL_INIT_OPTIONS: ReactPayPalScriptOptions = {
  clientId: "ATKglcYBI2PZ2DazP0H2hcnyOzjxVk0twgEzIA35pJwjqsjhC-xzwY542wpgc1g0j1agukEIeaWyO1vJ",
  currency: "EUR",
  intent: "capture",
};

export default function App() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.user);
  useEffect(() => {
    async function checkCookieAndData() {
      const userDataAfterValidation = await validateCoookie();
      if (userDataAfterValidation?.userID) {
        dispatch(updateUserData(userDataAfterValidation));
      } else {
        dispatch(setUserToGuest());
      }
    }
    checkCookieAndData();
  }, []);

  return (
    <>
      <BrowserRouter>
        <PayPalScriptProvider options={PAYPAL_INIT_OPTIONS}>

          <Header />
          <Routes>
            <Route element={<Main />}>

              <Route index element={<Home />}></Route>
              <Route path='products-catalog' element={<ProductsCatalog />}></Route>
              <Route path='product-details/:productID?' element={<ProductDetails />}></Route>
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
      </BrowserRouter>
    </>
  )
}
