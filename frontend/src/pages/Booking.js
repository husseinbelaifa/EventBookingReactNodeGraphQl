// @flow
import React from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
class Booking extends React.Component {
  static contextType = AuthContext;
  state = {
    isLoading: false,
    bookings: []
  };
  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {

            _id
            createdAt
            event {
              _id
              title
              date
            }

          }
        }
      `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then(res => {
        return res.json();
      })
      .then(resDate => {
        this.setState({ bookings: resDate.data.bookings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  render() {
    const bookingsList =
      this.state.bookings &&
      this.state.bookings.map(booking => (
        <li key={booking._id}>
          {booking.event.title} -{" "}
          {new Date(booking.createdAt).toLocaleDateString()}
        </li>
      ));
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        <ul>{bookingsList}</ul>
      </React.Fragment>
    );
  }
}

export default Booking;
