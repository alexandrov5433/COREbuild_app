import { useSearchParams } from 'react-router';
import styles from './productsCatalog.module.css';
import { useEffect } from 'react';
import ProductFilters from './productFilters/ProductFilters';

export default function ProductsCatalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        console.log('searchParams', Object.fromEntries(searchParams.entries()));

    }, [searchParams]);
    return (
        <div className={styles.wrapper}>
            <h1>Products Catalog</h1>
            <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                Open Filters
            </button>
            <ProductFilters />
            
        </div>
    );
}