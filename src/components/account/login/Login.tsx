import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import styles from './login.module.css';
import login from '../../../lib/actions/user/login';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../../../redux/userSlice';
import { NavLink, useNavigate } from 'react-router';
import { setMessageData } from '../../../redux/popupMessageSlice';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordInputType, setPasswordInputType] = useState('password');
    const [areLoginCredentialsFalse, setLoginCredentialsAreFalse] = useState(false);

    const showHidePassword = function (e: ChangeEvent<HTMLInputElement>) {
        const isChecked = e.currentTarget.checked;
        if (isChecked) {
            setPasswordInputType('text');
            return;
        }
        setPasswordInputType('password');
    }
    
    const [loginState, loginAction, isLoginPending] = useActionState(login, {
        msg: '',
        data: null,
        responseStatus: 0,
        inputedUsername: ''
    });

    useEffect(() => {
        if (!isLoginPending && loginState.responseStatus === 400) {
            //false login credentials
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: loginState.msg,
                type: 'error'
            }));
            setLoginCredentialsAreFalse(true);
        } else if (!isLoginPending && loginState.responseStatus === 200) {
            //successful login
            setLoginCredentialsAreFalse(false)
            dispatch(updateUserData(loginState.data!));
            navigate('/');
        }
    }, [loginState]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.wrapper}>
            <h1>Log In</h1>
            <p>No account? <NavLink to={'/register'}>Create one now.</NavLink></p>
            <form action={loginAction}>
                <div className={`${areLoginCredentialsFalse ? 'is-invalid' : ''
                        }`}>
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className={`form-control ${areLoginCredentialsFalse ? 'is-invalid' : ''
                        }`} id="username" name="username" aria-describedby="usernameHelp" defaultValue={loginState.inputedUsername || ''} />
                    <div id="usernameHelp" className="form-text">Please enter your username.</div>
                </div>
                <div>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type={passwordInputType} className={`form-control ${areLoginCredentialsFalse ? 'is-invalid' : ''
                        }`} id="password" name="password" aria-describedby="passwordHelp" />
                    <div id="passwordHelp" className="form-text">Please enter your password.</div>
                    <div className={`form-check ${styles.checkboxContainer}`}>
                        <input type="checkbox" className="form-check-input" id="showPassword" onChange={showHidePassword} />
                        <label className="form-check-label" htmlFor="showPassword">Show password</label>
                    </div>
                </div>
                <div className="invalid-feedback">
                    {loginState.msg || ''}
                </div>
                <div className={`form-check ${styles.checkboxContainer}`}>
                    <input type="checkbox" className="form-check-input" id="stayLoggedIn" name='stayLoggedIn' />
                    <label className="form-check-label" htmlFor="stayLoggedIn">Stay logged in</label>
                </div>
                {isLoginPending ?
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    : <button type="submit" className={`btn btn-success ${styles.submitButton}`}>Log In</button>
                }
            </form>
        </div>
    );
}