import styles from './shoppingCartProductCard.module.css';
import { useEffect, useState } from "react";
import { ProductData, ShoppingCart } from "../../../../lib/definitions";
import { convertCentToWholeString } from "../../../../lib/util/currency";
import productDetails from "../../../../lib/actions/product/productDetails";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faEuroSign } from '@fortawesome/free-solid-svg-icons';
import addProductToCart from '../../../../lib/actions/cart/addProductToCart';
import { useAppDispatch } from '../../../../lib/hooks/reduxTypedHooks';
import { updateCart } from '../../../../redux/cartSlice';
import { setMessageData } from '../../../../redux/popupMessageSlice';
import removeProductFromCart from '../../../../lib/actions/cart/removeProductFromCart';

export default function ShoppingCartProductCard({
    productID,
    count,
    addToPriceList
}: {
    productID: number,
    count: number,
    addToPriceList: (productID: number, priceInCent: number) => void
}) {
    const dispatch = useAppDispatch();
    const [productData, setProductData] = useState({} as ProductData);
    const [additionTrigger, setAdditionTrigger] = useState(false);
    const [removalTrigger, setRemovalTrigger] = useState(false);
    const [removeProductFromCartTrigger, setRemoveProductFromCartTrigger] = useState(false);

    useEffect(() => {
        (async () => {
            const actionResponse = await productDetails(productID);
            if (actionResponse.responseStatus === 200) {
                setProductData(actionResponse.data!);
                addToPriceList(productID, actionResponse.data!.price * count || 0);
            }
        })();
    }, [productID]);

    useEffect(() => {
        if (productData.price) {
            addToPriceList(productID, productData.price * count || 0);
        }
    }, [count, productData]);

    useEffect(() => {
        if (additionTrigger) {
            (async () => {
                const addition = await addProductToCart(productData.productID, 1);
                if (addition.responseStatus === 200) {
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

    useEffect(() => {
        if (removalTrigger) {
            (async () => {
                const removal = await removeProductFromCart(productData.productID, 1);
                if (removal.responseStatus === 200) {
                    dispatch(updateCart(removal.data as ShoppingCart))
                    dispatch(setMessageData({
                        duration: 4000,
                        isShown: true,
                        text: 'Product removed from cart!',
                        type: 'success'
                    }));
                } else if ([400, 500].includes(removal.responseStatus)) {
                    dispatch(setMessageData({
                        duration: 5000,
                        isShown: true,
                        text: removal.msg,
                        type: 'error'
                    }));
                }
                setRemovalTrigger(false);
            })();
        }
    }, [removalTrigger]);

    useEffect(() => {
        if (removeProductFromCartTrigger) {
            (async () => {
                const removal = await removeProductFromCart(productData.productID, count);
                if (removal.responseStatus === 200) {
                    dispatch(updateCart(removal.data as ShoppingCart))
                    dispatch(setMessageData({
                        duration: 4000,
                        isShown: true,
                        text: 'Product removed from cart!',
                        type: 'success'
                    }));
                    addToPriceList(productID, 0);
                } else if ([400, 500].includes(removal.responseStatus)) {
                    dispatch(setMessageData({
                        duration: 5000,
                        isShown: true,
                        text: removal.msg,
                        type: 'error'
                    }));
                }
                setRemoveProductFromCartTrigger(false);
            })();
        }
    }, [removeProductFromCartTrigger]);

    return (
        <div className={`card mb-3 ${styles.cardWrapper}`}>
            <div className={`row g-0 `}>
                <div className={`col-md-4 ${styles.imageWrapper}`}>
                    <img src={`/api/file/pic/${productData.thumbnailID}`} className="img-fluid rounded-start" alt={`A picture of ${productData.name}`} />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{productData.name}</h5>
                        <p className={`card-text ${styles.price}`}>ID: {productData.productID}</p>
                        <p className={`card-text ${styles.price}`}>Price: {convertCentToWholeString(productData.price)} <FontAwesomeIcon icon={faEuroSign} /></p>
                        <div className={styles.quantityWrapper}>
                            <p className={`card-text ${styles.count}`}>Count: {count}</p>
                            {
                                count < productData.stockCount ?
                                    <button className="btn btn-outline-success" disabled={additionTrigger} onClick={() => setAdditionTrigger(true)}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                    : ''
                            }
                            {
                                count > 0 ?
                                    <button className="btn btn-outline-danger" disabled={removalTrigger} onClick={() => setRemovalTrigger(true)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    : ''
                            }
                            <button className="btn btn-outline-warning" disabled={removeProductFromCartTrigger} onClick={() => setRemoveProductFromCartTrigger(true)}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}