import { useEffect, useRef, useState } from 'react';
import styles from './ticketsFilter.module.css';

export default function TicketsFilter({
    updateFiltrationOptions,
    resetTicketFiltraionOptions,
    filterClearTrigger
} : {
    updateFiltrationOptions : (options:{
        id: number | null,
        status: 'open' | 'closed' | null,
        time_open: 'ascending' | 'descending' | null,
    }) => void,
    resetTicketFiltraionOptions: () => void,
    filterClearTrigger: boolean
}) {
    const [isFilterOpen, setFilterOpen] = useState(false);
    const filterFormRef = useRef(null);

    useEffect(() => {
        (filterFormRef.current! as HTMLFormElement)?.reset();
    }, [filterClearTrigger]);

    function onReset() {
        (filterFormRef.current! as HTMLFormElement)?.reset();
        resetTicketFiltraionOptions();
    }

    function onApply() {
        const formData = new FormData(filterFormRef.current!);
        if (!formData) {
            return;
        }
        const options = {
            id: Number(formData.get('id')) || null,
            status: {
                open: 'open',
                closed: 'closed'
            }[formData.get('status')?.toString() || ''] || null,
            time_open: {
                ascending: 'ascending',
                descending: 'descending'
            }[formData.get('time_open')?.toString() || 'ascending'] || null
        };
        updateFiltrationOptions(options as {
            id: number | null,
            status: 'open' | 'closed' | null,
            time_open: 'ascending' | 'descending' | null,
        });
    }

    return (
        <div>
            <button className="btn btn-primary mb-1" type="button" data-bs-toggle="collapse" data-bs-target="#filter" onClick={() => setFilterOpen(state => !state)}>
                {isFilterOpen ? 'Close Filters' : 'Open Filters'}
            </button>
            <form ref={filterFormRef} className={`collapse ${styles.mainContainer}`} id="filter">
                <h4>Filter Options</h4>
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">Ticket ID</label>
                    <input type="number" id="id" name="id" className="form-control" defaultValue={''}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Ticket Status</label>
                    <div className={styles.buttonsContainer}>
                        <input type="radio" className="btn-check" name="status" id="status_open" value="open" />
                        <label className="btn btn-outline-warning" htmlFor="status_open">Open</label>

                        <input type="radio" className="btn-check" name="status" id="status_closed" value="closed" />
                        <label className="btn btn-outline-warning" htmlFor="status_closed">Closed</label>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="form-label">Time of Opening</label>
                    <div className={styles.buttonsContainer}>
                        <input type="radio" className="btn-check" name="time_open" id="time_open_descending" value="descending" />
                        <label className="btn btn-outline-warning" htmlFor="time_open_descending">Newer First</label>

                        <input type="radio" className="btn-check" name="time_open" id="time_open_ascending" value="ascending" defaultChecked/>
                        <label className="btn btn-outline-warning" htmlFor="time_open_ascending">Older First</label>
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