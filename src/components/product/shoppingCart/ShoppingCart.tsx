import styles from './shoppingCart.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import emptyCartImage from '../../../assets/emptyCart.svg';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import ShoppingCartProductCard from './shoppingCartProductCard/ShoppingCartProductCard';
import { useEffect, useState } from 'react';
import { convertCentToWhole } from '../../../lib/util/currency';
import { NavLink } from 'react-router';
import placeNewOrder from '../../../lib/actions/placeNewOrder';
import { setMessageData } from '../../../redux/popupMessageSlice';

export default function ShoppingCart() {
    const [listOfPrices, setListOfPices] = useState({} as { [key: number]: number });
    const [totalPrice, setTotalPrice] = useState(0);
    const cart = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();

    function addPriceToListForCard(productID: number, priceInCent: number) {
        setListOfPices(state => {
            const newState = { ...state };
            const priceEntry = {};
            (priceEntry as any)[productID] = priceInCent;
            Object.assign(newState, priceEntry);
            return newState;
        });
    }

    useEffect(() => {
        if (cart && listOfPrices) {
            let sum = 0;
            Object.entries(listOfPrices).forEach(([key, val]) => {
                if (Object.hasOwn(cart, key)) {
                    sum += val
                }
            });
            setTotalPrice(sum);
        }
    }, [listOfPrices]);

    // test
    const [testTrigger, setTestTrigger] = useState(false);


    useEffect(() => {
        if (testTrigger) {
            (async () => {
                setTestTrigger(false);
                const newOrderResponse = await placeNewOrder(cart);
                if (newOrderResponse.status === 200) {
                    console.log('newOrder', newOrderResponse.data);
                    
                    dispatch(setMessageData({
                        duration: 3000,
                        isShown: true,
                        text: 'Order placed.',
                        type: 'success'
                    }));
                } else if ([400, 500].includes(newOrderResponse.status)) {
                    dispatch(setMessageData({
                        duration: 6000,
                        isShown: true,
                        text: newOrderResponse.msg,
                        type: 'error'
                    }));
                }
            })();
        }
    }, [testTrigger]);



    // test


    return (
        <>
            <div className={styles.wrapper}>
                <h1>Shopping Cart</h1>
                {
                    Object.entries(cart).length <= 0 ?
                        <div className={styles.emptyCartWrapper}>
                            <img src={emptyCartImage} className="img-fluid" alt="..." />
                            <p className="lead">There are no items in your shopping cart.</p>
                            <p className="lead">Please, add one or more of our products.</p>
                            <NavLink className="btn btn-success" to="/products-catalog">Browse Products</NavLink>
                        </div>
                        :
                        Object.entries(cart).map(([productID, count]) => <ShoppingCartProductCard
                            key={productID}
                            productID={Number(productID)}
                            count={count}
                            addToPriceList={addPriceToListForCard}
                        />)   
                }
            </div>
            {
                Object.entries(cart).length <= 0 ? '' :
                  
                        <nav className={`navbar sticky-bottom ${styles.totalCostBar}`}>
                            <div className={`container-fluid ${styles.innerContainer}`}>
                                <p className="lead">Total: {convertCentToWhole(totalPrice)} <FontAwesomeIcon icon={faEuroSign} /></p>
                                <button className="btn btn-success" disabled={testTrigger} onClick={() => setTestTrigger(true)}>Place Order</button>
                            </div>
                        </nav>
              
            }
        </>
    );
}