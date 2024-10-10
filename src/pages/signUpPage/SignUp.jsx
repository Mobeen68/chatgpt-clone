import { SignUp } from "@clerk/clerk-react";
import React from "react";
import "./signup.css";

const SignUpPage = () => {
  return (
    <div className="signup">
      <SignUp path="/signup" signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
