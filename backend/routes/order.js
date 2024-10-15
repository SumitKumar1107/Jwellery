import express from "express";
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, updateOrder, getSales } from "../controllers/orderController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,newOrder);
router.route("/order/:id").get(isAuthenticatedUser,getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser,myOrders);

router
    .route("/admin/get_sales")
    .get(isAuthenticatedUser,authorizeRoles("admin"),getSales);

router
    .route("/admin/orders")
    .get(isAuthenticatedUser,authorizeRoles("admin"),allOrders);

router
     .route("/admin/orders/:id")
     .put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
     .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

export default router;