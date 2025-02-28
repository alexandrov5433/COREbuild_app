import styles from './popupMessage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../lib/hooks/reduxTypedHooks';


export default function PopupMessage() {
    const messageData = useAppSelector(state => state.popupMessage);
    const [showMsg, setShowMsg] = useState(false);
    useEffect(() => {
        setShowMsg(messageData.isShown);
        const timeSetter = setTimeout(() => {
            setShowMsg(false);
        }, messageData.duration);
        return () => clearTimeout(timeSetter);
    }, [messageData.trigger]);
    return (
        <dialog open={showMsg} className={styles.wrapper}>

            <div className={`${styles.content} ${styles[messageData.type]}`}>

                <div className={styles.textContent}>
                    <h5 className={styles.title}>
                        {
                            {
                                success: 'Success!',
                                error: 'Opps...!',
                                neutral: ''
                            }[messageData.type]
                        }
                    </h5>
                    <p className={styles.message}>{messageData.text}</p>
                </div>

                <div className={styles.buttonContainer}>
                    <button onClick={() => setShowMsg(false)} className={styles.buttonElem}>
                        <FontAwesomeIcon icon={faXmark} className={styles.buttonIcon}></FontAwesomeIcon>
                    </button>
                </div>

            </div>

        </dialog>
    );
}