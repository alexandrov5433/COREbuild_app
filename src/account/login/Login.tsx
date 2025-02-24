import styles from './login.module.css';

export default function Login() {
    return (
        <div className={styles.wrapper}>
            <form>
                <div className={styles.inputContainer}>
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" aria-describedby="usernameHelp" />
                    <div id="usernameHelp" className="form-text">Please enter your username.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" aria-describedby="passwordHelp" />
                    <div id="passwordHelp" className="form-text">Please enter your password.</div>
                </div>
                <div className={`form-check ${styles.inputContainer}`}>
                    <input type="checkbox" className="form-check-input" id="showPassword" />
                    <label className="form-check-label" htmlFor="showPassword">Show password</label>
                </div>
                <div className={`form-check ${styles.inputContainer}`}>
                    <input type="checkbox" className="form-check-input" id="stayLoggedIn" name='stayLoggedIn'/>
                    <label className="form-check-label" htmlFor="stayLoggedIn">I want to stay logged in</label>
                </div>
                <button type="submit" className={`btn btn-success ${styles.submitButton}`}>Log In</button>
            </form>
        </div>
    );
}