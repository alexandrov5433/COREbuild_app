import { useActionState, useEffect, useState } from 'react';
import styles from './register.module.css';
import logo from '../../assets/COREbuild.svg';
import register from '../../lib/actions/register';
import { RegistrationValidationError, UserData } from '../../lib/definitions';
import { useAppDispatch } from '../../lib/hooks/reduxTypedHooks';
import { updateUserData } from '../../redux/userSlice';
import { useNavigate } from 'react-router';

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [passwordInputType, setPasswordInputType] = useState('password');
    const [isEmployee, setIsEmployee] = useState(false);
    const showHidePassword = function (e: React.SyntheticEvent) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            setPasswordInputType('text');
            return;
        }
        setPasswordInputType('password');
    }
    const showHideEmployeeRegister = function (e: React.SyntheticEvent) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            setIsEmployee(true);
            return;
        }
        setIsEmployee(false);
    }
    const [validationState, setValidationState] = useState({
        is_employee: {
            valid: true,
            msg: ''
        },
        username: {
            valid: true,
            msg: ''
        },
        password: {
            valid: true,
            msg: ''
        },
        repeat_password: {
            valid: true,
            msg: ''
        },
        authentication_code: {
            valid: true,
            msg: ''
        },
        email: {
            valid: true,
            msg: ''
        },
        firstname: {
            valid: true,
            msg: ''
        },
        lastname: {
            valid: true,
            msg: ''
        },
        prefered_payment_method: {
            valid: true,
            msg: ''
        },
        address: {
            valid: true,
            msg: ''
        },

    });
    const [isFormTouched, setIsFormTouched] = useState(false);
    const [registerState, registerAction, isRegistrationPending] = useActionState(register, {
        success: false,
        msg: '',
        data: {
            userID: 0,
            is_employee: false,
            username: 'a',
        },
        responseStatus: 0,
        inputValues: {}
    });
    useEffect(() => {
        if (!isRegistrationPending && isFormTouched) {
            const newState = {};
            Object.keys(validationState).forEach(p => {
                if (Object.hasOwn(registerState.data, p)) {
                    (newState as any)[p] = (registerState.data as any)[p]; //data is of type RegistrationValidationError
                } else {
                    (newState as any)[p] = {
                        valid: true,
                        msg: ''
                    }
                }
            });
            setValidationState(newState as any);
        }
    }, [registerState]);
    useEffect(() => {
        if (!isRegistrationPending && isFormTouched && registerState.success) {
            dispatch(updateUserData(registerState.data as UserData));
            navigate('/');
            return;
        }
    }, [registerState]);

    return (
        <div className={styles.wrapper}>
            <h1>Register</h1>
            <form action={registerAction}>
                <div className={`form-check ${styles.inputContainer}`}>
                    <input type="checkbox" className="form-check-input" id="is_employee" name="is_employee" onChange={showHideEmployeeRegister} defaultChecked={Boolean(registerState.inputValues?.is_employee)}/>
                    <label className={`form-check-label ${styles.labelWithLogo}`} htmlFor="is_employee">I am an employee of<img src={logo} alt="COREbuild" /></label>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className={`form-control ${validationState.username.valid ? '' : 'is-invalid'
                        }`} id="username" name="username" aria-describedby="usernameHelp" defaultValue={registerState.inputValues.username || ''}/>
                    <div id="usernameHelp" className="form-text">Please enter your username.</div>
                    <div className="invalid-feedback">
                        {(registerState.data as RegistrationValidationError)?.username?.msg || ''}
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type={passwordInputType} className={`form-control ${validationState.password.valid ? '' : 'is-invalid'
                        }`} id="password" name="password" aria-describedby="passwordHelp"/>
                    <div id="passwordHelp" className="form-text">Please enter your password.</div>
                    <div className="invalid-feedback">
                        {(registerState.data as RegistrationValidationError)?.password?.msg || ''}
                    </div>
                    <div className={`form-check ${styles.inputContainer}`}>
                        <input type="checkbox" className="form-check-input" id="showPassword" onChange={showHidePassword} />
                        <label className="form-check-label" htmlFor="showPassword">Show password</label>
                    </div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="repeat_password" className="form-label">Repeat Password</label>
                    <input type={passwordInputType} className={`form-control ${validationState.repeat_password.valid ? '' : 'is-invalid'
                        }`} id="repeat_password" name="repeat_password" aria-describedby="repasswordHelp" />
                    <div id="repasswordHelp" className="form-text">Please enter the same password as above.</div>
                    <div className="invalid-feedback">
                        {(registerState.data as RegistrationValidationError)?.repeat_password?.msg || ''}
                    </div>
                </div>

                {
                    isEmployee ?
                        <div className={styles.inputContainer}>
                            <label htmlFor="authentication_code" className="form-label">Authentication Code</label>
                            <input type="text" className={`form-control ${validationState.authentication_code.valid ? '' : 'is-invalid'
                                }`} id="authentication_code" name="authentication_code" aria-describedby="authHelp"/>
                            <div id="authHelp" className="form-text">Please enter the authentication code to verify your employee status.</div>
                            <div className="invalid-feedback">
                                {(registerState.data as RegistrationValidationError)?.authentication_code?.msg || ''}
                            </div>
                        </div>
                        :
                        <>
                            <div className={styles.inputContainer}>
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="text" className={`form-control ${validationState.email.valid ? '' : 'is-invalid'
                                    }`} id="email" name="email" aria-describedby="emialHelp" defaultValue={registerState.inputValues.email || ''}/>
                                <div id="emialHelp" className="form-text">Please enter your email address.</div>
                                <div className="invalid-feedback">
                                    {(registerState.data as RegistrationValidationError)?.email?.msg || ''}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input type="text" className={`form-control ${validationState.firstname.valid ? '' : 'is-invalid'
                                    }`} id="firstname" name="firstname" aria-describedby="firstnameHelp" defaultValue={registerState.inputValues.firstname || ''}/>
                                <div id="firstnameHelp" className="form-text">Please enter your first name, needed for package delivery and payment receipt.</div>
                                <div className="invalid-feedback">
                                    {(registerState.data as RegistrationValidationError)?.firstname?.msg || ''}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input type="text" className={`form-control ${validationState.lastname.valid ? '' : 'is-invalid'
                                    }`} id="lastname" name="lastname" aria-describedby="lastnameHelp" defaultValue={registerState.inputValues.lastname || ''}/>
                                <div id="lastnameHelp" className="form-text">Please enter your last name, needed for package delivery and payment receipt.</div>
                                <div className="invalid-feedback">
                                    {(registerState.data as RegistrationValidationError)?.lastname?.msg || ''}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label className="form-label">Prefered Payment Method</label>
                                <div className={`${styles.paymentMethods} ${validationState.prefered_payment_method.valid ? '' : 'is-invalid'
                                    }`}>
                                    <input type="radio" className="btn-check" name="prefered_payment_method" id="paypal" value="paypal" defaultChecked={registerState.inputValues.prefered_payment_method === 'paypal' ? true : false}/>
                                    <label className="btn btn-outline-success" htmlFor="paypal">PayPal</label>

                                    <input type="radio" className="btn-check" name="prefered_payment_method" id="bank" value="bank" defaultChecked={registerState.inputValues.prefered_payment_method === 'bank' ? true : false}/>
                                    <label className="btn btn-outline-success" htmlFor="bank">Bank</label>
                                </div>
                                <div id="paymentHelp" className="form-text">Please select your prefered payment method.</div>
                                <div className="invalid-feedback">
                                    {(registerState.data as RegistrationValidationError)?.prefered_payment_method?.msg || ''}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" className={`form-control ${validationState.address.valid ? '' : 'is-invalid'
                                    }`} id="address" name="address" aria-describedby="addressHelp" defaultValue={registerState.inputValues.address || ''}/>
                                <div id="addressHelp" className="form-text">Please enter your postal address, needed for package delivery.</div>
                                <div className="invalid-feedback">
                                    {(registerState.data as RegistrationValidationError)?.address?.msg || ''}
                                </div>
                            </div>
                        </>
                }

                <div className={`form-check ${styles.inputContainer}`}>
                    <input type="checkbox" className="form-check-input" id="stayLoggedIn" name='stayLoggedIn' />
                    <label className="form-check-label" htmlFor="stayLoggedIn">Stay logged in</label>
                </div>


                {
                    isRegistrationPending ?
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        : <button type="submit" className={`btn btn-success ${styles.submitButton}`} onClick={() => setIsFormTouched(true)}>Register</button>
                }
            </form>
        </div>
    );
}