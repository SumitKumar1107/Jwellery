import React, { useEffect } from "react";
import toast from 'react-hot-toast';
import Loader from "../layout/Loader";
import {MDBDataTable} from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";
import { useDeleteUserMutation, useGetAdminUsersQuery } from "../../redux/api/userApi";

const ListUsers = () => {

    const {data, isLoading, error} = useGetAdminUsersQuery();
    const [deleteUser, {error:deleteError, isLoading :isErrorLoading ,  isSuccess}] = useDeleteUserMutation();
   

    const deleteUserHandler = (id) => {
        deleteUser(id);
    }

    const setUsers = () => {
    const users = {
        columns: [
          {
            label: "ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Name",
            field: "name",
            sort: "asc",
          },
          {
            label: "Email",
            field: "email",
            sort: "asc",
          },
  
          {
            label: "Role",
            field: "role",
            sort: "asc",
          },
          {
            label: "Actions",
            field: "actions",
            sort: "asc",
          },
        ],
        rows : [],
    };

    data?.users?.forEach((user) => {
        users.rows.push({
          id: user?._id,
          name: user?.name,
          email: user?.email,
          role : user?.role, 
          actions: (
            <>
              <Link
                to={`/admin/users/${user?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => deleteUserHandler(user?._id)}
                disabled={isErrorLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return users;
}

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }
        if(deleteError){
            toast.error(deleteError?.data?.message);
        }
        if(isSuccess){
            toast.success("User Deleted");
        }

    },[error, deleteError, isSuccess])

    if(isLoading) return <Loader/>

    return (

        <AdminLayout>

        <MetaData title={"All Users"}/>
        <div>
            <h1 className="my-5">{data?.users?.length} Users</h1>

            <MDBDataTable 
                data={setUsers()}
                className="px-3"
                bordered
                striped
                hover
            />
        </div>
        </AdminLayout>
    )
}

export default ListUsers;