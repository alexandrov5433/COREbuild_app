import styles from './shoppingCart.module.css';
import { useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import ShoppingCartProductCard from './shoppingCartProductCard/ShoppingCartProductCard';
import { useState } from 'react';
import { convertCentToWhole } from '../../../lib/util/currency';

export default function ShoppingCart() {
    const [totalPrice, setTotalPrice] = useState(0);
    const cart = useAppSelector(state => state.cart);

    function totalPriceSetterForCard(priceToAddInCent: number) {
        setTotalPrice(state => state += priceToAddInCent);
    }
    return (
        <>
            <div className={styles.wrapper}>
                <h1>Shopping Cart</h1>
                {
                    Object.entries(cart).map(([productID, count]) => <ShoppingCartProductCard
                        key={productID}
                        productID={Number(productID)}
                        count={count}
                        priceSetter={totalPriceSetterForCard}
                        />)
                }
            </div>
            <nav className={`navbar sticky-bottom ${styles.totalCostBar}`}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">{convertCentToWhole(totalPrice)}</a>
                </div>
            </nav>
        </>
    );
}