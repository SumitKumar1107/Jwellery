import React, { useEffect, useState } from "react";
import {toast} from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/api/userApi";
import UserLayout from "../layout/UserLayout";
import MetaData from "../layout/MetaData"

const ForgotPassword = () => {
    const [email,setEmail] = useState("");

    const navigate = useNavigate();

    const [forgotPassword, {isLoading, error, isSuccess}] = useForgotPasswordMutation();
    const {isAuthenticated} = useSelector((state) => state.auth)

    useEffect(()=>{

        if(isAuthenticated) {
            navigate("/");
        }

        if(error){
            toast.error(error?.data?.message);
        }

        if(isSuccess){
            toast.success("Email sent, please check your inbox")
        }
    },[error,isAuthenticated,isSuccess])

    const submitHandler = (e) => {
        e.preventDefault();

        forgotPassword({email});
    }

    return (
        <>
        <MetaData title={"Forgot Password"}/>
        <div className="row wrapper">
  <div className="col-10 col-lg-5 mx-auto">
    <form className="shadow-lg p-4 rounded bg-body" onSubmit={submitHandler}>
      <h1 className="mb-4 text-center">Forgot Password</h1>
      
      <div className="mb-3">
        <label htmlFor="email_field" className="form-label">Enter Email</label>
        <input
          type="email"
          id="email_field"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        id="forgot_password_button"
        type="submit"
        className="btn btn-primary w-100 py-3"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Email"}
      </button>
    </form>
  </div>
</div>
</>
    )
}

export default ForgotPassword;