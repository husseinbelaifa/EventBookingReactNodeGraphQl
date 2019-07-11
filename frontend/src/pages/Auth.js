// @flow
import React from "react";
import "./Auth.css";
class Auth extends React.Component {
  render() {
    return (
      <form className="auth-form">
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" />
        </div>

        <div className="form-action">
          <button type="button">Switch To Sign Up</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}

export default Auth;
