import React, { useEffect } from "react";
import toast from 'react-hot-toast';
import Loader from "../layout/Loader";
import {MDBDataTable} from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDeleteProductMutation, useGetAdminProductsQuery } from "../../redux/api/productsApi";
import AdminLayout from "../layout/AdminLayout";
import { useDeleteOrderMutation, useGetAdminOrdersQuery } from "../../redux/api/orderApi";

const ListOrders = () => {

    const {data, isLoading, error} = useGetAdminOrdersQuery();
    const [deleteOrder, {error:deleteError, isLoading :isDeleteLoading ,  isSuccess}] = useDeleteOrderMutation();
   

    const deleteOrderHandler = (id) => {
        deleteOrder(id);
    }

    const setOrders = () => {
    const orders = {
        columns: [
          {
            label: "ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "Payment Status",
            field: "paymentStatus",
            sort: "asc",
          },
          {
            label: "Order Status",
            field: "orderStatus",
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

    data?.orders?.forEach((order) => {
        orders.rows.push({
          id: order?._id,
          paymentStatus : order?.paymentInfo?.status?.toUpperCase(),
          orderStatus: order?.orderStatus,
          actions: (
            <>
              <Link
                to={`/admin/orders/${order?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => deleteOrderHandler(order?._id)}
                disabled={isDeleteLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return orders;
}

    useEffect(()=>{
        if(error){
            toast.error(error?.data?.message);
        }
        if(deleteError){
            toast.error(deleteError?.data?.message);
        }
        if(isSuccess){
            toast.success("Order Deleted");
        }

    },[error, deleteError, isSuccess])

    if(isLoading) return <Loader/>

    return (

        <AdminLayout>

        <MetaData title={"All Orders"}/>
        <div>
            <h1 className="my-5">{data?.orders?.length} Orders</h1>

            <MDBDataTable 
                data={setOrders()}
                className="px-3"
                bordered
                striped
                hover
            />
        </div>
        </AdminLayout>
    )
}

export default ListOrders;