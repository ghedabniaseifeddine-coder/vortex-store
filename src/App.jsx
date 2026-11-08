import React from 'react';
import { StoreProvider, useRoute } from './store.jsx';
import Showroom3D from './scene/Showroom3D.jsx';
import { Header, CartDrawer, Footer, Toast } from './components/Chrome.jsx';
import AIAssistant from './components/AIAssistant.jsx';
import Home from './pages/Home.jsx';
import Checkout from './pages/Checkout.jsx';
import Admin from './pages/Admin.jsx';

function Shell() {
  const { path, navigate } = useRoute();

  let page = <Home navigate={navigate} />;
  if (path === '/checkout') page = <Checkout navigate={navigate} />;
  else if (path === '/admin') page = <Admin navigate={navigate} />;

  return (
    <div className="app">
      {/* The cinematic 3D world — always behind the store, never interactive. */}
      <Showroom3D />

      <div className="page">
        <Header path={path} navigate={navigate} />
        <main>{page}</main>
        <Footer navigate={navigate} />
      </div>

      <CartDrawer navigate={navigate} />
      <AIAssistant />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
