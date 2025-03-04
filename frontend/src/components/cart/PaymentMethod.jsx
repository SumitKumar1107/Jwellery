import React, { useEffect, useState } from 'react';
import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
import { useSelector } from 'react-redux';
import { calculateOrderCost } from "../helpers/helpers";
import { useCreateNewOrderMutation, useStripeCheckOutSessionMutation } from '../../redux/api/orderApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PaymentMethod = () => {
    const [method, setMethod] = useState("");
    const navigate = useNavigate();

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const [createNewOrder, {error,isSuccess}] = useCreateNewOrderMutation();
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateOrderCost(cartItems);
    const [stripeCheckOutSession, {data : checkoutData , error:checkoutError, isloading}] = useStripeCheckOutSessionMutation();


    useEffect(()=>{
        if(checkoutData) {
            window.location.href = checkoutData?.url;
        }
        if(checkoutError){
            toast.error(checkoutError?.data?.message)
        }
    },[checkoutData,checkoutError])

    // Listen for order creation success or error
    useEffect(() => {
        if (error) {
            toast.error(error?.data?.message || 'Something went wrong!');
        }
        if (isSuccess) {
            toast.success("Order successfully created!");
            navigate("/me/orders?order_success=true");  // Navigate to the homepage or desired route
        }
    }, [error, isSuccess]);  // Added `navigate` as a dependency

    const submitHandler = (e) => {
        e.preventDefault();

        if (!method) {
            toast.error("Please select a payment method.");
            return;
        }

        if (method === "COD") {
            const orderData = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice,
                shippingAmount: shippingPrice,
                taxAmount: taxPrice,
                totalAmount: totalPrice,
                paymentInfo: {
                    status: "Not Paid"
                },
                paymentMethod: "COD"
            };

            // Call the mutation to create the order
            createNewOrder(orderData);
        } else if (method === "Card") {
            // Redirect to Stripe checkout or implement card payment logic
            const orderData = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice,
                shippingAmount: shippingPrice,
                taxAmount: taxPrice,
                totalAmount: totalPrice,
                paymentMethod: "Card",
            };

            stripeCheckOutSession(orderData)
        }
    };

    return (
        <>
            <MetaData title={"Payment Method"} />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form
                        className="shadow rounded bg-body"
                        onSubmit={submitHandler}
                    >
                        <h2 className="mb-4">Select Payment Method</h2>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="codradio"
                                value="COD"
                                onChange={(e) => setMethod("COD")}
                            />
                            <label className="form-check-label" htmlFor="codradio">
                                Cash on Delivery
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="payment_mode"
                                id="cardradio"
                                value="Card"
                                onChange={(e) => setMethod("Card")}
                            />
                            <label className="form-check-label" htmlFor="cardradio">
                                Card - VISA, MasterCard
                            </label>
                        </div>

                        <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={isloading}>
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentMethod;
