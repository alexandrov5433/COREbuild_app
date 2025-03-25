import styles from './favoriteProducts.module.css';
import { useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';

export default function FavoriteProducts() {
    const userData = useAppSelector(state => state.user);
    const favoriteData = useAppSelector(state => state.favorite);

    return (
        <div>
            favorite products
        </div>
    );
}