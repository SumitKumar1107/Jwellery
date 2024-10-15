import React, { useEffect, useState } from "react";
import UserLayout from "../layout/UserLayout";
import { useNavigate } from 'react-router-dom';
import { useUploadAvatarMutation } from "../../redux/api/userApi";
import {toast} from "react-hot-toast";
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';

const UploadAvatar = () => {

    const {user} = useSelector((state) => state.auth)
    const [avatar,setAvatar] = useState("");
    const [avatarPreview,setAvatarPreview] = useState(user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg");
    const navigate = useNavigate();

    const [uploadAvatar ,{isloading, error, isSuccess}] = useUploadAvatarMutation(); 

    useEffect(()=>{
        if(error) {
            toast.error(error?.data?.message);
        }
        if(isSuccess){
            toast.success("Avatar updated");
            navigate("/me/profile")
        }
    }, [error,isSuccess])

    const submitHandler = (e) => {
        e.preventDefault();
        const userData = {
            avatar,
        }
        uploadAvatar(userData);
    }

    const onChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if(reader.readyState === 2){
                setAvatarPreview(reader.result)
                setAvatar(reader.result);
            }
        }

        reader.readAsDataURL(e.target.files[0]);
    }

    return (
    <>
    <MetaData title={"Upload Avatar"}/>
     <UserLayout>
        <div className="row wrapper">
  <div className="col-10 col-lg-8 mx-auto">
    <form
      className="shadow rounded bg-body p-4"
      action="#"
      method="post"
      encType="multipart/form-data"
      onSubmit={submitHandler}
    >
      <h2 className="mb-4 text-center">Upload Avatar</h2>

      <div className="mb-3">
        <div className="d-flex align-items-center">
          <figure className="avatar item-rtl me-3">
            <img src={avatarPreview} className="rounded-circle" alt="image" />
          </figure>
          <div className="flex-grow-1">
            <label className="form-label" htmlFor="customFile">
              Choose Avatar
            </label>
            <input
              type="file"
              name="avatar"
              className="form-control"
              id="customFile"
              accept="image/*"
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      <button
        id="register_button"
        type="submit"
        className="btn update-btn w-100"
        disabled={isloading}
      >
        {isloading ? "Uploading...": "Upload"}
      </button>
    </form>
  </div>
</div>
</UserLayout>
    </>
    )
}

export default UploadAvatar;