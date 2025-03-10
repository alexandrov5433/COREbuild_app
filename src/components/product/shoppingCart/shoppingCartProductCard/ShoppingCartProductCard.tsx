import { useEffect, useState } from "react";
import { ProductData, ProductInCart } from "../../../../lib/definitions";
import { convertCentToWhole } from "../../../../lib/util/currency";
import productDetails from "../../../../lib/actions/productDetails";

export default function ShoppingCartProductCard({
    productInCart
}: {
    productInCart: ProductInCart
}) {
    const [productData, setProductData] = useState({} as ProductData);
    useEffect(() => {
        (async () => {
            const actionResponse = await productDetails(productInCart.productID);
            if (actionResponse.responseStatus === 200) {
                setProductData(actionResponse.data!);
            }
        })();
    }, []);
    return (
        <div className="card mb-3">
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={`/api/file/pic/${productData.thumbnailID}`} className="img-fluid rounded-start" alt={`A picture of ${productData.name}`} />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{productData.name}</h5>
                        {/* <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p> */}
                        <p className="card-text"><small className="text-body-secondary">{convertCentToWhole(productData.price)}</small></p>
                    </div>
                </div>
            </div>
        </div>
    );
}