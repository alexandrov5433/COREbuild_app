import { useActionState, useEffect, useRef, useState } from 'react';
import styles from './register.module.css';
import logo from '../../../assets/COREbuild.svg';
import register from '../../../lib/actions/user/register';
import { RegistrationValidationError, UserData } from '../../../lib/definitions';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { updateUserData } from '../../../redux/userSlice';
import { useNavigate } from 'react-router';
import { setMessageData } from '../../../redux/popupMessageSlice';

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [passwordInputType, setPasswordInputType] = useState('password');
    const [isEmployee, setIsEmployee] = useState(false);

    const initValidationStateEmployee = {
        username: {
            valid: false,
            touched: false,
            msg: ''
        },
        password: {
            valid: false,
            touched: false,
            msg: ''
        },
        repeat_password: {
            valid: false,
            touched: false,
            msg: ''
        },
        authentication_code: {
            valid: false,
            touched: false,
            msg: ''
        }
    };
    const initValidationStateCustomer = {
        username: {
            valid: false,
            touched: false,
            msg: ''
        },
        password: {
            valid: false,
            touched: false,
            msg: ''
        },
        repeat_password: {
            valid: false,
            touched: false,
            msg: ''
        },
        email: {
            valid: false,
            touched: false,
            msg: ''
        },
        firstname: {
            valid: false,
            touched: false,
            msg: ''
        },
        lastname: {
            valid: false,
            touched: false,
            msg: ''
        },
        address: {
            valid: false,
            touched: false,
            msg: ''
        }
    };
    const [validationState, setValidationState] = useState(initValidationStateCustomer);
    const passwordRef = useRef(null);
    const formRef = useRef(null);
    const initFormState = {
        isValid: false,
        isTouched: false
    };
    const [formState, setFormState] = useState(initFormState);

    const showHidePassword = function (e: React.SyntheticEvent) {
        const isChecked = (e.target as HTMLInputElement).checked;
        if (isChecked) {
            setPasswordInputType('text');
            return;
        }
        setPasswordInputType('password');
    }
    const showHideEmployeeRegister = function () {
        (formRef.current! as HTMLFormElement)?.reset();
        setValidationState((!isEmployee ? initValidationStateEmployee : initValidationStateCustomer) as any); // must change validationState before isEmployee because otherwise React uses customer validationState for employee and vise versa
        setIsEmployee(state => !state);
        setFormState(initFormState);
    }
    const [registerState, registerAction, isRegistrationPending] = useActionState(register, {
        msg: '',
        userData: null,
        validationErrorsData: {} as RegistrationValidationError,
        responseStatus: 0,
        inputValues: {}
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (registerState.responseStatus === 200) {
            dispatch(updateUserData(registerState.userData as UserData));
            navigate('/');
            return;
        } else if (registerState.responseStatus === 400) {
            const newState = {};
            Object.keys(validationState).forEach(p => {
                if (Object.hasOwn(registerState.validationErrorsData, p)) {
                    (newState as any)[p] = (registerState.validationErrorsData as any)[p]; //data is of type RegistrationValidationError
                }
            });
            setValidationState(newState as any);
        }else if (registerState.responseStatus === 403) {
            // username and/or email are already in use
            dispatch(setMessageData({
                duration: 8500,
                isShown: true,
                text: registerState.msg,
                type: 'error'
            }));
            setValidationState((isEmployee ? initValidationStateEmployee : initValidationStateCustomer) as any); // must change validationState before isEmployee because otherwise React uses customer validationState for employee and vise versa
            setFormState(initFormState);
        }
    }, [registerState]);
    
    useEffect(() => {
        const isFormInvalid = Object.values(validationState).find(field => !field.valid);
        setFormState(state => {
            const newState = {...state};
            newState.isValid = !isFormInvalid;
            return newState;
        });
    }, [validationState]);


    function validator(e: React.SyntheticEvent<HTMLInputElement>) {
        const val = (e.target! as HTMLInputElement).value;
        const fieldName = (e.target! as HTMLInputElement).name;  
        const passwordRefVal = (passwordRef.current! as HTMLFormElement)?.value
        const regexpLib = {
            'username': new RegExp(/^[A-Za-z0-9@_+?!-]{1,30}$/),
            'password': new RegExp(/^[A-Za-z0-9@_+?!-]{5,50}$/),
            'repeat_password': new RegExp(`^${passwordRefVal}$`),
            'email': new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/),
            'firstname': new RegExp(/^[A-Za-z]{1,50}$/),
            'lastname': new RegExp(/^[A-Za-z]{1,50}$/),
            'address': new RegExp(/^[A-Za-z0-9\., -]+$/),
            'authentication_code': new RegExp(/^.+$/),
        }
        const validity = ((regexpLib as any)[fieldName])?.test(val);
        setValidationState(state => {
            const newState = { ...state };
            (newState as any)[fieldName].valid = validity;
            (newState as any)[fieldName].touched = true;
            return newState;
        });
    }

    return (
        <div className={styles.wrapper}>
            <h1>Register</h1>
            <p className={`${styles.mandatoryFielsExplanation}`}>Please fill out all mandatory <i>*</i> fields.</p>
            <form action={registerAction} ref={formRef}>
                <div className={`form-check ${styles.inputContainer} ${styles.checkboxContainer} ${styles.employeeCheckboxContainer}`}>
                    <input type="checkbox" className="form-check-input" id="is_employee" name="is_employee" onClick={showHideEmployeeRegister} defaultChecked={isEmployee}/>
                    <label className={`form-check-label ${styles.labelWithLogo}`} htmlFor="is_employee">I am an employee of<img src={logo} alt="COREbuild" /></label>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="username" className="form-label">Username <i>*</i></label>
                    <input type="text" className={`form-control ${validationState.username.touched ? (validationState.username.valid ? 'is-valid' : 'is-invalid') : ''
                        }`} id="username" name="username" aria-describedby="usernameHelp" defaultValue={registerState.inputValues.username || ''} onInput={e => validator(e)} />
                    <div id="usernameHelp" className="form-text">Please enter your username.It can be beween 1 and 30 characters long and may include letters, numbers and the following symbols: @-_+?!</div>
                    <div className="invalid-feedback">
                        {(registerState.validationErrorsData as RegistrationValidationError)?.username?.msg || ''}
                    </div>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="password" className="form-label">Password <i>*</i></label>
                    <input ref={passwordRef} type={passwordInputType} className={`form-control ${validationState.password.touched ? (validationState.password.valid ? 'is-valid' : 'is-invalid') : ''
                        }`} id="password" name="password" aria-describedby="passwordHelp" onInput={e => validator(e)} />
                    <div id="passwordHelp" className="form-text">Please enter your password. It can be beween 5 and 50 characters long and may include letters, numbers and the following symbols: @-_+?!</div>
                    <div className="invalid-feedback">
                        {(registerState.validationErrorsData as RegistrationValidationError)?.password?.msg || ''}
                    </div>
                    <div className={`form-check ${styles.inputContainer} ${styles.checkboxContainer}`}>
                        <input type="checkbox" className="form-check-input" id="showPassword" onChange={showHidePassword} />
                        <label className="form-check-label" htmlFor="showPassword">Show password</label>
                    </div>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="repeat_password" className="form-label">Repeat Password <i>*</i></label>
                    <input type={passwordInputType} className={`form-control ${validationState.repeat_password.touched ? (validationState.repeat_password.valid ? 'is-valid' : 'is-invalid') : ''
                        }`} id="repeat_password" name="repeat_password" aria-describedby="repasswordHelp" onInput={e => validator(e)}/>
                    <div id="repasswordHelp" className="form-text">Please enter the same password as above.</div>
                    <div className="invalid-feedback">
                        {(registerState.validationErrorsData as RegistrationValidationError)?.repeat_password?.msg || ''}
                    </div>
                </div>

                {
                    isEmployee ?
                        <div className={styles.inputContainer}>
                            <label htmlFor="authentication_code" className="form-label">Authentication Code <i>*</i></label>
                            <input type="text" className={`form-control ${(validationState as any).authentication_code.touched ? ((validationState as any).authentication_code.valid ? 'is-valid' : 'is-invalid') : ''
                                }`} id="authentication_code" name="authentication_code" aria-describedby="authHelp" onInput={e => validator(e)}/>
                            <div id="authHelp" className="form-text">Please enter the authentication code to verify your employee status.</div>
                            <div className="invalid-feedback">
                                {(registerState.validationErrorsData as RegistrationValidationError)?.authentication_code?.msg || ''}
                            </div>
                        </div>
                        :
                        <>
                            <div className={styles.inputContainer}>
                                <label htmlFor="email" className="form-label">Email <i>*</i></label>
                                <input type="text" className={`form-control ${validationState.email.touched ? (validationState.email.valid ? 'is-valid' : 'is-invalid') : ''
                                    }`} id="email" name="email" aria-describedby="emialHelp" defaultValue={registerState.inputValues.email || ''} onInput={e => validator(e)} />
                                <div id="emialHelp" className="form-text">Please enter your email address. Eg. example123!?_-@so23me.com.gov</div>
                                <div className="invalid-feedback">
                                    {(registerState.validationErrorsData as RegistrationValidationError)?.email?.msg || ''}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="firstname" className="form-label">First Name <i>*</i></label>
                                <input type="text" className={`form-control ${validationState.firstname.touched ? (validationState.firstname.valid ? 'is-valid' : 'is-invalid') : ''
                                    }`} id="firstname" name="firstname" aria-describedby="firstnameHelp" defaultValue={registerState.inputValues.firstname || ''} onInput={e => validator(e)} />
                                <div id="firstnameHelp" className="form-text">Please enter your first name, needed for package delivery and payment receipt. It can be between 1 and 50 characters long and may only include letters.</div>
                                <div className="invalid-feedback">
                                    {(registerState.validationErrorsData as RegistrationValidationError)?.firstname?.msg || ''}
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <label htmlFor="lastname" className="form-label">Last Name <i>*</i></label>
                                <input type="text" className={`form-control ${validationState.lastname.touched ? (validationState.lastname.valid ? 'is-valid' : 'is-invalid') : ''
                                    }`} id="lastname" name="lastname" aria-describedby="lastnameHelp" defaultValue={registerState.inputValues.lastname || ''} onInput={e => validator(e)} />
                                <div id="lastnameHelp" className="form-text">Please enter your last name, needed for package delivery and payment receipt. It can be between 1 and 50 characters long and may only include letters.</div>
                                <div className="invalid-feedback">
                                    {(registerState.validationErrorsData as RegistrationValidationError)?.lastname?.msg || ''}
                                </div>
                            </div>
                         
                            <div className={styles.inputContainer}>
                                <label htmlFor="address" className="form-label">Address <i>*</i></label>
                                <input type="text" className={`form-control ${validationState.address.touched ? (validationState.address.valid ? 'is-valid' : 'is-invalid') : ''
                                    }`} id="address" name="address" aria-describedby="addressHelp" defaultValue={registerState.inputValues.address || ''} onInput={e => validator(e)} />
                                <div id="addressHelp" className="form-text">Please enter your postal address, needed for package delivery.</div>
                                <div className="invalid-feedback">
                                    {(registerState.validationErrorsData as RegistrationValidationError)?.address?.msg || ''}
                                </div>
                            </div>
                        </>
                }

                <div className={`form-check ${styles.inputContainer} ${styles.checkboxContainer}`}>
                    <input type="checkbox" className="form-check-input" id="stayLoggedIn" name='stayLoggedIn' />
                    <label className="form-check-label" htmlFor="stayLoggedIn">Stay logged in</label>
                </div>


                {
                    isRegistrationPending ?
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        : <button type="submit" className={`btn btn-success ${styles.submitButton}`} disabled={!formState.isValid} >Register</button>
                }
            </form>
        </div>
    );
}