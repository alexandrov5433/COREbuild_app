import { DISPATCH_ACTION, PayPalButtons, PayPalButtonsComponentProps, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function Checkout() {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [currency, setCurrency] = useState(options.currency);

    const onCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCurrency(value);
        dispatch({
            type: "resetOptions" as DISPATCH_ACTION.RESET_OPTIONS,
            value: {
                ...options,
                currency: value,
            },
        });
    }

    // const onCreateOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
     
    // }

    // const onApproveOrder = (data, actions) => {
    //     return actions.order.capture().then((details) => {
    //         const name = details.payer.name.given_name;
    //         alert(`Transaction completed by ${name}`);
    //     });
    // }

    return (
        <>
            {
                isPending ? <p>LOADING...</p> : (
                    <>
                        <select value={currency} onChange={onCurrencyChange}>
                            <option value="USD">💵 USD</option>
                            <option value="EUR">💶 Euro</option>
                        </select>
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            // createOrder={onCreateOrder}
                            // onApprove={(data, actions) => onApproveOrder(data, actions)}
                        />
                    </>
                )
            }
        </>
    );
}