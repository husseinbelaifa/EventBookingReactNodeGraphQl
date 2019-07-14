import React from "react";
import "./Modal.css";
const Modal = props => {
  return (
    <div className="modalE">
      <header className="modalE__header">
        <h1>{props.title}</h1>
      </header>

      <section className="modalE__content">{props.children}</section>

      <section className="modalE__actions">
        {props.canCancel && (
          <button className="btn " onClick={props.onCancel}>
            Cancel
          </button>
        )}
        {props.canConfirm && (
          <button className="btn " onClick={props.onConfirm}>
            Confirm
          </button>
        )}
      </section>
    </div>
  );
};

export default Modal;
