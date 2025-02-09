import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const API_BASE = import.meta.env.VITE_API_BASEURL;

function LoginPage({ checkHasToken }) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  // NOTE: function of login information: username, password
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, account);
      const { token, expired } = response.data;
      document.cookie = `homework=${token};expires= ${new Date(expired)}`;
      checkHasToken();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // NOTE: function of setting login information: username, password
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAccount({
      ...account,
      [id]: value,
    });
  };

  return (
    <div className="container login mt-5">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                value={account.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={account.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

LoginPage.propTypes = {
  checkHasToken: PropTypes.func,
};
export default LoginPage;
