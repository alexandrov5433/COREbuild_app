import styles from './productCard.module.css';
import { ProductData, ShoppingCart } from "../../../../lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faCircleCheck, faCircleXmark, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartHollow } from '@fortawesome/free-regular-svg-icons';
import { convertCentToWholeString } from '../../../../lib/util/currency';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';
import { useEffect, useState } from 'react';
import addProductToCart from '../../../../lib/actions/cart/addProductToCart';
import { setMessageData } from '../../../../redux/popupMessageSlice';
import { updateCart } from '../../../../redux/cartSlice';
import { NavLink } from 'react-router';
import addProductToFavorite from '../../../../lib/actions/favorite/addProductToFavorite';
import { updateFavorite } from '../../../../redux/favoriteSlice';
import deleteProductFromFavorite from '../../../../lib/actions/favorite/deleteProductFromFavorite';

export default function ProductCard(productData: ProductData) {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);
    const favoriteData = useAppSelector(state => state.favorite);

    const [additionTrigger, setAdditionTrigger] = useState(false);
    const [isFavoriteButtonsBlocked, setFavoriteButtonsBlocked] = useState(false);

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

    async function saveProductToFavorites(productID: number) {
        if (!productID || !userData?.userID) {
            return;
        }
        setFavoriteButtonsBlocked(true);
        const addToFavoritesAction = await addProductToFavorite(userData.userID, productID);
        if (addToFavoritesAction.responseStatus === 200) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: 'Product saved to favorites.',
                type: 'success'
            }));
            dispatch(updateFavorite(addToFavoritesAction.data!));
        } else if (addToFavoritesAction.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: addToFavoritesAction.msg,
                type: 'error'
            }));
        }
        setFavoriteButtonsBlocked(false);
    }

    async function removeProductToFavorites(productID: number) {
        if (!productID || !userData?.userID) {
            return;
        }
        setFavoriteButtonsBlocked(true);
        const deleteProductFromFavoritesAction = await deleteProductFromFavorite(userData.userID, productID);
        if (deleteProductFromFavoritesAction.responseStatus === 200) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: 'Product deleted from favorites.',
                type: 'success'
            }));
            dispatch(updateFavorite(deleteProductFromFavoritesAction.data!));
        } else if (deleteProductFromFavoritesAction.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: deleteProductFromFavoritesAction.msg,
                type: 'error'
            }));
        }
        setFavoriteButtonsBlocked(false);
    }

    return (
        <div className="col">
            <div className={`card h-100 ${styles.card}`}>
                {
                    userData.userID && !userData.is_employee ?
                        (
                            favoriteData?.products?.includes(productData.productID) ?
                                <button className={`btn ${styles.heart}`} onClick={() => removeProductToFavorites(productData.productID)} disabled={isFavoriteButtonsBlocked}>
                                    <FontAwesomeIcon icon={faHeart} />
                                </button>
                                :
                                <button className={`btn ${styles.heart}`} onClick={() => saveProductToFavorites(productData.productID)} disabled={isFavoriteButtonsBlocked}>
                                    <FontAwesomeIcon icon={faHeartHollow} />
                                </button>
                        )
                        : ''
                }
                <NavLink to={`/product-details/${productData.productID || 0}`}>
                    <img src={`/api/file/pic/${productData.thumbnailID}`} className="card-img-top" alt={`A picture of the product with name ${productData.name}.`} />
                </NavLink>
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
                        {convertCentToWholeString(productData.price)}
                    </p>
                    <div className={styles.overlay}>
                        <NavLink className={`btn btn-primary ${styles.button}`} to={`/product-details/${productData.productID}`}>View Details</NavLink>
                        {
                            userData.userID && productData.stockCount > 0 && !userData.is_employee ?
                                <button className={`btn btn-warning ${styles.button}`} disabled={additionTrigger} onClick={() => setAdditionTrigger(true)}>Add To Cart</button>
                                : ''
                        }
                        {
                            userData.userID && userData.is_employee ?
                                <NavLink className={`btn btn-danger ${styles.button}`} to={`/edit-product/${productData.productID}`}>Edit Product</NavLink>
                                : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
