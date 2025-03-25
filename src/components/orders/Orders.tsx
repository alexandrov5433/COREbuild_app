import styles from './orders.module.css';

import Order from './order/Order';
import OrdersFilter from './ordersFilter/OrdersFilter';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/reduxTypedHooks';
import { OrderData, OrderFiltrationOptions } from '../../lib/definitions';
import getFilteredOrders from '../../lib/actions/order/getFilteredOrders';
import { setMessageData } from '../../redux/popupMessageSlice';
import Loader from '../general/loader/Loader';

export default function Orders() {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.user);

    const mostUpperElementRef = useRef(null);

    const [isPageLoading, setPageLoading] = useState(true);
    const [orders, setOrders] = useState([] as Array<OrderData>);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const [ordersRefreshTrigger, setOrdersRefreshTrigger] = useState(false);

    const initFiltrationOptions: OrderFiltrationOptions = {
        orderID: null,
        recipientID: null,
        shipping_status: null,
        time: 'descending',
        currentPage: 1,
        itemsPerPage: 4
    };
    const [filtrationOptions, setFiltrationOptions] = useState(initFiltrationOptions);

    useEffect(() => {
        getOrders();
    }, [filtrationOptions, ordersRefreshTrigger]);

    async function getOrders() {
        setPageLoading(true);
        const actionResult = await getFilteredOrders(filtrationOptions);
        if (actionResult.responseStatus === 200) {
            setOrders(actionResult.data!.orders);
            setCurrentPage(actionResult.data!.currentPage);
            setPagesCount(actionResult.data!.pagesCount);
        } else if (actionResult.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: actionResult.msg,
                type: 'error'
            }));
        }
        setPageLoading(false);
    }

    function updateFilter(options: {
        orderID: number | null,
        recipientID: number | null,
        shipping_status: 'pending' | 'shipped' | null,
        time: 'ascending' | 'descending' | null,
    }) {
        setFiltrationOptions(state => {
            const newState = { ...state };
            Object.assign(newState, options);
            return newState;
        });
    }
    function activateOrdersRefreshTrigger() {
        setOrdersRefreshTrigger(state => !state);
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
        (mostUpperElementRef?.current! as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
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
        (mostUpperElementRef?.current! as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
    }
    function goToGivenPage(page: number) {
        setFiltrationOptions(state => {
            const newState = { ...state };
            const targetPage = page < 1 ? 1 : (page > pagesCount ? pagesCount : page);
            newState.currentPage = targetPage;
            return newState;
        });
        (mostUpperElementRef?.current! as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
    }
    function changeItemsPerPage(e: React.ChangeEvent<HTMLSelectElement>) {
        const itemsPerPageToSet = {
            '4': 4,
            '8': 8,
            '12': 12,
            '24': 24
        }[e.target.value] || 4;
        console.log(itemsPerPageToSet);
        
        setFiltrationOptions(state => {
            const newState = { ...state };
            newState.itemsPerPage = itemsPerPageToSet;
            return newState;
        });
        (mostUpperElementRef?.current! as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div ref={mostUpperElementRef} className={`${styles.wrapper} ${styles.mainContainer}`}>
            <h1>{userData.is_employee ? '' : 'My '}Orders</h1>
            <div className={styles.filterContainer}>
                <OrdersFilter updateFilter={updateFilter} />
            </div>
            {
                isPageLoading ? <Loader /> :
                    orders.length ?
                        <div className={styles.ordersContainer}>
                            {
                                orders.map(order => <Order key={order.id} order={order} ordersRefreshTrigger={activateOrdersRefreshTrigger} />)
                            }
                        </div>
                        :
                        <p className="lead">No orders found.</p>
            }

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

        </div>
    );
}