// @flow
import React from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/Spinner";
import BookingsList from "../components/Bookings/BookingsList/BookingsList";
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

  deleteBookingHandler = bookingId => {
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId:"${bookingId}") {

             _id
             title

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
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(
            booking => bookingId !== booking._id
          );

          return { bookings: updatedBookings };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading && <Spinner />}
        <BookingsList
          bookings={this.state.bookings}
          onDelete={this.deleteBookingHandler}
        />
      </React.Fragment>
    );
  }
}

export default Booking;
