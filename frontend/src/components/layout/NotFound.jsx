import React from "react";

const NotFound = () => {
    return (
        <div classNameName="row">
      <div className="d-flex justify-content-center page-not-found-wrapper">
        <img
          src=".../images/default_avatar.jpg"
          height="550"
          width="550"
          alt="404_not_found"
        />
      </div>
      <h5 className="text-center">
        Page Not Found. Go to <a href="/">Homepage</a>
      </h5>
    </div>
    )
}

export default NotFound;