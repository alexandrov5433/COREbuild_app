import styles from './order.module.css';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { OrderData, UserData } from '../../../lib/definitions';
import Item from './item/Item';
import { convertCentToWholeString } from '../../../lib/util/currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign, faTruckFast, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks/reduxTypedHooks';
import getUserData from '../../../lib/actions/user/getUserData';
import updateOrderShippingDetails from '../../../lib/actions/order/updateOrderShippingDetails';
import { setMessageData } from '../../../redux/popupMessageSlice';
import { convertTimeToDate } from '../../../lib/util/time';

export default function Order({
  order,
  ordersRefreshTrigger
}: {
  order: OrderData, ordersRefreshTrigger: () => void
}) {
  const allProductIDsAndCount = Object.entries(order.content) || [];
  const userData = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const shipmentFormRef = useRef(null);

  const [isShipmentToolsOpen, setShipmentToolsOpen] = useState(false);
  const [recipientData, setRecipientData] = useState({} as UserData);
  const [isShipmentStatusUpdateInProgress, setShipmentStatusUpdateInProgress] = useState(false);
  const initshipmentStatusFormValidity = {
    isFormValid: false,
    shipping_speditor: false,
    shipment_tracking_code: false,
  };
  const [shipmentStatusFormValidity, setShipmentStatusFormValidity] = useState(initshipmentStatusFormValidity)

  useEffect(() => {
    (async () => {
      if (!order.recipient) {
        return
      }
      const actionResult = await getUserData(order.recipient);
      if (actionResult.responseStatus === 200) {
        setRecipientData(actionResult.data!);
      }
    })();
  }, [order]);

  useEffect(() => {
    const dependencies = [
      shipmentStatusFormValidity.shipment_tracking_code,
      shipmentStatusFormValidity.shipping_speditor
    ];
    const isFormValid = !dependencies.includes(false);
    setShipmentStatusFormValidity(state => {
      const newState = { ...state };
      newState.isFormValid = isFormValid;
      return newState;
    });
  }, [
    shipmentStatusFormValidity.shipment_tracking_code,
    shipmentStatusFormValidity.shipping_speditor
  ]);

  async function onUpdateShipmentStatus() {
    const formData = new FormData(shipmentFormRef.current!);
    if (!formData || !order.id) {
      return;
    }
    setShipmentStatusUpdateInProgress(true);
    const actionResult = await updateOrderShippingDetails(order.id, formData);
    if (actionResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Shipment details updated!',
        type: 'success'
      }));
      ordersRefreshTrigger();
    } else {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: actionResult.msg,
        type: 'error'
      }));
    }
    setShipmentStatusUpdateInProgress(false);
  }

  function shipmentFormValidator(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    const name = e.target.name;
    let isValild = Boolean(val);
    setShipmentStatusFormValidity(state => {
      const newState = { ...state };
      (newState as any)[name] = isValild;
      return newState;
    });
  }

  return (
    <div id={order?.id?.toString() || ''} className={styles.mainContainer}>
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
              <h5><i>Total:</i> {convertCentToWholeString(order.total_price)} <FontAwesomeIcon icon={faEuroSign} /></h5>

              <p><i>Time Of Placement:</i> {convertTimeToDate(order.placement_time || 0)}</p>

              <p><i>Payment Status:</i> <span className={order.payment_status == 'paid' ? styles.green : styles.yellow}>{order.payment_status} {
                order.payment_status == 'paid' ? <FontAwesomeIcon icon={faCheckCircle} /> : <FontAwesomeIcon icon={faClock} />
              }</span></p>

              <p><i>Shipping Status:</i> <span className={order.shipping_status == 'sent' ? styles.green : styles.yellow}>{order.shipping_status} {
                order.shipping_status == 'sent' ? <FontAwesomeIcon icon={faTruckFast} /> : <FontAwesomeIcon icon={faClock} />
              }</span></p>

              <p><i>Recipient:</i> {recipientData.firstname} {recipientData.lastname}</p>
              <p><i>Delivery Address:</i> {recipientData.address}</p>

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
                <section className={styles.shipmentManagementSection}>
                  {
                    order.shipping_status == 'sent' ?

                      <form ref={shipmentFormRef} id={`shipment-manager-${order.id}`}>
                        <h4>Revert Shipment Status</h4>

                        <input type="radio" className="btn-check" name="shipping_status" value="pending" checked readOnly />

                        <div className={styles.buttonsContainer}>
                          <button className="btn btn-danger" type="button" onClick={onUpdateShipmentStatus} disabled={isShipmentStatusUpdateInProgress}>Revert To Pending</button>
                        </div>
                      </form>

                      :

                      <>
                        <button className="btn btn-primary mb-1" type="button" data-bs-toggle="collapse" data-bs-target={`#shipment-manager-${order.id}`} onClick={() => setShipmentToolsOpen(state => !state)}>
                          {isShipmentToolsOpen ? 'Close Shipment Manager' : 'Open Shipment Manager'}
                        </button>
                        <form ref={shipmentFormRef} className={`collapse`} id={`shipment-manager-${order.id}`}>
                          <h4>Update Shipment Status</h4>
                          <p>Mandatory Fields <i>*</i></p>
                          <div className="mb-3">
                            <label htmlFor="shipping_speditor" className="form-label">Speditor <i>*</i></label>
                            <input type="text" id="shipping_speditor" name="shipping_speditor" className={`form-control ${shipmentStatusFormValidity.shipping_speditor ? 'is-valid' : ''}`} onChange={e => shipmentFormValidator(e)} />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="shipment_tracking_code" className="form-label">Tracking Code <i>*</i></label>
                            <input type="text" id="shipment_tracking_code" name="shipment_tracking_code" className={`form-control ${shipmentStatusFormValidity.shipment_tracking_code ? 'is-valid' : ''}`} onChange={e => shipmentFormValidator(e)} />
                          </div>

                          <input type="radio" className="btn-check" name="shipping_status" value="sent" checked readOnly />

                          <hr />
                          <div className={styles.buttonsContainer}>
                            <button className="btn btn-primary" type="button" onClick={onUpdateShipmentStatus} disabled={isShipmentStatusUpdateInProgress || !shipmentStatusFormValidity.isFormValid}>Update Status</button>
                          </div>
                        </form>
                      </>
                  }
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