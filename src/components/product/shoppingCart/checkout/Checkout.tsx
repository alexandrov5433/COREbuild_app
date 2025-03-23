import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAppDispatch } from "../../../../lib/hooks/reduxTypedHooks";
import { ShoppingCart } from "../../../../lib/definitions";
import placeNewOrder from "../../../../lib/actions/order/placeNewOrder";
import { setMessageData } from "../../../../redux/popupMessageSlice";
import collectPayment from "../../../../lib/actions/order/collectPayment";
import { updateCart } from "../../../../redux/cartSlice";
import cancelOrder from "../../../../lib/actions/order/cancelOrder";

export default function Checkout({ cart }: { cart: ShoppingCart }) {
    const appDispatch = useAppDispatch();

    async function onCreateOrder(): Promise<string | any> {
        const newOrderResponse = await placeNewOrder(cart);
        if (newOrderResponse.status === 200) {
            console.log('newOrderResponse.data', newOrderResponse.data);
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
        console.log('onApprove data', data);
        const collectPaymentResponse = await collectPayment(data.orderID);
        if (collectPaymentResponse.status === 200) {
            console.log('collectPaymentResponse.data', collectPaymentResponse.data);
            appDispatch(updateCart(collectPaymentResponse.data?.userData.shopping_cart || {}));
            appDispatch(setMessageData({
                duration: 3000,
                isShown: true,
                text: `Order placed! ID: ${collectPaymentResponse.data?.paypal_order_id}`,
                type: 'success'
            }));
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
        console.log('onApprove data.orderID', data.orderID);
        const cancelationResult = await cancelOrder(data.orderID as string);
        if (cancelationResult.status === 200) {
            console.log('cancelationResult.msg', cancelationResult.msg);
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