import React from "react";
import "./Spinner.css";
const Spinner = props => {
  return (
    <div className="spinner">
      <div className="lds-dual-ring" />
    </div>
  );
};

export default Spinner;
