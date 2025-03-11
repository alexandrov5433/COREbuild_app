import styles from './shoppingCartProductCard.module.css';
import { useEffect, useState } from "react";
import { ProductData } from "../../../../lib/definitions";
import { convertCentToWhole } from "../../../../lib/util/currency";
import productDetails from "../../../../lib/actions/productDetails";

export default function ShoppingCartProductCard({
    productID,
    count,
    priceSetter
}: {
    productID: number,
    count: number,
    priceSetter: (priceToAddInCent: number) => void
}) {
    const [productData, setProductData] = useState({} as ProductData);
    useEffect(() => {
        (async () => {
            const actionResponse = await productDetails(productID);
            if (actionResponse.responseStatus === 200) {
                setProductData(actionResponse.data!);
                priceSetter(actionResponse.data?.price || 0);
            }
        })();
    }, []);
    return (
        <div className="card mb-3">
            <div className={`row g-0 ${styles.cardWrapper}`}>
                <div className="col-md-4">
                    <img src={`/api/file/pic/${productData.thumbnailID}`} className="img-fluid rounded-start" alt={`A picture of ${productData.name}`} />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{productData.name}</h5>
                        <p className={`card-text ${styles.price}`}>Price: {convertCentToWhole(productData.price)}</p>
                        <p className={`card-text ${styles.count}`}>Count: {count}</p>
                        <button className="btn btn-outline-warning">Remove Product</button>
                    </div>
                </div>
            </div>
        </div>
    );
}