import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { useAppDispatch, useAppSelector } from './lib/hooks/reduxTypedHooks';
import { useEffect } from 'react';
import validateCoookie from './lib/actions/validateCookie';
import { setUserToGuest, updateUserData } from './redux/userSlice';

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

export default function App() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.user);
  useEffect(() => {
    async function checkCookieAndData() {
      const userDataAfterValidation = await validateCoookie();
      console.log('userDataAfterValidation', userDataAfterValidation);

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
          <Header />
          <Routes>
            <Route element={<Main />}>

              <Route index element={<Home />}></Route>
              <Route path='login' element={<Login />}></Route>
              <Route path='register' element={<Register />}></Route>
              <Route path='profile' element={<Profile />}></Route>
              <Route path='products-catalog' element={<ProductsCatalog />}></Route>
              {/* employees only */}
              {
                userData.is_employee ?
                  <>
                    <Route path='add-product' element={<AddProduct />}></Route>

                  </>
                  : ''
              }
              <Route path='*' element={<Page404 />}></Route>

            </Route>
          </Routes>
          <Footer />

          <PopupMessage/>

      </BrowserRouter>
    </>
  )
}
