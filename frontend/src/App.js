import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import authPage from "./pages/Auth";
import eventPage from "./pages/Event";
import bookingPage from "./pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={authPage} />
          <Route path="/events" component={eventPage} />
          <Route path="/bookings" component={bookingPage} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
