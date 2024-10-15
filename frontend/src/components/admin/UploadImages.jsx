import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import MetaData from "../layout/MetaData";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteProductImagesMutation, useGetProductDetailsQuery, useUploadProductImagesMutation } from "../../redux/api/productsApi";
import toast from "react-hot-toast";

const UploadImages = () => {

    const fileInputRef = useRef(null);

    const params = useParams();
    const navigate = useNavigate();

    const [images,setImages] = useState([]);
    const [imagesPreview,setImagesPreview] = useState([]);
    const [uploadImages,setUploadImages] = useState([]);

    const {data} = useGetProductDetailsQuery(params?.id);

    const [uploadProductImages, {isLoading,error,isSuccess}] = useUploadProductImagesMutation();
    const [deleteProductImages, {isLoading : isDeleteLoading , error:deleteError }] = useDeleteProductImagesMutation();

    useEffect(()=>{
        if(data?.product){
            setUploadImages(data?.product?.images);
        }
    },[data])

    const onChange = (e) => {

        const files = Array.from(e.target.files);
        const reader = new FileReader();

        files.forEach(((file) => {
            reader.onload = () => {
            if(reader.readyState === 2){
                setImagesPreview((oldArray) => [...oldArray,reader.result]);
                setImages((oldArray) => [...oldArray,reader.result]);
            }
          };
           reader.readAsDataURL(e.target.files[0]);
        }))
    }

    const handleImagesPreviewDelete = (image) => {
        const filteredImagePreview = imagesPreview.filter((img) => img!=image);

        setImages(filteredImagePreview);
        setImagesPreview(filteredImagePreview);
    }

    const handleResetFileInput = () => {
        if(fileInputRef.current){
            fileInputRef.current.value = "";
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();

        uploadProductImages({id:params?.id,body:{images}})
    }

    useEffect(()=>{
        if (error) {
        toast.error(error?.data?.message);
    }

    if(deleteError){
        toast.error(deleteError?.data?.message);
    }
  
      if (isSuccess) {
        setImagesPreview([]);
        toast.success("Images Uploaded");
        navigate("/admin/products");
      }
    }, [error, isSuccess, data, deleteError])

    const deleteImage = (imgId) =>{
        deleteProductImages({id:params?.id,body:{imgId}})
    }

    return (
        <AdminLayout>
            <MetaData title={"Upload Images"} />
            <div className="row wrapper">
      <div className="col-10 col-lg-8 mt-5 mt-lg-0">
        <form className="shadow rounded bg-body" enctype="multipart/form-data" onSubmit={submitHandler}>
          <h2 className="mb-4">Upload Product Images</h2>

          <div className="mb-3">
            <label for="customFile" className="form-label">Choose Images</label>

            <div className="custom-file">
              <input
                ref={fileInputRef}
                type="file"
                name="product_images"
                className="form-control"
                id="customFile"
                multiple
                onChange={onChange}
                onClick={handleResetFileInput}
              />
            </div>

            {imagesPreview.length >0 && (
                <div className="new-images my-4">
              <p className="text-warning">New Images:</p>
              <div className="row mt-4">
                {imagesPreview?.map((img) => (
                    <div className="col-md-3 mt-2">
                  <div className="card">
                    <img
                      src={img}
                      alt="Card"
                      className="card-img-top p-2"
                     style={{width: "100%", height: "80px"}}
                    />
                    <button
                      style={{
                                                backgroundColor: "#dc3545",
                                                borderColor: "#dc3545",
                                            }}
                      type="button"
                      className="btn btn-block btn-danger cross-button mt-1 py-0"
                      onClick={() => handleImagesPreviewDelete(img)}
                    >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>
                ))}
              </div>
            </div>
            )}
            

            {uploadImages?.length > 0 && (
                <div className="uploaded-images my-4">
              <p className="text-success">Product Uploaded Images:</p>
              <div className="row mt-1">
                {uploadImages?.map((img) => (
                    <div className="col-md-3 mt-2">
                  <div className="card">
                    <img
                      src={img?.url}
                      alt="Card"
                      className="card-img-top p-2"
                      style={{width: "100%", height: "80px"}}
                    />
                    <button
                      style={{backgroundColor: "#dc3545", borderColor: "#dc3545"}}
                      className="btn btn-block btn-danger cross-button mt-1 py-0"
                      type="button"
                      disabled={isLoading || isDeleteLoading}
                      onClick={() => deleteImage(img?.public_id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
                ))}
                
              </div>
            </div>
            )}
          </div>

          <button id="register_button" type="submit" className="btn w-100 py-2" disabled={isLoading || isDeleteLoading}>
            Upload
          </button>
        </form>
      </div>
    </div>
        </AdminLayout>
    );
};

export default UploadImages;
