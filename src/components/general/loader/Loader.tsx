import styles from './loader.module.css';

export default function Loader() {
    return (
        <div className={`${styles.loaderContainer}`}>
            <div className={`spinner-border text-success`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}