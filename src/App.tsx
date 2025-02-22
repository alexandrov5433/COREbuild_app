import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';

import Header from './core/header/Header';
import Main from './core/main/Main';
import Footer from './core/footer/Footer';
import Home from './views/home/Home';


function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<Main />}>

            <Route index element={<Home />}></Route>

          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
