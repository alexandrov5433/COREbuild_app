import styles from './productDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faEuroSign, faStar as faStarFull, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarHollow } from '@fortawesome/free-regular-svg-icons';
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { GetRatingAndReviewCountForProductActionData, ProductData, ReviewData } from '../../../lib/definitions';
import productDetails from '../../../lib/actions/productDetails';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import { convertCentToWhole } from '../../../lib/util/currency';
import getCustomerReviewedProduct from '../../../lib/actions/getCustomerReviewedProduct';
import getRatingAndReviewCountForProduct from '../../../lib/actions/getRatingAndReviewCountForProduct';
import getReviewsForProduct from '../../../lib/actions/getReviewsForProduct';

export default function ProductDetails() {
    const { productID } = useParams();
    const dispatch = useAppDispatch();
    const commentFormRef = useRef(null);
    const [productData, setProductData] = useState({} as ProductData);
    const [raitngAndReviewsCount, setRaitngAndReviewsCount] = useState({} as GetRatingAndReviewCountForProductActionData);
    const [productReviews, setProductReviews] = useState([] as Array<ReviewData>);
    const [productReviewCurrentPage, setProductReviewCurrentPage] = useState(1);
    const [productReviewPagesCount, setProductReviewPagesCount] = useState(1);
    const [hasCustomerReviewedProduct, setHasCustomerReviewedProduct] = useState(false);

    const [displayProductNotFound, setDisplayProductNotFound] = useState(false);
    const [displayDescriptionOrComments, setDisplayDescriptionOrComments] = useState('description'); // 'description' || 'comments'
    const [addToCartCount, setAddToCartCount] = useState(1);

    useEffect(() => {
        if (!productID) {
            // TODO show product not found page
            dispatch(setMessageData({
                duration: 4500,
                isShown: true,
                text: 'The products ID is required in order to find it.',
                type: 'error'
            }));
            return;
        }
        (async () => {
            const results = await Promise.all([
                productDetails(productID),
                getCustomerReviewedProduct(productID),
                getRatingAndReviewCountForProduct(productID),
            ]);
            const productDetailsAR = results[0];
            const getCustomerReviewedProductAR = results[1];
            const getRatingAndReviewCountForProductAR = results[2];
            if (productDetailsAR.responseStatus === 200) {
                setProductData(productDetailsAR.data!);

            } else if (productDetailsAR.responseStatus === 204) {
                // product not found
                dispatch(setMessageData({
                    duration: 4500,
                    isShown: true,
                    text: productDetailsAR.msg,
                    type: 'error'
                }));
            } else if ([400, 500].includes(productDetailsAR.responseStatus)) {
                // error
                dispatch(setMessageData({
                    duration: 4500,
                    isShown: true,
                    text: productDetailsAR.msg,
                    type: 'error'
                }));
            }
            if (getCustomerReviewedProductAR.responseStatus === 200) {
                setHasCustomerReviewedProduct(getCustomerReviewedProductAR.data || false);
            }
            if (getRatingAndReviewCountForProductAR.responseStatus === 200) {
                setRaitngAndReviewsCount(getRatingAndReviewCountForProductAR.data!);
            }
        })();
    }, [productID]);

    useEffect(() => {
        if (!productID) {
            return;
        }
        (async () => {
            const getReviewsForProductAR = await getReviewsForProduct(productID, productReviewCurrentPage);
            if (getReviewsForProductAR.responseStatus === 200) {
                setProductReviews(getReviewsForProductAR.data?.reviews || []);
                setProductReviewCurrentPage(getReviewsForProductAR.data?.currentPage || 1);
                setProductReviewPagesCount(getReviewsForProductAR.data?.pagesCount || 1);
            }
        })();
    }, [productReviewCurrentPage]);

    function manageAddToCartValChange(e: ChangeEvent<HTMLInputElement>) {
        let quantity = Number(e.target.value);
        if (!quantity) {
            quantity = 1;
        } else if (!Number.isInteger(quantity)) {
            quantity = Math.ceil(quantity);
        }
        if (quantity > productData.stockCount) {
            quantity = productData.stockCount
        }
        setAddToCartCount(quantity);
    }

    function toggleDescriptionAndComments(choise: 'description' | 'comments') {
        if (!['description', 'comments'].includes(choise)) {
            choise = 'description';
        }
        setDisplayDescriptionOrComments(choise);
    }

    function submitComment(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log([...formData]);
    }

    function generateRatingAsStars() {
        const whole = Math.trunc(raitngAndReviewsCount.rating);
        const isRest = !!(raitngAndReviewsCount.rating % 1);
        const stars = [];
        for (let i = 1; i <= whole; i++) {
            stars.push(<FontAwesomeIcon key={i} icon={faStarFull} />)
        }
        if (isRest) {
            stars.push(<FontAwesomeIcon icon={faStarHalfStroke} />);
        }
        if (whole === 0) {
            for (let i = 1; i <= 5; i++) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarHollow} />)
            }
        }
        return stars;
    }

    return (
        <div className={styles.wrapper}>
            <h1>Product Details</h1>
            {
                Object.keys(productData).length <= 0 ?
                    <div>
                        Product not found.
                    </div>
                    :
                    <div className={styles.contentContainer}>
                        <h2>{productData.name}</h2>
                        <div className={styles.carouselContainer}>
                            <div id="carousel-product-images" className={`carousel slide ${styles.imagesCarousel}`} data-bs-ride="carousel">
                                <div className={`carousel-inner ${styles.innerContainer}`}>
                                    <div className={`carousel-item active`} data-bs-interval="10000">
                                        <img src={`/api/file/pic/${productData.thumbnailID}`} className="d-block " alt={`A picture of the product ${productData.name}.`} />
                                    </div>
                                    {
                                        productData.pictures.length <= 0 ? '' :
                                            productData.pictures.map(id =>
                                                <div className={`carousel-item`} data-bs-interval="10000" key={id}>
                                                    <img src={`/api/file/pic/${id}`} className="d-block " alt={`A picture of the product ${productData.name}.`} />
                                                </div>
                                            )
                                    }
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carousel-product-images" data-bs-slide="prev">
                                    <span className={`carousel-control-prev-icon`} aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carousel-product-images" data-bs-slide="next">
                                    <span className={`carousel-control-next-icon`} aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                        <div className={styles.purchasing}>
                            <p className={`${styles.price}`}>{convertCentToWhole(productData.price)} <FontAwesomeIcon icon={faEuroSign} /></p>

                            <p className={`${styles.raiting}`}>Rating: {generateRatingAsStars()} ({raitngAndReviewsCount.reviewsCount})</p>

                            <p className={`${styles.availability} ${productData.stockCount > 0 ? styles.inStock : styles.notAvailable}`}>
                                {
                                    productData.stockCount > 0 ?
                                        <>
                                            <FontAwesomeIcon icon={faCircleCheck} /> {productData.stockCount} In Stock
                                        </>
                                        :
                                        <>
                                            <FontAwesomeIcon icon={faCircleXmark} /> None In Stock
                                        </>
                                }
                            </p>

                            {
                                productData.stockCount <= 0 ? '' :
                                    <>
                                        <label htmlFor="addToCartCount">Quantity: <input id="addToCartCount" type="number" step={1} defaultValue={addToCartCount} onChange={manageAddToCartValChange} /></label>

                                        <button className={`btn btn-success ${styles.addToCartButton}`}>Add {addToCartCount} to cart</button>
                                    </>
                            }

                        </div>
                        <div className={styles.smallInfos}>
                            <div className={styles.category}>
                                <h3>Category</h3>
                                <p>{productData.category}</p>
                            </div>
                            <div className={styles.manufacturer}>
                                <h3>Manufacturer</h3>
                                <p>{productData.manufacturer}</p>
                            </div>
                        </div>
                        <div className={styles.specsDoc}>
                            <p>Specifications Document</p>
                            <a href={`/api/file/doc/${productData.specsDocID}`} download={productData.name || 'Product Specifications'}>Download Document</a>
                        </div>
                        <div className={styles.descriptionAndComments}>
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button className={`nav-link ${displayDescriptionOrComments === 'description' ? 'active' : ''}`} aria-current="page" onClick={() => toggleDescriptionAndComments('description')}>Description</button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${displayDescriptionOrComments === 'comments' ? 'active' : ''}`} aria-current="page" onClick={() => toggleDescriptionAndComments('comments')}>Reviews</button>
                                </li>
                            </ul>
                            <div>
                                {
                                    displayDescriptionOrComments === 'description' ?
                                        <p className={styles.description}>{productData.description}</p>
                                        :
                                        <div className={styles.commentsContainer}>
                                            <form ref={commentFormRef} onSubmit={submitComment}>
                                                <div className="mb-3">
                                                    <label>
                                                        Rate this product
                                                    </label>
                                                    <div className={styles.ratingButtons}>
                                                        <input type="radio" className="btn-check" name="rating" id="rating5" value="5" />
                                                        <label htmlFor="rating5">
                                                            <FontAwesomeIcon icon={faStarFull} />
                                                        </label>

                                                        <input type="radio" className="btn-check" name="rating" id="rating4" value="4" />
                                                        <label htmlFor="rating4">
                                                            <FontAwesomeIcon icon={faStarFull} />
                                                        </label>

                                                        <input type="radio" className="btn-check" name="rating" id="rating3" value="3" />
                                                        <label htmlFor="rating3">
                                                            <FontAwesomeIcon icon={faStarFull} />
                                                        </label>

                                                        <input type="radio" className="btn-check" name="rating" id="rating2" value="2" />
                                                        <label htmlFor="rating2">
                                                            <FontAwesomeIcon icon={faStarFull} />
                                                        </label>
                                                        <input type="radio" className="btn-check" name="rating" id="rating1" value="1" />
                                                        <label htmlFor="rating1">
                                                            <FontAwesomeIcon icon={faStarFull} />
                                                        </label>
                                                    </div>

                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="form-comment">
                                                        Optional comment
                                                    </label>
                                                    <textarea name="comment" id="form-comment" placeholder="Your comment here..."></textarea>
                                                </div>
                                                <button className={`btn btn-primary ${styles.submitButton}`}>Submit</button>
                                            </form>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}