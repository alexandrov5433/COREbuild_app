import styles from './shoppingCart.module.css';
import { useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import ShoppingCartProductCard from './shoppingCartProductCard/ShoppingCartProductCard';

export default function ShoppingCart() {
    const cart = useAppSelector(state => state.cart);
    return (
        <div className={styles.wrapper}>
            <h1>Shopping Cart</h1>

            {
                cart.map(p => <ShoppingCartProductCard productInCart={p}/>)
            }

        </div>
    );
}