import { NavLink } from 'react-router';
import styles from './page404.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Page404() {
    return (
        <div className={`container ${styles.wrapper}`}>
            <h1>Page Not Found.</h1>
            <p>The page you are looking for does not exist.</p>
            <NavLink to='/' className={styles.linkToHome}>
                <FontAwesomeIcon icon={faArrowRight} className={styles.arrow}/>
                    Go To Home
                <FontAwesomeIcon icon={faArrowLeft} className={styles.arrow}/>
            </NavLink>
        </div>
    );
}