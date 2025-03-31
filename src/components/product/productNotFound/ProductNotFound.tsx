import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './productNotFound.module.css';
import { faArrowRight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router';

export default function ProductNotFound({
    idOfNotFoundProduct
}: {
    idOfNotFoundProduct: number | string | undefined
}) {
    return (
        <div className={styles.productNotFound}>
            <div className={styles.triangleContainer}>
                <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            {
                !idOfNotFoundProduct ?
                    <p className='lead'>The product ID is required in order to find it. Please, check the URL.</p>
                    :
                    <p className='lead'>Sadly, the product with ID: {idOfNotFoundProduct} you are looking for could not be found.</p>
            }
            <p className='lead'>Please, take a look at our products catalog or contact us.</p>
            <div>
                <NavLink to='/products-catalog'>
                    <FontAwesomeIcon icon={faArrowRight} />Products
                </NavLink>
            </div>
            <div>
                <NavLink to='/contact'>
                    <FontAwesomeIcon icon={faArrowRight} />Contact
                </NavLink>
            </div>
            <div>
                <NavLink to='/'>
                    <FontAwesomeIcon icon={faArrowRight} />Home
                </NavLink>
            </div>
        </div>
    );
}