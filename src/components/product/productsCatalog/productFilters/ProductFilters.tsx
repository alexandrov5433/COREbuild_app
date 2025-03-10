import { ProductsCatalogQueryParams } from '../../../../lib/definitions';
import styles from './productFilters.module.css';
import { useEffect, useRef, useState } from 'react';

export default function ProductFilters({
    queryParamsSetter,
    categories,
    currentQueryParams
}: {
    queryParamsSetter: (paramsToSet: {
        currentPage: number,
        itemsPerPage: number,
        name: string,
        category: string,
        priceFrom: string,
        priceTo: string,
        availableInStock: string,
        manufacturer: string,
    }) => void,
    categories: Array<string>,
    currentQueryParams: ProductsCatalogQueryParams
}) {
    const formRef = useRef(null);
    const [formValidity, setFormValidity] = useState({
        isFormValid: true,
        priceFrom: true,
        priceTo: true,
    });

    useEffect(() => {
        setFormValidity(state => {
            const dependencies = [
                formValidity.priceFrom,
                formValidity.priceTo
            ];
            const newState = { ...state };
            newState.isFormValid = !dependencies.includes(false);
            return newState;
        }); 
    }, [
        formValidity.priceFrom,
        formValidity.priceTo
    ]);

    function applyFilters() {
        const form = formRef.current as unknown as HTMLFormElement;
        const formData = Object.fromEntries(new FormData(form).entries());
        const newQueryParams = {
            currentPage: 1,
            itemsPerPage: currentQueryParams.itemsPerPage,
            name: (formData.name as string).trim() || '',
            category: (formData.category as string).trim() || '',
            priceFrom: (formData.priceFrom as string).trim() || '',
            priceTo: (formData.priceTo as string).trim() || '',
            availableInStock: formData.availableInStock as string || '',
            manufacturer: (formData.manufacturer as string).trim() || '',
        }
        queryParamsSetter(newQueryParams);
    }

    function priceValidator(e: React.ChangeEvent<HTMLInputElement>, priceType: 'priceFrom' | 'priceTo') {
        const val = e.target?.value || '';
        let isValid = false;
        if (val === '') {
            isValid = true;
        } else {
            isValid = /^([0-9]+(?:\.[0-9]{2}){0,1})$/.test(val); // 23.23 or nothing
        }
        setFormValidity(state => {
            const newState = { ...state };
            newState[priceType] = isValid;
            return newState;
        });       
    }

    return (
        <div className={`offcanvas offcanvas-start ${styles.filters}`} tabIndex={-1} id="filters">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Filter Products</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">

                <form className={`row g-3`} ref={formRef}>


                    <div className="row-md-6">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" defaultValue={currentQueryParams.name || ''} />
                    </div>
                    <div className="row-md-6">
                        <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
                        <input type="text" className="form-control" id="manufacturer" name="manufacturer" defaultValue={currentQueryParams.manufacturer || ''}/>
                    </div>
                    <div className="row-md-6">
                        <label htmlFor="category" className="form-label">Select A Catagory</label>
                        <select id="category" name="category" className="form-select" aria-label="Select a product catagory." defaultValue={currentQueryParams.category || ''}>
                            <option value=""></option>
                            {
                                categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)
                            }
                        </select>
                    </div>

                    <div className="row-md-6">
                        <label htmlFor="priceFrom" className="form-label">Price Range</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text">From</span>
                            <input type="text" className={`form-control ${formValidity.priceFrom ? '' : 'is-invalid'}`} placeholder="€" aria-label="Username" id="priceFrom" name="priceFrom" onChange={e => priceValidator(e, 'priceFrom')} defaultValue={currentQueryParams.priceFrom || ''}/>
                            <span className="input-group-text">To</span>
                            <input type="text" className={`form-control ${formValidity.priceTo ? '' : 'is-invalid'}`} placeholder="€" aria-label="Server" name="priceTo" onChange={e => priceValidator(e, 'priceTo')} defaultValue={currentQueryParams.priceTo || ''}/>
                        </div>
                    </div>

                    <div className={`row-md-6 ${styles.availableInStockWrapper}`}>
                        <input className="form-check-input" type="checkbox" value="yes" name="availableInStock" id="availableInStock" defaultChecked={Boolean(currentQueryParams.availableInStock) || false}/>
                        <label className="form-check-label" htmlFor="availableInStock">
                            Show only in stock
                        </label>
                    </div>
                    <div className="row-md-6">
                        <button type="button" disabled={!formValidity.isFormValid} className="btn btn-success" onClick={applyFilters} data-bs-dismiss="offcanvas">Apply Filter</button>
                    </div>

                </form>

            </div>
        </div>
    );
}