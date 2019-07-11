import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import authPage from "./pages/Auth";
import eventPage from "./pages/Event";
import bookingPage from "./pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

class App extends React.Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    console.log("login");
    this.setState({ token: token, userId: userId });
    console.log(this.state.token);
  };

  logout = () => {
    console.log("logout");
    this.setState({ token: null, userId: null });
  };
  render() {
    return (
      <BrowserRouter>
        <MainNavigation
          isAuth={this.state.token ? true : null}
          logout={this.logout}
        />
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}
        >
          <main className="main-content">
            <Switch>
              {!this.state.token && (
                <Redirect from="/bookings" to="/auth" exact />
              )}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && <Redirect from="/auth" to="/events" exact />}

              {!this.state.token && <Route path="/auth" component={authPage} />}
              <Route path="/events" component={eventPage} />
              {this.state.token && (
                <Route path="/bookings" component={bookingPage} />
              )}

              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
