import { OrderData } from '../../../lib/definitions';
import styles from './order.module.css';

export default function Order({ order }: { order: OrderData }) {
    return (
        <div className={styles.mainContainer}>
            <p>order id; {order.id}</p>
        </div>
    );
}