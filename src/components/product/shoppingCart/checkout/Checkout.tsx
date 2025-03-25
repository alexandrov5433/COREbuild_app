import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAppDispatch } from "../../../../lib/hooks/reduxTypedHooks";
import { ShoppingCart } from "../../../../lib/definitions";
import placeNewOrder from "../../../../lib/actions/order/placeNewOrder";
import { setMessageData } from "../../../../redux/popupMessageSlice";
import collectPayment from "../../../../lib/actions/order/collectPayment";
import { updateCart } from "../../../../redux/cartSlice";
import cancelOrder from "../../../../lib/actions/order/cancelOrder";
import { useNavigate } from "react-router";

export default function Checkout({ cart }: { cart: ShoppingCart }) {
    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    async function onCreateOrder(): Promise<string | any> {
        const newOrderResponse = await placeNewOrder(cart);
        if (newOrderResponse.status === 200) {
            return newOrderResponse.data! as string; //paypal_order_id
        } else if ([400, 500].includes(newOrderResponse.status)) {
            appDispatch(setMessageData({
                duration: 6000,
                isShown: true,
                text: newOrderResponse.msg,
                type: 'error'
            }));
            throw new Error(newOrderResponse.msg);
        }
    };

    async function onApprove(data: any, _actions: any) {
        const collectPaymentResponse = await collectPayment(data.orderID);
        if (collectPaymentResponse.status === 200) {
            appDispatch(updateCart(collectPaymentResponse.data?.userData.shopping_cart || {}));
            appDispatch(setMessageData({
                duration: 6000,
                isShown: true,
                text: `Order placed! ID: ${collectPaymentResponse.data?.updatedOrderData.id}`,
                type: 'success'
            }));
            navigate(`/orders#${collectPaymentResponse.data?.updatedOrderData.id}`);
        } else if ([400, 500].includes(collectPaymentResponse.status)) {
            appDispatch(setMessageData({
                duration: 6000,
                isShown: true,
                text: collectPaymentResponse.msg,
                type: 'error'
            }));
            throw new Error(collectPaymentResponse.msg);
        }
    };

    async function onCancel(data: any) {
        const cancelationResult = await cancelOrder(data.orderID as string);
        if (cancelationResult.status === 200) {
            appDispatch(setMessageData({
                duration: 3000,
                isShown: true,
                text: `Order canceled! ID: ${data.orderID}`,
                type: 'success'
            }));
        } 
    }

    return (
        <PayPalButtons
            style={{
                layout: "vertical"
            }}
            createOrder={onCreateOrder}
            onApprove={onApprove}
            onCancel={onCancel}
        />
    );
}