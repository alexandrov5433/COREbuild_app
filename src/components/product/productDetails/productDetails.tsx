import styles from './productDetails.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faEuroSign, faStar as faStarFull, faStarHalfStroke, faCheck, faComments, faTriangleExclamation, faArrowRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarHollow, faHeart as faHeartHollow } from '@fortawesome/free-regular-svg-icons';
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router';
import { GetRatingAndReviewCountForProductActionData, ProductData, ReviewData, ShoppingCart } from '../../../lib/definitions';
import productDetails from '../../../lib/actions/product/productDetails';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import { convertCentToWhole } from '../../../lib/util/currency';
import getCustomerReviewedProduct from '../../../lib/actions/review/getCustomerReviewedProduct';
import getRatingAndReviewCountForProduct from '../../../lib/actions/review/getRatingAndReviewCountForProduct';
import getReviewsForProduct from '../../../lib/actions/review/getReviewsForProduct';
import addNewReview from '../../../lib/actions/review/addNewReview';
import { convertTimeToDate } from '../../../lib/util/time';
import { updateCart } from '../../../redux/cartSlice';
import addProductToCart from '../../../lib/actions/cart/addProductToCart';
import Loader from '../../general/loader/Loader';
import addProductToFavorite from '../../../lib/actions/favorite/addProductToFavorite';
import { updateFavorite } from '../../../redux/favoriteSlice';
import deleteProductFromFavorite from '../../../lib/actions/favorite/deleteProductFromFavorite';

export default function ProductDetails() {
  const { productID } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userData = useAppSelector(state => state.user);
  const favoriteData = useAppSelector(state => state.favorite);

  const commentFormRef = useRef(null);
  const reviewsRef = useRef(null);

  const [isFavoriteButtonsBlocked, setFavoriteButtonsBlocked] = useState(false);

  const [productData, setProductData] = useState({} as ProductData);
  const [raitngAndReviewsCount, setRaitngAndReviewsCount] = useState({} as GetRatingAndReviewCountForProductActionData);

  const [productReviews, setProductReviews] = useState([] as Array<ReviewData>);
  const [isProductReviewsloading, setIsProductReviewsLoading] = useState(false);
  const [productReviewCurrentPage, setProductReviewCurrentPage] = useState(1);
  const [productReviewPagesCount, setProductReviewPagesCount] = useState(1);

  const [hasCustomerReviewedProduct, setHasCustomerReviewedProduct] = useState(false);

  const [displayDescriptionOrComments, setDisplayDescriptionOrComments] = useState('description'); // 'description' || 'comments'
  const [addToCartCount, setAddToCartCount] = useState(1);
  const [isProductAdditionProcessing, setIsProductAdditionProcessing] = useState(false);

  useEffect(() => {
    if (!productID) {
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
      setIsProductReviewsLoading(true);
      const getReviewsForProductAR = await getReviewsForProduct(productID, productReviewCurrentPage);
      if (getReviewsForProductAR.responseStatus === 200) {
        setProductReviews(getReviewsForProductAR.data?.reviews || []);
        setProductReviewCurrentPage(getReviewsForProductAR.data?.currentPage || 1);
        setProductReviewPagesCount(getReviewsForProductAR.data?.pagesCount || 1);
      }
      setIsProductReviewsLoading(false);
    })();
  }, [productReviewCurrentPage]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function manageAddToCartValChange(e: ChangeEvent<HTMLInputElement>) {
    let quantity = Math.abs(Number(e.target.value));
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

  async function submitReview(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!productID) {
      dispatch(setMessageData({
        duration: 4500,
        isShown: true,
        text: 'Product ID is missing.',
        type: 'error'
      }));
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const dataObject = Object.fromEntries(formData.entries());
    const submissionResult = await addNewReview({
      rating: dataObject.rating.toString(),
      comment: dataObject.comment.toString(),
      productID: productID
    })
    if (submissionResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4500,
        isShown: true,
        text: 'Submission successful.',
        type: 'success'
      }));
      setHasCustomerReviewedProduct(true);
    } else if ([400, 500].includes(submissionResult.responseStatus)) {
      dispatch(setMessageData({
        duration: 4500,
        isShown: true,
        text: submissionResult.msg,
        type: 'error'
      }));
    }
  }

  function generateRatingAsStars(rating: number) {
    const whole = Math.trunc(rating);
    const stars = [];
    for (let i = 0; i < whole; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStarFull} />);
    }
    const isRest = Boolean(rating % 1);
    if (isRest) {
      stars[whole] = <FontAwesomeIcon key={whole} icon={faStarHalfStroke} />;
    }
    if (stars.length < 5) {
      for (let i = stars.length; i <= 4; i++) {
        stars[i] = <FontAwesomeIcon key={i} icon={faStarHollow} />;
      }
    }
    return stars;
  }

  function goToGivenPage(page: number) {
    if (page < 1) {
      page = 1;
    }
    if (page > productReviewPagesCount) {
      page = productReviewPagesCount;
    }
    setProductReviewCurrentPage(page);
  }

  function scrollReviewIntoView() {
    toggleDescriptionAndComments('comments');
    (reviewsRef.current! as HTMLDivElement).scrollIntoView({
      behavior: 'smooth'
    });
  }

  async function addToCart() {
    if (!Number(productID) || isProductAdditionProcessing) {
      return;
    }
    setIsProductAdditionProcessing(true);
    const addition = await addProductToCart(Number(productID), addToCartCount);
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
    setIsProductAdditionProcessing(false);
  }

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
    <div className={styles.wrapper}>
      <h1>Product Details</h1>
      {
        Object.keys(productData).length <= 0 ?
          <div className={styles.productNotFound}>
            <div className={styles.triangleContainer}>
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            {
              !productID ?
                <p className='lead'>The product ID is required in order to find it. Please, check the URL.</p>
                :
                <p className='lead'>Sadly, the product with ID: {productID} you are looking for could not be found.</p>
            }
            <p className='lead'>Please, take a look at our products catalog or contact us.</p>
            <div>
              <NavLink to='/products-catalog'>
                <FontAwesomeIcon icon={faArrowRight} />Products
              </NavLink>
            </div>
            <div>
              <NavLink to='/'>
                <FontAwesomeIcon icon={faArrowRight} />Home
              </NavLink>
            </div>
          </div>
          :
          <div className={styles.contentContainer}>
            <h2>{productData.name}</h2>
            <div className={styles.middleWrapper}>

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

                <p className={`${styles.raiting}`} onClick={scrollReviewIntoView}>Rating: {generateRatingAsStars(raitngAndReviewsCount.rating)} ({raitngAndReviewsCount.reviewsCount})</p>

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
                    !userData?.userID ?
                      <button className={`btn btn-success ${styles.addToCartButton}`} onClick={() => navigate('/login')}>Login To Purchase</button> :
                      userData?.is_employee ?
                        <NavLink className={`btn btn-danger`} to={`/edit-product/${productData.productID}`}>Edit Product</NavLink>
                        :
                        <div className={styles.addToCartContainer}>
                          <label htmlFor="addToCartCount">Quantity: <input id="addToCartCount" type="number" step={1} defaultValue={addToCartCount} min={1} max={productData.stockCount} onChange={manageAddToCartValChange} /></label>

                          <button className={`btn btn-success ${styles.addToCartButton}`} disabled={isProductAdditionProcessing} onClick={addToCart}>Add {addToCartCount} to cart</button>
                        </div>
                }
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

              </div>
              <div className={styles.smallInfos}>
                <div className={styles.idOfProduct}>
                  <h3>ID</h3>
                  <p>{productData.productID}</p>
                </div>
                <div className={styles.category}>
                  <h3>Category</h3>
                  <p>{productData.category}</p>
                </div>
                <div className={styles.manufacturer}>
                  <h3>Manufacturer</h3>
                  <p>{productData.manufacturer}</p>
                </div>
              </div>

            </div>
            <div className={styles.specsDoc}>
              <p>Specifications Document</p>
              {
                productData.specsDocID ?
                  <a href={`/api/file/doc/${productData.specsDocID}`} download={productData.name || 'Product Specifications'}>{productData.name}</a>
                  :
                  <p>No document available.</p>
              }
            </div>
            <div className={styles.descriptionAndComments} ref={reviewsRef}>
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


                      {
                        !userData?.userID ?
                          <p className={`lead ${styles.loginRegToReview}`}>Please, <NavLink to={'/login'}>login</NavLink> or <NavLink to={'/register'}>register</NavLink> to leave a review.</p>
                          : userData?.is_employee ? '' :
                            hasCustomerReviewedProduct ? '' :
                              <form ref={commentFormRef} onSubmit={submitReview}>
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
                      }


                      {
                        productReviews.length ?
                          <div className={styles.userReviewsContainer}>

                            {
                              isProductReviewsloading ?
                                <Loader />
                                :
                                productReviews.map(rev => <div key={rev.reviewID} className={styles.singleReview}>
                                  <p className={styles.reviewUsername}>{rev.username || ''}</p>
                                  <div className={styles.reviewRatingAndDateContainer}>
                                    <p className={styles.reviewRating}>{generateRatingAsStars(rev.rating)}</p>
                                    <p className={styles.reviewDate}>{convertTimeToDate(Number(rev.time))}</p>
                                  </div>
                                  {
                                    !rev.isVerifiedPurchase ? '' :
                                      <p className={styles.reviewPurchaseVerified}><FontAwesomeIcon icon={faCheck} /> Verified Purchase</p>
                                  }
                                  <p className={styles.reviewComment}>{rev.comment}</p>
                                  <hr />
                                </div>)
                            }

                            <ul className={`pagination ${styles.reviewsPagination}`}>
                              <li className="page-item">
                                <a className={`page-link ${productReviewCurrentPage <= 1 || isProductReviewsloading ? 'disabled' : ''}`} aria-label="Previous" onClick={() => goToGivenPage(productReviewCurrentPage - 1)}>
                                  <span aria-hidden="true">&laquo;</span>
                                </a>
                              </li>
                              <li className="page-item page-link">{productReviewCurrentPage}</li>
                              <li className="page-item">
                                <a className={`page-link ${productReviewCurrentPage >= productReviewPagesCount || isProductReviewsloading ? 'disabled' : ''}`} aria-label="Next" onClick={() => goToGivenPage(productReviewCurrentPage + 1)}>
                                  <span aria-hidden="true">&raquo;</span>
                                </a>
                              </li>
                            </ul>

                          </div>
                          :
                          <div className={styles.noReviewsStatement}>
                            <FontAwesomeIcon icon={faComments} />
                            <p>There are no reviews for this product yet.</p>

                          </div>
                      }


                    </div>
                }
              </div>
            </div>
          </div>
      }
    </div >
  );
}