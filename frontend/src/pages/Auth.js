// @flow
import React from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";
class Auth extends React.Component {
  state = {
    isLogin: true,
    errors: []
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      this.setState({
        errors: [...this.state.errors, "username or password cannot be empty"]
      });
    }

    //send request to backend

    let requestBody = {
      query: `
        query {
           login(email:"${email}",password:"${password}"){
            userId
            token
            tokenExpiration
           }
        }
      `
    };

    if (!this.state.isLogin)
      requestBody = {
        query: `
        mutation {
          createUser(userInput:{
            email:"${email}",
            password:"${password}"
          }){
            _id 
            email
          }
        }
      `
      };

    console.log(email, password);

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error("Failed");

        return res.json();
      })
      .then(resBody => {
        if (resBody.data.login.token) {
          console.log("login");
          this.context.login(
            resBody.data.login.token,
            resBody.data.login.userId,
            resBody.data.login.tokenExpiration
          );

          // console.log(resBody);
        }

        // console.log(this.context);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            ref={this.emailEl}
          />

          <small id="emailHelp" class="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            ref={this.passwordEl}
          />
        </div>

        <div className="form-action">
          <button
            type="button"
            class="btn btn-primary"
            onClick={this.switchModeHandler}
          >
            Switch To {this.state.isLogin ? "Sign Up" : "Login"}
          </button>
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      // <form className="auth-form" onSubmit={this.submitHandler}>
      //   <div className="form-group form-control">
      //     <label htmlFor="email">Email</label>
      //     <input
      //       type="email"
      //       name="email"
      //       className="form-control"
      //       ref={this.emailEl}
      //     />
      //   </div>

      //   <div className="form-group form-control">
      //     <label htmlFor="password">Password</label>
      //     <input
      //       type="password"
      //       name="password"
      //       ref={this.passwordEl}
      //       className="form-control"
      //     />
      //   </div>

      //   <div className="form-action">
      //     <button type="button" onClick={this.switchModeHandler}>
      //       Switch To {this.state.isLogin ? "Sign Up" : "Login"}
      //     </button>
      //     <button type="submit">Submit</button>
      //   </div>
      // </form>
    );
  }
}

export default Auth;
