import styles from './userDetails.module.css';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';
import { useEffect, useRef, useState } from 'react';
import getUserData from '../../../../lib/actions/user/getUserData';
import { UserData } from '../../../../lib/definitions';
import { setMessageData } from '../../../../redux/popupMessageSlice';

export default function UserDetails() {
    const userData = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const infoFormRef = useRef(null);

    const initialInfoFormState = {
        isFormValid: true,
        email: true,
        firstname: true,
        lastname: true,
        address: true
    };
    const [infoFormState, setInfoFormState] = useState(initialInfoFormState)
    const [isSavingInfoChangesLoading, setSavingInfoChangesLoading] = useState(false);
    const [completeUserData, setCompleteUserData] = useState({} as UserData);
    const [isCompleteUserDataLoading, setCompleteUserDataLoading] = useState(false);


    useEffect(() => {
        __getUserData()
    }, [userData]);

    useEffect(() => {
        const isValid = [
            infoFormState.email,
            infoFormState.firstname,
            infoFormState.lastname,
            infoFormState.address,
        ].includes(false);
        setInfoFormState(state => {
            const newState = {...state};
            newState.isFormValid = !isValid;
            return newState;
        });
    }, [
        infoFormState.email,
        infoFormState.firstname,
        infoFormState.lastname,
        infoFormState.address,
    ]);

    async function __getUserData() {
        if (!userData.userID) {
            return;
        }
        setCompleteUserDataLoading(true);
        const userDataAction = await getUserData(userData.userID);
        if (userDataAction.responseStatus === 200) {
            setCompleteUserData(userDataAction.data!);
        } else if (userDataAction.responseStatus === 400) {
            dispatch(setMessageData({
                duration: 4000,
                isShown: true,
                text: userDataAction.msg,
                type: 'error'
            }));
        }
        setCompleteUserDataLoading(false);
    }

    function removeChangesFromInfoForm() {
        (infoFormRef.current! as HTMLFormElement).reset();
        (infoFormRef.current! as HTMLFormElement).scrollIntoView({
            behavior: 'smooth'
        });
        setInfoFormState(initialInfoFormState);
    }

    function infoValueValidator(e: React.FormEvent<HTMLInputElement>) {
        const valueToCheck = e.currentTarget.value || '';
        const elementName = e.currentTarget.name || '';
        const isThisValid = {
            'email': new RegExp(/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/),
            'firstname': new RegExp(/^[A-Za-z]{1,50}$/),
            'lastname': new RegExp(/^[A-Za-z]{1,50}$/),
            'address': new RegExp(/^[A-Za-z0-9\., -]+$/)
        }[elementName]?.test(valueToCheck);
        setInfoFormState(state => {
            const newState = { ...state };
            (newState as any)[elementName] = isThisValid;
            return newState;
        });
    }

    async function saveInfoChages() {
        setSavingInfoChangesLoading(true);
        setSavingInfoChangesLoading(false);
    }

    return (
        <div>
            <form ref={infoFormRef}>

                <div className="mb-4">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className={`form-control ${infoFormState.email ? '' : 'is-invalid'}`} id="email" name="email" defaultValue={completeUserData.email! || ''} onInput={e => infoValueValidator(e)} />
                    <p className="form-text">For the product name the symbols % &amp; $ * _ ' " are not allowed. Maximum length: 200 characters.</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="firstname" className="form-label">First Name</label>
                    <input type="text" className={`form-control ${infoFormState.firstname ? '' : 'is-invalid'}`} id="firstname" name="firstname" defaultValue={completeUserData.firstname! || ''} onInput={e => infoValueValidator(e)} />
                    <p className="form-text">For the product description the symbols % &amp; $ * _ ' " are not allowed.</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="lastname" className="form-label">Last Name</label>
                    <input type="text" className={`form-control ${infoFormState.lastname ? '' : 'is-invalid'}`} id="lastname" name="lastname" defaultValue={completeUserData.lastname! || ''} onInput={e => infoValueValidator(e)} />
                    <p className="form-text">This field is case-INsensitive. The words cpu, Cpu and CPU are the same. Only letters and space are allowed. Maximum length: 200 characters.</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className={`form-control ${infoFormState.address ? '' : 'is-invalid'}`} id="address" name="address" defaultValue={completeUserData.address! || ''} onInput={e => infoValueValidator(e)} />
                    <p className="form-text">Two digits after the dot are allowed. Please use a dot as a decimal separator.</p>
                </div>


                <div className={styles.buttonsDataEditor}>
                    <button type="button" className="btn btn-success" disabled={!infoFormState.isFormValid || isSavingInfoChangesLoading} onClick={saveInfoChages}>Save Infos</button>
                    <button type="button" className="btn btn-outline-warning" onClick={removeChangesFromInfoForm}>Remove Changes</button>
                </div>


            </form>
        </div>
    );
}