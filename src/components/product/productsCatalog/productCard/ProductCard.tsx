import styles from './productCard.module.css';
import { ProductData, ShoppingCart } from "../../../../lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { convertCentToWhole } from '../../../../lib/util/currency';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';
import { useEffect, useState } from 'react';
import addProductToCart from '../../../../lib/actions/addProductToCart';
import { setMessageData } from '../../../../redux/popupMessageSlice';
import { updateCart } from '../../../../redux/cartSlice';

export default function ProductCard(productData: ProductData) {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);
    const [additionTrigger, setAdditionTrigger] = useState(false);

    useEffect(() => {
        if (additionTrigger) {
            (async () => {
                const addition = await addProductToCart(productData.productID, 1);
                if (addition.responseStatus === 200) {
                    console.log(addition.data);
                    dispatch(updateCart(addition.data as ShoppingCart))
                    dispatch(setMessageData({
                        duration: 4000,
                        isShown: true,
                        text: 'Product added to cart!',
                        type: 'success'
                    }));
                } else if ([400, 500].includes(addition.responseStatus)) {
                    dispatch(setMessageData({
                        duration: 5000,
                        isShown: true,
                        text: addition.msg,
                        type: 'error'
                    }));
                }
                setAdditionTrigger(false);
            })();
        }
    }, [additionTrigger]);

    return (
        <div className="col">
            <div className={`card h-100 ${styles.card}`}>
                <img src={`/api/file/pic/${productData.thumbnailID}`} className="card-img-top" alt={`A picture of the product with name ${productData.name}.`} />
                <div className={`card-body ${styles.cardBody}`}>
                    <h5 className="card-title">{productData.name}</h5>
                    <h6 className={`card-subtitle mb-3 ${productData.stockCount > 0 ? styles.inStock : styles.notAvailable}`}>
                        {
                            productData.stockCount > 0 ?
                                <>
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                    In Stock
                                </>
                                :
                                <>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                    Not Available
                                </>
                        }
                    </h6>
                    <p className={`card-text ${styles.price}`}>
                        <FontAwesomeIcon icon={faEuroSign} />
                        {convertCentToWhole(productData.price)}
                    </p>
                    <div className={styles.overlay}>
                        <button className={`btn btn-primary ${styles.button}`}>View Details</button>
                        {
                            productData.stockCount > 0 && !userData.is_employee ?
                                <button className={`btn btn-warning ${styles.button}`} disabled={additionTrigger} onClick={() => setAdditionTrigger(true)}>Add To Cart</button>
                                : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
