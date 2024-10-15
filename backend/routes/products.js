import express from "express";
import { canUserReview, createProductReview, deleteProduct, deleteProductImage, deleteReview, getAdminProducts, getProductDetails, getProductReviews, getProducts, newProduct, updateProduct, uploadProductImage } from "../controllers/productController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router = express.Router();

router.route('/products').get(getProducts);
router.route('/products/:id').get(getProductDetails);
router.route("/can_review").get(isAuthenticatedUser, canUserReview);

router.route('/admin/products').post(isAuthenticatedUser,authorizeRoles("admin"),newProduct);
router.route('/admin/products/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
router.route('/admin/products/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);
router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);

router.route("/reviews")
        .put(isAuthenticatedUser,createProductReview)
        .get(isAuthenticatedUser,getProductReviews)
        .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteReview)

router.route('/admin/products/:id/upload_images').put(isAuthenticatedUser,authorizeRoles("admin"),uploadProductImage);
router.route('/admin/products/:id/delete_images').put(isAuthenticatedUser,authorizeRoles("admin"),deleteProductImage);

export default router;