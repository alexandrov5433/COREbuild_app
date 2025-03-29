import styles from './ticketsOverview.module.css';
import { useEffect, useState } from 'react';
import TicketsFilter from './ticketsFilter/TicketsFilter';
import { TicketData, TicketFiltrationOptions } from '../../lib/definitions';
import getFilteredTickets from '../../lib/actions/ticket/getFilteredTickets';
import { useAppDispatch } from '../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../redux/popupMessageSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Ticket from './ticket/Ticket';
import Loader from '../general/loader/Loader';

export default function TicketsOverview() {
    const dispatch = useAppDispatch();

    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [tickets, setTickets] = useState([] as Array<TicketData>);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const initTicketFiltrationOptions: TicketFiltrationOptions = {
        id: null,
        status: null,
        time_open: 'ascending',
        currentPage: 1,
        itemsPerPage: 4
    };
    const [filtrationOptions, setFiltrationOptions] = useState(initTicketFiltrationOptions);
    const [ticketsRefreshTrigger, setTicketsRefreshTrigger] = useState(false);
    const [filterClearTrigger, setFilterClearTrigger] = useState(false);

    useEffect(() => {
        __getTickets();
    }, [filtrationOptions, ticketsRefreshTrigger]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    function updateTicketFiltraionOptions(options: {
        id: number | null,
        status: 'open' | 'closed' | null,
        time_open: 'ascending' | 'descending' | null,
    }) {
        setFiltrationOptions(state => {
            const newState = { ...state };
            Object.assign(newState, options);
            return newState;
        });
    }

    function resetTicketFiltraionOptions() {
        setFiltrationOptions(initTicketFiltrationOptions);
    }

    async function __getTickets() {
        setTicketsLoading(true);
        const action = await getFilteredTickets(filtrationOptions)
        if (action.responseStatus === 200) {
            setTickets(action.data?.tickets! || []);
            setCurrentPage(action.data?.currentPage! || 1);
            setPagesCount(action.data?.pagesCount! || 1);
        } else if (action.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: action.msg,
                type: 'error'
            }));
        }
        setTicketsLoading(false);
    }

    function triggerTicketsRefresh() {
        setTicketsRefreshTrigger(state => !state);
    }

    function incrementPage() {
        if (currentPage + 1 > pagesCount) {
            return;
        }
        setFiltrationOptions(state => {
            const newState = { ...state };
            newState.currentPage = currentPage + 1;
            return newState;
        });
        window.scrollTo(0, 0);
    }
    function decrementPage() {
        if (currentPage - 1 <= 0) {
            return;
        }
        setFiltrationOptions(state => {
            const newState = { ...state };
            newState.currentPage = currentPage - 1;
            return newState;
        });
        window.scrollTo(0, 0);
    }
    function goToGivenPage(page: number) {
        setFiltrationOptions(state => {
            const newState = { ...state };
            const targetPage = page < 1 ? 1 : (page > pagesCount ? pagesCount : page);
            newState.currentPage = targetPage;
            return newState;
        });
        window.scrollTo(0, 0);
    }
    function changeItemsPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
        const itemsPerPageToSet = {
            '4': 4,
            '8': 8,
            '12': 12,
            '24': 24
        }[e.target.value] || 4;
        setFiltrationOptions(state => {
            const newState = { ...state };
            newState.itemsPerPage = itemsPerPageToSet;
            return newState;
        });
        window.scrollTo(0, 0);
    }

    return (
        <div className={`${styles.wrapper} ${styles.mainContainer}`}>
            <h1>Tickets</h1>
            <div className={styles.filterContainer}>
                <TicketsFilter updateFiltrationOptions={updateTicketFiltraionOptions} resetTicketFiltraionOptions={resetTicketFiltraionOptions} filterClearTrigger={filterClearTrigger}/>
            </div>
            {
                ticketsLoading ? <Loader /> :
                    tickets?.length ?
                        <>
                            <div className={styles.ticketsContainer}>
                                {
                                    tickets.map(ticket => <Ticket key={ticket.id} ticketData={ticket} triggerTicketsRefresh={triggerTicketsRefresh} />)
                                }
                            </div>
                            <div className={styles.paginationContainer}>
                                <nav className={styles.pagination}>
                                    <select className="form-select" onChange={e => changeItemsPerPage(e)} defaultValue={filtrationOptions.itemsPerPage.toString() || '4'}>
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
                                                currentPage + 1 <= pagesCount ?
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
                        </>
                        :
                        <div className={styles.noResultsContainer}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <p className='lead'>No tickets were found.</p>
                            <button className={`btn btn-outline-warning`} type="button" onClick={() => {
                                setFilterClearTrigger(state => !state);
                                resetTicketFiltraionOptions();
                            }}>
                                Clear Filters
                            </button>
                        </div>
            }
        </div>
    );
}

