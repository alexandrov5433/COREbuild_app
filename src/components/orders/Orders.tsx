import styles from './orders.module.css';

import Order from './order/Order';
import OrdersFilter from './ordersFilter/ordersFilter';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks/reduxTypedHooks';
import { OrderData, OrderFiltrationOptions } from '../../lib/definitions';
import getFilteredOrders from '../../lib/actions/getFilteredOrders';

export default function Orders() {
    const userData = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [isPageLoading, setPageLoading] = useState(true);
    const [orders, setOrders] = useState([] as Array<OrderData>);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);

    const initFiltrationOptions: OrderFiltrationOptions = {
        orderID: null,
        recipientID: null,
        shipping_status: null,
        timeAscending: false,  //older first
        timeDescending: true,  //newer first
        currentPage: 1,
        itemsPerPage: 5
    };
    const [filtrationOptions, setFiltrationOptions] = useState(initFiltrationOptions);

    useEffect(() => {
        (async () => {
            const actionResult = await getFilteredOrders(filtrationOptions);
            if (actionResult.responseStatus === 200) {
                setOrders(actionResult.data!.orders);
                setCurrentPage(actionResult.data!.currentPage);
                setPagesCount(actionResult.data!.pagesCount);
            } else if (actionResult.responseStatus === 400) {

            }
        })();
    }, [filtrationOptions]);

    return (
        <div className={`${styles.wrapper} ${styles.mainContainer}`}>
            <h1>Orders</h1>
            <div className={styles.filterContainer}>
                <OrdersFilter />
            </div>
            {
                orders ?
                    <div className={styles.ordersContainer}>
                        {
                            orders.map(order => <Order order={order} />)
                        }
                    </div>
                    :
                    <p className="lead">No orders found.</p>
            }

            {/* <nav className={styles.pagination}>
                <select className="form-select" onChange={(e) => { changeItemsPerPage(e) }} defaultValue={searchParams.get('itemsPerPage')?.toString() || '12'}>
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
            </nav> */}
            <div className={styles.paginationContainer}>
                <nav className={styles.pagination}>

                    <ul className="pagination">
                        <li className="page-item">
                            <a className="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>

                        <li className="page-item"><a className="page-link active">1</a></li>

                        <li className="page-item">
                            <a className="page-link" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

        </div>
    );
}