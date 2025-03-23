import styles from './order.module.css';
import { useEffect, useRef, useState } from 'react';
import { OrderData } from '../../../lib/definitions';
import Item from './item/Item';
import { convertCentToWhole } from '../../../lib/util/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign, faTruckFast, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useAppSelector } from '../../../lib/hooks/reduxTypedHooks';

export default function Order({ order }: { order: OrderData }) {
  const allProductIDsAndCount = Object.entries(order.content) || [];
  const userData = useAppSelector(state => state.user);
  const [isShipmentToolsOpen, setShipmentToolsOpen] = useState(false);
  const shipmentFormRef = useRef(null);

  async function onUpdateShipmentStatus() {

  }

  return (
    <div className={styles.mainContainer}>
      {
        order?.id ?
          <>
            <h4>Order ID: {order.id}</h4>
            <section className={styles.itemsSection}>
              {
                allProductIDsAndCount.length ?
                  allProductIDsAndCount.map(([productID, count]) => <Item key={productID} productID={Number(productID)} count={count} />)
                  :
                  <p className="lead">No products found in order.</p>
              }
            </section>
            <section className={styles.infoSection}>
              <h5><i>Total:</i> {convertCentToWhole(order.total_price)} <FontAwesomeIcon icon={faEuroSign} /></h5>

              <p><i>Payment Status:</i> <span className={order.payment_status == 'paid' ? styles.green : styles.yellow}>{order.payment_status} {
                order.payment_status == 'paid' ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faClock} />
              }</span></p>

              <p><i>Shipping Status:</i> <span className={order.shipping_status == 'sent' ? styles.green : styles.yellow}>{order.shipping_status} {
                order.shipping_status == 'sent' ? <FontAwesomeIcon icon={faTruckFast} /> : <FontAwesomeIcon icon={faClock} />
              }</span></p>

              <p><i>Recipient:</i> {order.recipient}</p>
              <p><i>Delivery Address:</i> {order.shipping_speditor}</p>

              {
                order.shipping_status == 'sent' ?
                  <>
                    <p><i>Speditor:</i> {order.shipping_speditor}</p>
                    <p><i>Tracking Code:</i> {order.shipment_tracking_code}</p>
                  </>
                  : ''
              }
            </section>
            {
              userData?.userID && userData?.is_employee ?
                <section>
                  <button className="btn btn-primary mb-1" type="button" data-bs-toggle="collapse" data-bs-target={`#shipment-manager-${order.id}`} onClick={() => setShipmentToolsOpen(state => !state)}>
                    {isShipmentToolsOpen ? 'Close Shipment Manager' : 'Open Shipment Manager'}
                  </button>
                  <form ref={shipmentFormRef} className={`collapse`} id={`shipment-manager-${order.id}`}>
                    <h4>Update Shipment Status</h4>
                    <div className="mb-3">
                      <label htmlFor="shipping_speditor" className="form-label">Speditor</label>
                      <input type="text" id="shipping_speditor" name="shipping_speditor" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="shipment_tracking_code" className="form-label">Tracking Code</label>
                      <input type="text" id="shipment_tracking_code" name="shipment_tracking_code" className="form-control" />
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
                    <hr />
                    <div className={styles.buttonsContainer}>
                      <button className="btn btn-primary" type="button" onClick={onUpdateShipmentStatus}>Update Status</button>
                    </div>
                  </form>
                </section>
                : ''
            }
          </>
          :
          <p className="lead">Order not found.</p>
      }
    </div>
  );
}