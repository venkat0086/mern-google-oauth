import { Alert } from "@mui/material";
import React from "react";

const AlertPop = ({ content, severity }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="absolute top-1">
        <Alert variant="filled" severity={severity}>
          {content}
        </Alert>
      </div>
    </div>
  );
};

export default AlertPop;
