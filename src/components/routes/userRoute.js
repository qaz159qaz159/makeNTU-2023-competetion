import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
// slices
import { selectSession } from "../../slices/sessionSlice";

// for user
export default function UserRoute({ children, path }) {
  const { isLogin, authority } = useSelector(selectSession);
  return (
    <Route
      path={path}
      render={() => {
        if (!isLogin) return <Redirect to="/login" />;
<<<<<<<< HEAD:src/components/routes/adminRoute.js
        if (authority === 0) return <Redirect to="/" />;
========
        if (authority !== 0) return <Redirect to="/" />;
>>>>>>>> upstream/main:src/components/routes/userRoute.js
        return children;
      }}
    />
  );
}
