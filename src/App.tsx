import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';

import { Provider } from 'react-redux';
import { store } from './redux/store';

import Header from './core/header/Header';
import Main from './core/main/Main';
import Footer from './core/footer/Footer';
import Home from './views/home/Home';


function App() {


  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route element={<Main />}>

              <Route index element={<Home />}></Route>

            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
