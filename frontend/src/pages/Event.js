// @flow
import React from "react";
import "./Event.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
class Event extends React.Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modelConfirmHandler = () => {
    this.setState({ creating: false });
  };

  modelCancelHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modelCancelHandler}
            onConfirm={this.modelConfirmHandler}
          >
            <p>Modal Content</p>
          </Modal>
        )}

        <div className="events-control">
          <p>Share your own Events</p>
          <button className="btn " onClick={this.startCreateEventHandler}>
            CreateEvent
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Event;
