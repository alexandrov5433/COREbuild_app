import styles from './productsCatalog.module.css';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import ProductFilters from './productFilters/ProductFilters';
import productsCatalog from '../../../lib/actions/productsCatalog';
import { ProductData, ProductsCatalogQueryParams } from '../../../lib/definitions';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import ProductCard from './productCard/ProductCard';

export default function ProductsCatalog() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [productResults, setProductResults] = useState([] as Array<ProductData>);

    useEffect(() => {
        console.log(setSearchParams);
        
        (async () => {
            const params = Object.fromEntries(searchParams.entries());
            console.log('params', params);
            const queryParams: ProductsCatalogQueryParams = {
                name: params.name || '',
                category: params.category || '',
                priceFrom: params.priceFrom || '',
                priceTo: params.priceTo || '',
                availableInStock: params.availableInStock || '',
                manufacturer: params.manufacturer || '',
            };
            console.log('queryParams', queryParams);
            const actionResponse = await productsCatalog(queryParams);
            console.log('actionResponse', actionResponse);
            if (actionResponse.responseStatus === 200) {
                setProductResults(actionResponse.data as Array<ProductData>);
            } else if (actionResponse.responseStatus === 500) {
                setProductResults([]);
                dispatch(setMessageData({
                    duration: 3000,
                    isShown: true,
                    text: actionResponse.msg,
                    type: 'error'
                }));
            }
        })();
    }, [searchParams]);
    return (
        <div className={styles.wrapper}>
            <h1>Products Catalog</h1>
            <button className={`btn btn-primary ${styles.filtersButton}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                Open Filters
            </button>
            <ProductFilters />

            <div className="row row-cols-1 row-cols-md-4 g-4">

                {
                    productResults.map(p => <ProductCard {...p} key={p.productID}/>)
                }

            </div>

            <nav aria-label="Page navigation example" className={styles.pagination}>
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>

        </div>
    );
}