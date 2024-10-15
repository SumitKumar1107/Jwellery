import React, { useEffect, useState } from 'react'
import {toast} from "react-hot-toast";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../redux/api/userApi';
import MetaData from "../layout/MetaData"

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const params = useParams();

  const navigate = useNavigate();

    const [resetPassword, {isLoading, error, isSuccess}] = useResetPasswordMutation();

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }

        if(isSuccess){
            toast.success("Password rest successfully")
            navigate("/login");
        }
    },[error,isSuccess])

    const submitHandler = (e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            return toast.error("Password does not match, try again");
        }

        const data = {password,confirmPassword}
        resetPassword({token:params?.token, body:data});
    }

  return (
    <>
    <MetaData title={"Reset Password"}/>
    <div className="row wrapper">
      <div className="col-10 col-lg-5 mx-auto">
        <form
          className="shadow rounded bg-body p-4"
          onSubmit={submitHandler}
        >
          <h2 className="mb-4 text-center">New Password</h2>

          <div className="mb-3">
            <label htmlFor="password_field" className="form-label">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password_field" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button id="new_password_button" type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>
            Set Password
          </button>
        </form>
      </div>
    </div>
</>
  );
};

export default ResetPassword;
