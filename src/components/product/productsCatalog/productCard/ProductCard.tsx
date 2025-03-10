import styles from './productCard.module.css';
import { ProductData } from "../../../../lib/definitions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { convertCentToWhole } from '../../../../lib/util/currency';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';
import { addProductToCart } from '../../../../redux/cartSlice';

export default function ProductCard(productData: ProductData) {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);

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
                                <button className={`btn btn-warning ${styles.button}`} onClick={() => dispatch(addProductToCart({
                                    productID: productData.productID,
                                    count: 1
                                }))}>Add To Cart</button>
                                : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
