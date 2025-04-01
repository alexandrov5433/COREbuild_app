import styles from './favoriteProducts.module.css';
import { useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';
import { NavLink } from 'react-router';
import { useEffect, useState } from 'react';
import getProductDataInBulk from '../../../../lib/actions/product/getProductDataInBulk';
import { ProductData } from '../../../../lib/definitions';
import { useDispatch } from 'react-redux';
import { setMessageData } from '../../../../redux/popupMessageSlice';
import Loader from '../../../general/loader/Loader';
import { updateFavorite } from '../../../../redux/favoriteSlice';
import deleteProductFromFavorite from '../../../../lib/actions/favorite/deleteProductFromFavorite';

export default function FavoriteProducts() {
  const dispatch = useDispatch();
  const userData = useAppSelector(state => state.user);
  const favoriteData = useAppSelector(state => state.favorite);

  const [isFavoriteHasProducts, _setFavoriteHasProducts] = useState(favoriteData?.products?.length ? true : false);

  const [fatoviteProductsData, setFatoviteProductsData] = useState([] as Array<ProductData | null>);
  const [isFavoriteProductsDataLoading, setFavoriteProductsDataLoading] = useState(false);
  const [isRemoveFromFavoriteLoading, setRemoveFromFavoriteLoading] = useState(false);

  useEffect(() => {
    __getProductsDataForFavorite();
  }, [favoriteData]);

  async function __getProductsDataForFavorite() {
    if (!isFavoriteHasProducts) {
      return;
    }
    setFavoriteProductsDataLoading(true);
    const action = await getProductDataInBulk(favoriteData.products);

    if (action.responseStatus === 200) {
      setFatoviteProductsData(action.data!);
    } else if (action.responseStatus === 400) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: action.msg,
        type: 'error'
      }));
    }
    setFavoriteProductsDataLoading(false);
  };

  async function removeProductFromFavorites(productID: number) {
    if (!productID || !userData?.userID) {
      return;
    }
    setRemoveFromFavoriteLoading(true);
    const action = await deleteProductFromFavorite(userData?.userID, productID);
    if (action.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Product removed from favorites.',
        type: 'success'
      }));
      dispatch(updateFavorite(action.data!));
    } else if (action.responseStatus === 400) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: action.msg,
        type: 'error'
      }));
    }
    setRemoveFromFavoriteLoading(false);
  }

  return (
    <div>
      {
        isFavoriteHasProducts ?
          (isFavoriteProductsDataLoading ? <Loader /> :
            <>
              {
                fatoviteProductsData.map(product => {
                  return (
                    <div className={styles.card} key={product?.productID}>
                      <NavLink to={`/product-details/${product?.productID}`}>
                        <img src={`/api/file/pic/${product?.thumbnailID}`} className="img-thumbnail" alt={`A picture of the product ${product?.name}.`} />
                      </NavLink>
                      <section>
                        <NavLink to={`/product-details/${product?.productID}`}>{product?.name}</NavLink>
                        <button className="btn btn-outline-danger" disabled={isRemoveFromFavoriteLoading} onClick={() => removeProductFromFavorites(product?.productID!)}>
                          Remove From Favorites
                        </button>
                      </section>
                    </div>
                  );
                })
              }
            </>)
          :
          <div>
            <p className="lead">No products saved.</p>
              <NavLink to={'/products-catalog'} className="btn btn-success">
                Browse Products
              </NavLink>
          </div>
      }
    </div>
  );
}