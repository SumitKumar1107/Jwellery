import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import order from "../models/order.js";
import Product from "../models/product.js"
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import {delete_file, upload_file} from '../utils/cloudinary.js'

//Create new Product => /api/v1/products 
export const getProducts = catchAsyncErrors(async (req,res) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product,req.query).search().filters();
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products,
    })
})

//Create new Product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req,res) => {
    req.body.user = req.user._id;
    const product = await Product.create(req.body);
    res.status(200).json({
        product,
    })
})

//Create new Product => /api/v1/admin/products/:id
export const getProductDetails = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req?.params?.id).populate('reviews.user');

    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    };
  
    res.status(200).json({
        product,
    })
})

//Update product details => /api/v1/admin/products/:id
export const updateProduct = catchAsyncErrors(async (req,res) => {
    let product = await Product.findById(req?.params?.id);

    if(!product){
        return res.status(404).json({
        error : "Product not found",
    });
}
    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {new:true});

    res.status(200).json({
        product,
    })
})

//Update product details => /api/v1/admin/products/:id
export const deleteProduct = catchAsyncErrors(async (req,res) => {
    const product = await Product.findById(req?.params?.id);

    if(!product){
        return res.status(404).json({
        error : "Product not found",
    });
}

    //deleting image associated with product
    for(let i=0;i<product?.images?.length;i++){
        await delete_file(product?.images[i].public_id)
    }

    await Product.deleteOne();

    res.status(200).json({
        message : 'Product deleted'
    })
})

//create/update product review => /api/v1/reviews
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req?.user?._id,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    };

    // Check if user has already reviewed
    const isReviewed = product?.reviews?.find(
        (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
        // Update existing review
        product.reviews.forEach((review) => {
            if (review?.user?.toString() === req?.user?._id.toString()) {
                review.comment = comment;
                review.rating = Number(rating);
            }
        });
    } else {
        // Add new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Recalculate ratings
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});


// Get Product Reviews   =>   /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id).populate("reviews.user");

    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    };

    res.status(200).json({
        reviews: product.reviews
    })
})

//delete product review => /api/v1/admin/reviews
export const deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    };

    product.reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString() 
    )

    product.numOfReviews = product.reviews.length;
    product.ratings = product.numOfReviews === 0 ? 0 : product.reviews.reduce((acc,item) => item.rating+acc,0) / product.numOfReviews;

    await product.save({validateBeforeSave : false});

    res.status(200).json({
        success : true,
    })
})

//Can user Review => /api/v1/can_review
export const canUserReview = catchAsyncErrors(async(req,res)=>{
    const orders = await order.find({
        user: req.user._id,
        "orderItems.product" : req.query.productId,
    })

    if(orders.length === 0){
        return res.status(200).json({canReviewed : false});
    }

    res.status(200).json({
        canReviewed : true,
    })
})

//Get products - ADMIN => /api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req,res,next)=>{
    const products = await Product.find();

    res.status(200).json({
        products,
    })
})

//Upload product images => /api/v1/admin/products/:id/upload_images
export const uploadProductImage = catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req?.params?.id);

    if (!product) {
        res.status(404);
        throw new ErrorHandler("Product not found", 404)
    }

    try {
        const uploader = async (image) => upload_file(image, "shopit/products");
        const urls = await Promise.all(req.body.images.map(uploader));

        product.images.push(...urls);
        await product.save({validateBeforeSave: false});

        res.status(200).json({
            product,
        });
    } catch (error) {
        return next(new ErrorHandler("Image upload failed", 500));
    }  
})

//delete product images => /api/v1/admin/products/:id/delete_images
export const deleteProductImage = catchAsyncErrors( async ( req, res ) => {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const isDeleted = await delete_file(req.body.imgId);
  
    if (isDeleted) {
      product.images = product?.images?.filter(
        (img) => img.public_id !== req.body.imgId
      );
  
      await product?.save({validateBeforeSave:false});
    }
  
    res.status(200).json({
      product,
    });
});
