// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
/** @Componentes */
import Navbar from './engine/Navigation';
import Home from './sections/Home';
import About from './sections/About';
import Contact from './sections/Contact';
import ProductCart from './redux/Cart';
import Categories from './sections/Categories';
import { Provider } from 'react-redux';
import store from './redux/store';

/** */
const App = () => {
  return (
  <>
  {/** */}
    <Provider store={store}>
    <Router>
      <Navbar />
      <br/><br/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<ProductCart />}/>
      </Routes>
    </Router>
    </Provider>
  {/** */}
  </>
  );
};
export default App;

