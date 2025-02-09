import { useEffect, useState } from "react";

import axios from "axios";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  // NOTE: check web storage has token
  const checkHasToken = () => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)homework\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    if (token !== "") {
      axios.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
    }
  };

  useEffect(() => {
    checkHasToken();
  }, []);

  return (
    <>
      {isAuth ? <ProductPage /> : <LoginPage checkHasToken={checkHasToken} />}
    </>
  );
}

export default App;
