import styles from './productsCatalog.module.css';
import { useNavigate, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import ProductFilters from './productFilters/ProductFilters';
import productsCatalog from '../../../lib/actions/productsCatalog';
import { ProductData, ProductsCatalogQueryParams } from '../../../lib/definitions';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import ProductCard from './productCard/ProductCard';

export default function ProductsCatalog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [_searchParams, _setSearchParams] = useSearchParams();
    const [queryParams, setQueryParams] = useState({} as ProductsCatalogQueryParams);
    const [productResults, setProductResults] = useState([] as Array<ProductData>);
    const [currentPage, setCurrentPage] = useState(1);
    const [allPagesCount, setAllPagesCount] = useState(1);

    function queryParamsSetterForFilter(paramsToSet: {
        name: string,
        category: string,
        priceFrom: string,
        priceTo: string,
        availableInStock: string,
        manufacturer: string,
    }) {
        setQueryParams(state => {
            const newState = {...state};
            Object.assign(newState, paramsToSet);
            return newState;
        });
    }

    function incrementPage() {
        if (queryParams.currentPage + 1 > allPagesCount) {
            return;
        }
        setQueryParams(state => {
            const newState = {...state};
            newState.currentPage = state.currentPage + 1 > allPagesCount ? state.currentPage : state.currentPage + 1;
            return newState;
        });
    }
    function decrementPage() {
        if (queryParams.currentPage - 1 <= 0) {
            return;
        }
        setQueryParams(state => {
            const newState = {...state};
            newState.currentPage = state.currentPage - 1 || 1;
            return newState;
        });
    }
    function goToGivenPage(page: number) {
        setQueryParams(state => {
            const newState = {...state};
            newState.currentPage = page < 1 ? 1 : (page > allPagesCount ? allPagesCount : page);
            return newState;
        });
    }

    function changeItemsPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
        console.log(e.target.value);
        const itemsPerPageToSet = {
            '4':4,
            '8':8,
            '12':12,
            '24': 24
        }[e.target.value] || 12;
        setQueryParams(state => {
            const newState = {...state};
            newState.itemsPerPage = itemsPerPageToSet;
            return newState;
        });
    }

    useEffect(() => {
        const params = Object.fromEntries(_searchParams.entries());
        const queryParams: ProductsCatalogQueryParams = {
            currentPage: Number(params.currentPage) || 1,
            itemsPerPage: Number(params.itemsPerPage) || 12,
            name: params.name || '',
            category: params.category || '',
            priceFrom: params.priceFrom || '',
            priceTo: params.priceTo || '',
            availableInStock: params.availableInStock || '',
            manufacturer: params.manufacturer || '',
        };
        setQueryParams(queryParams);
    }, [_searchParams]);

    useEffect(() => {
        (async () => {
            if (Object.values(queryParams).length <= 0) {
                // skip fetch with empty queryParams state object
                console.log('skip fetch with empty queryParams');
                
                return;
            }
            const paramsFromCurrentURL = [..._searchParams.entries()];
            let paramsInStateAndInURLAreSame = false;
            for (let i = 0; i < paramsFromCurrentURL.length; i++) {
                const key = paramsFromCurrentURL[i][0];
                const val = paramsFromCurrentURL[i][1];
                const areSame = (queryParams as any)[key] == val;
                if (!areSame) {
                    paramsInStateAndInURLAreSame = false;
                    break;
                }
                paramsInStateAndInURLAreSame = true;
            }
            if (paramsInStateAndInURLAreSame) {
                console.log('same.......');
                
                return;
            }


            const actionResponse = await productsCatalog(queryParams);
            if (actionResponse.responseStatus === 200) {
                setProductResults(actionResponse.data as Array<ProductData>);
                setCurrentPage(actionResponse.currentPage || 1);
                setAllPagesCount(actionResponse.pagesCount || 1);
            } else if (actionResponse.responseStatus === 400 || actionResponse.responseStatus === 500) {
                setProductResults([]);
                setCurrentPage(1);
                setAllPagesCount(1);
                dispatch(setMessageData({
                    duration: 3000,
                    isShown: true,
                    text: actionResponse.msg,
                    type: 'error'
                }));
            }
            navigate(actionResponse.urlWithNewQueryParams, { replace: true });
        })();
    }, [queryParams]);

    return (
        <div className={styles.wrapper}>
            <h1>Products Catalog</h1>
            <button className={`btn btn-primary ${styles.filtersButton}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#filters">
                Open Filters
            </button>
            <ProductFilters 
                queryParamsSetter={queryParamsSetterForFilter}
                categories={['test', 'cpu', 'ram']}
                currentQueryParams={queryParams}
            />

            <div className={`row row-cols-1 row-cols-md-4 g-4 ${styles.cardsWrapper}`}>

                {
                    productResults.map(p => <ProductCard {...p} key={p.productID} />)
                }

            </div>

            <nav aria-label="Page navigation example" className={styles.pagination}>
                <select className="form-select" aria-label="Amount of items to display per page." onChange={(e) => {changeItemsPerPage(e)}} defaultValue={queryParams.itemsPerPage?.toString() || '12'}>
                    <option value="4">4 per page</option>
                    <option value="8">8 per page</option>
                    <option value="12">12 per page</option>
                    <option value="24">24 per page</option>
                </select>
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link" onClick={decrementPage} aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <>
                        {
                            currentPage - 1 > 0 ?
                                <li className="page-item"><a className="page-link" onClick={() => goToGivenPage(currentPage - 1)}>{currentPage - 1}</a></li>
                                : ''
                        }
                        <li className="page-item"><a className="page-link active">{currentPage}</a></li>

                        {
                            currentPage + 1 <= allPagesCount ?
                                <li className="page-item"><a className="page-link" onClick={() => goToGivenPage(currentPage + 1)}>{currentPage + 1}</a></li>
                                : ''
                        }
                    </>
                    <li className="page-item">
                        <a className="page-link" onClick={incrementPage} aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>

        </div>
    );
}