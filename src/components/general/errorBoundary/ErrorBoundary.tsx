import { Component, ReactNode } from 'react';
import styles from './errorBoundary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

type Props = { children: ReactNode};
type State = { isError: boolean };

export default class ErrorBoundary extends Component {
    constructor(props: Props) {
        super(props);
        this.state= { isError: false } as State;
    }

    static getDerivedStateFromError(_e: any) {
        return { isError: true };
    }

    render(): ReactNode {
        if ((this.state as State).isError) {
            return (
                <div className={styles.wrapper}>
                    <div className={styles.triangleContainer}>
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                    </div>
                    <p className='lead'>It seems an error has occured somewhere along the way.</p>
                    <p className='lead'>Please reload the page and try again.</p>
                    <div>
                        <a className="btn btn-danger" href='https://corebuild.xyz/'>
                            Reload Page
                        </a>
                    </div>
                </div>
            );
        }
        return (this.props as Props).children;
    }
}