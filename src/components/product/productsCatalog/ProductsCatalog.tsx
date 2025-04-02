import styles from './productsCatalog.module.css';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import ProductFilters from './productFilters/ProductFilters';
import productsCatalog from '../../../lib/actions/product/productsCatalog';
import { ProductData, ProductsCatalogQueryParams } from '../../../lib/definitions';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import ProductCard from './productCard/ProductCard';
import getAllProductCategories from '../../../lib/actions/product/getAllProductCategories';
import Loader from '../../general/loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function ProductsCatalog() {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const [productResults, setProductResults] = useState([] as Array<ProductData>);
    const [currentPage, setCurrentPage] = useState(1);
    const [allPagesCount, setAllPagesCount] = useState(1);
    const [categories, setCategories] = useState([] as Array<string>);
    const [isProductsLoading, setProductsLoading] = useState(true);
    const [filterFormClearTrigger, setFilterFormClearTrigger] = useState(false);

    function queryParamsSetterForFilter(paramsToSet: {
        currentPage: number,
        itemsPerPage: number,
        name: string,
        category: string,
        priceFrom: string,
        priceTo: string,
        availableInStock: string,
        manufacturer: string,
    }) {
        setSearchParams(state => {
            const newState = { ...state };
            Object.assign(newState, paramsToSet);
            return newState;
        });
    }
    function incrementPage() {
        if (Number(searchParams.get('currentPage')) + 1 > allPagesCount) {
            return;
        }
        setSearchParams(state => {
            const currentPage = Number(state.get('currentPage')) || 1;
            const targetPageVal = currentPage + 1 > allPagesCount ? currentPage : currentPage + 1;
            state.set('currentPage', targetPageVal.toString());
            return state;
        });
        window.scrollTo(0, 0);
    }
    function decrementPage() {
        if (Number(searchParams.get('currentPage')) - 1 <= 0) {
            return;
        }
        setSearchParams(state => {
            const targetPageVal = Number(state.get('currentPage')) - 1 || 1;
            state.set('currentPage', targetPageVal.toString());
            return state;
        });
        window.scrollTo(0, 0);
    }
    function goToGivenPage(page: number) {
        setSearchParams(state => {
            const targetPageVal = page < 1 ? 1 : (page > allPagesCount ? allPagesCount : page);
            state.set('currentPage', targetPageVal.toString());
            return state;
        });
        window.scrollTo(0, 0);
    }
    function changeItemsPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
        const itemsPerPageToSet = {
            '4': 4,
            '8': 8,
            '12': 12,
            '24': 24
        }[e.target.value] || 12;
        setSearchParams(state => {
            state.set('itemsPerPage', itemsPerPageToSet.toString());
            state.set('currentPage', '1');
            return state;
        });
        window.scrollTo(0, 0);
    }
    function clearFilters() {
        setSearchParams(state => {
            const newState = { ...state };
            Object.assign(newState, {
                currentPage: '1',
                itemsPerPage: state.get('itemsPerPage'),
                name: '',
                category: '',
                priceFrom: '',
                priceTo: '',
                availableInStock: '',
                manufacturer: '',
            });
            return newState;
        });
        activateFilterFormClearTrigger();
    }
    function searchParamsToObject(searchParams: URLSearchParams) {
        const params = Object.fromEntries(searchParams.entries());
        return {
            currentPage: Number(params.currentPage) || 1,
            itemsPerPage: Number(params.itemsPerPage) || 12,
            name: params.name || '',
            category: params.category || '',
            priceFrom: params.priceFrom || '',
            priceTo: params.priceTo || '',
            availableInStock: params.availableInStock || '',
            manufacturer: params.manufacturer || '',
        } as ProductsCatalogQueryParams;
    }
    function activateFilterFormClearTrigger() {
        setFilterFormClearTrigger(state => !state);
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        (async () => {
            setProductsLoading(true);
            const queryParams = searchParamsToObject(searchParams);
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
            setProductsLoading(false);
        })();
    }, [searchParams]);

    useEffect(() => {
        (async () => {
            const categoriesResult = await getAllProductCategories()
            if (categoriesResult.responseStatus === 200) {
                setCategories(categoriesResult.data!);
            }
        })();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.wrapper}>
            <h1>Products Catalog</h1>
            <button className={`btn btn-primary ${styles.filtersButton}`} type="button" data-bs-toggle="offcanvas" data-bs-target="#filters">
                Open Filters
            </button>
            <button className={`btn btn-outline-warning ${styles.filtersButton}`} type="button" onClick={clearFilters}>
                Clear Filters
            </button>
            <ProductFilters
                queryParamsSetter={queryParamsSetterForFilter}
                categories={categories}
                currentQueryParams={searchParamsToObject(searchParams)}
                filterFormClearTrigger={filterFormClearTrigger}
            />
            {
                isProductsLoading ?
                    <Loader />
                    : productResults.length ?
                        <>
                            <div className={`row row-cols-1 row-cols-md-4 g-4 ${styles.cardsWrapper}`}>
                                {
                                    productResults.map(p => <ProductCard {...p} key={p.productID} />)
                                }
                            </div>

                            <nav aria-label="Page navigation example" className={styles.pagination}>
                                <select className="form-select" aria-label="Amount of items to display per page." onChange={(e) => { changeItemsPerPage(e) }} defaultValue={searchParams.get('itemsPerPage')?.toString() || '12'}>
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
                        </>
                        :
                        <div className={styles.noResultsContainer}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <p className='lead'>No products were found with these search parameters.</p>
                            <button className={`btn btn-outline-warning`} type="button" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
            }
        </div>
    );
}