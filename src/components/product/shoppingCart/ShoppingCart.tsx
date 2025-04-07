import styles from './shoppingCart.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import emptyCartImage from '../../../assets/emptyCart.svg';
import { useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import ShoppingCartProductCard from './shoppingCartProductCard/ShoppingCartProductCard';
import { useEffect, useRef, useState } from 'react';
import { convertCentToWholeString } from '../../../lib/util/currency';
import { NavLink } from 'react-router';
import Checkout from './checkout/Checkout';

export default function ShoppingCart() {
    const [listOfPrices, setListOfPices] = useState({} as { [key: number]: number });
    const [totalPrice, setTotalPrice] = useState(0);
    const cart = useAppSelector(state => state.cart);
    const paypayCheckoutRef = useRef(null);

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        <>
                            {
                                Object.entries(cart).map(([productID, count]) => <ShoppingCartProductCard
                                    key={productID}
                                    productID={Number(productID)}
                                    count={count}
                                    addToPriceList={addPriceToListForCard}
                                />)
                            }
                            <div className={styles.paymentContainer} id="paypal-payment-container" ref={paypayCheckoutRef}>
                                <h2>Checkout</h2>
                                <div className={styles.checkoutContainer}>
                                    <Checkout cart={cart}/>
                                </div>
                            </div>
                        </>
                }
            </div>
            {
                Object.entries(cart).length <= 0 ? '' :

                    <nav className={`navbar sticky-bottom ${styles.totalCostBar}`}>
                        <div className={`container-fluid ${styles.innerContainer}`}>
                            <p className="lead">Total: {convertCentToWholeString(totalPrice)} <FontAwesomeIcon icon={faEuroSign}/></p>
                            <p className="lead">With tax and free shipping.</p>
                            <button className={`btn btn-success ${styles.buttonGreenGlow}`} onClick={() => {
                                (paypayCheckoutRef.current! as HTMLDivElement).scrollIntoView({
                                    behavior: 'smooth'
                                });
                            }}>Checkout</button>
                        </div>
                    </nav>

            }
        </>
    );
}