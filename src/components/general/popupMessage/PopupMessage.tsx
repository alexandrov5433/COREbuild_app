import styles from './popupMessage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleCheck, faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
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
        return () => {
            clearTimeout(timeSetter);
        };
    }, [messageData.trigger]);

    function iconPicker() {
        switch (messageData.type) {
            case 'success': return <FontAwesomeIcon icon={faCircleCheck} />;
            case 'error': return <FontAwesomeIcon icon={faTriangleExclamation} />;
            case 'neutral': return <FontAwesomeIcon icon={faCircleInfo} />;
        }
    }

    return (
        <div className={`${styles.wrapper} ${styles[messageData.type]} ${showMsg ? styles.displayMsg : styles.hideMsg}`}>
            <div className={`${styles.content}`}>
                <div className={styles.iconContainer}>
                    {iconPicker()}
                </div>
                <div className={styles.textContent}>
                    <p className={styles.message}>{messageData.text}</p>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => setShowMsg(false)} className={styles.buttonElem}>
                    <FontAwesomeIcon icon={faXmark} className={styles.buttonIcon}></FontAwesomeIcon>
                </button>
            </div>
        </div>
    );
}