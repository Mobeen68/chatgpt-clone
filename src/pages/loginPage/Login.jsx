import { SignIn } from "@clerk/clerk-react";
import React from "react";
import "./login.css";

const Login = () => {
  return (
    <div className="login">
      <SignIn path="/login" signUpUrl="/signup" />
    </div>
  );
};

export default Login;
