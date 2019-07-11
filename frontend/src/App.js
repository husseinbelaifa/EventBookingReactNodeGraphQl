import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import authPage from "./pages/Auth";
import eventPage from "./pages/Event";
import bookingPage from "./pages/Booking";
function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={authPage} />
        <Route path="/events" component={eventPage} />
        <Route path="/bookings" component={bookingPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
