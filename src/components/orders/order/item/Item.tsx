import styles from './item.module.css'
import { useEffect, useState } from "react";
import productDetails from "../../../../lib/actions/product/productDetails";
import { ProductData } from "../../../../lib/definitions";
import Loader from "../../../general/loader/Loader";
import { convertCentToWhole } from '../../../../lib/util/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router';

export default function Item({ productID, count }: { productID: number, count: number }) {
  const [isProductDataLoading, setProductDataLoading] = useState(false);
  const [productData, setProductData] = useState({} as ProductData);

  useEffect(() => {
    (async () => {
      if (!productID) {
        return;
      }
      setProductDataLoading(true);
      const actionResult = await productDetails(productID);
      if (actionResult.responseStatus === 200) {
        setProductData(actionResult.data!);
      }
      setProductDataLoading(false);
    })();
  }, [productID]);

  return (
    <>
      {
        isProductDataLoading ?
          <Loader />
          :
          productData?.productID ?
            <div className={styles.mainContainer}>
              <NavLink to={`/product-details/${productData.productID || 0}`}>
                <img src={`/api/file/pic/${productData.thumbnailID}`} className="img-thumbnail" alt={`Image of ${productData.name}`} />
              </NavLink>
              <div className={styles.info}>
                <NavLink className="lead" to={`/product-details/${productData.productID}`}>{productData.name}</NavLink>
                <p><i>Quantity ordered:</i> {count}</p>
                <p><i>Price of one:</i> {convertCentToWhole(productData.price)} <FontAwesomeIcon icon={faEuroSign} /></p>
              </div>
            </div>
            :
            <p className="lead">Could not find product.</p>
      }
    </>
  );
}