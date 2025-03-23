import { useRef, useState } from 'react';
import styles from './ordersFilter.module.css';

export default function OrdersFilter({
    updateFilter
}: {
    updateFilter: (options : any) => void
}) {
    const [isFilterOpen, setFilterOpen] = useState(false);
    const filterFormRef = useRef(null);

    function onReset() {
        (filterFormRef.current! as HTMLFormElement)?.reset();
        updateFilter({
            orderID: null,
            recipientID: null,
            shipping_status: null,
            time: 'descending'
        });
    }

    function onApply() {
        const formData = new FormData(filterFormRef.current!);
        if (!formData) {
            return;
        }
        const options = {
            orderID: Number(formData.get('orderID')) || null,
            recipientID: Number(formData.get('recipientID')) || null,
            shipping_status: {
                pending: 'pending',
                shipped: 'shipped'
            }[formData.get('shipping_status')?.toString() || ''] || null,
            time: {
                ascending: 'ascending',
                descending: 'descending'
            }[formData.get('time')?.toString() || 'descending']
        };
        updateFilter(options);
    }

    return (
        <div>
            <button className="btn btn-primary mb-1" type="button" data-bs-toggle="collapse" data-bs-target="#filter" onClick={() => setFilterOpen(state => !state)}>
                {isFilterOpen ? 'Close Filters' : 'Open Filters'}
            </button>
            <form ref={filterFormRef} className={`collapse ${styles.mainContainer}`} id="filter">
                <h4>Filter Options</h4>
                <div className="mb-3">
                    <label htmlFor="orderID" className="form-label">Order ID</label>
                    <input type="number" id="orderID" name="orderID" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="recipientID" className="form-label">Recipient ID</label>
                    <input type="number" id="recipientID" name="recipientID" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Shipping Status</label>
                    <div className={styles.buttonsContainer}>
                        <input type="radio" className="btn-check" name="shipping_status" id="shipping_status_pending" value="pending" />
                        <label className="btn btn-outline-warning" htmlFor="shipping_status_pending">Pending</label>

                        <input type="radio" className="btn-check" name="shipping_status" id="shipping_status_shipped" value="shipped" />
                        <label className="btn btn-outline-warning" htmlFor="shipping_status_shipped">Shipped</label>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="form-label">Time</label>
                    <div className={styles.buttonsContainer}>
                        <input type="radio" className="btn-check" name="time" id="time_newer" value="descending" defaultChecked/>
                        <label className="btn btn-outline-warning" htmlFor="time_newer">Newer First</label>

                        <input type="radio" className="btn-check" name="time" id="time_older" value="ascending" />
                        <label className="btn btn-outline-warning" htmlFor="time_older">Older First</label>
                    </div>
                </div>
                <hr />
                <div className={styles.buttonsContainer}>
                    <button className="btn btn-primary" type="button" onClick={onApply}>Apply Filters</button>
                    <button className="btn btn-outline-primary" type="button" onClick={onReset}>Clear Filters</button>
                </div>
            </form>
        </div>
    );
}