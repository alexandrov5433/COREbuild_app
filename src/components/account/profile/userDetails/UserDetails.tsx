import styles from './userDetails.module.css';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks/reduxTypedHooks';
import { useEffect, useRef, useState } from 'react';
import getUserData from '../../../../lib/actions/user/getUserData';
import { UserData } from '../../../../lib/definitions';
import { setMessageData } from '../../../../redux/popupMessageSlice';
import Loader from '../../../general/loader/Loader';
import editProfileDetails from '../../../../lib/actions/user/editProfileDetails';

export default function UserDetails() {
  const userData = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const infoFormRef = useRef(null);
  const passwordFormRef = useRef(null);
  
  const [completeUserData, setCompleteUserData] = useState({} as UserData);

  const initialInfoFormState = {
    isFormValid: true,
    email: true,
    firstname: true,
    lastname: true,
    address: true
  };
  const [infoFormState, setInfoFormState] = useState(initialInfoFormState)
  const [isSavingInfoChangesLoading, setSavingInfoChangesLoading] = useState(false);
  const [isCompleteUserDataLoading, setCompleteUserDataLoading] = useState(false);

  const initialPasswordFormState = {
    isFormValid: false,
    currentPassword: {
      isValid: false,
      isTouched: false
    },
    newPassword: {
      isValid: false,
      isTouched: false
    }
  } as {
    isFormValid: boolean,
    currentPassword: {
      isValid: boolean,
      isTouched: boolean
    },
    newPassword: {
      isValid: boolean,
      isTouched: boolean
    }
  }
  const [passwordFormState, setPasswordFormState] = useState(initialPasswordFormState)
  const [isPasswordChangeInProgress, setPasswordChangeInProgress] = useState(false);

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
      const newState = { ...state };
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

  function clearPasswordForm() {
    (passwordFormRef.current! as HTMLFormElement).reset();
    (passwordFormRef.current! as HTMLFormElement).scrollIntoView({
      behavior: 'smooth'
    });
    setPasswordFormState(initialPasswordFormState);
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

  function newPasswordValidator(e: React.FormEvent<HTMLInputElement>) {
    const valueToCheck = e.currentTarget.value || '';
    const elementName = e.currentTarget.name || '';
    const isThisValid = {
      currentPassword: /^.+$/,
      newPassword: /^[A-Za-z0-9@_+?!-]{5,50}$/
    }[elementName]?.test(valueToCheck);
    setPasswordFormState(state => {
      const newState = { ...state };
      (newState as any)[elementName].isValid = isThisValid;
      (newState as any)[elementName].isTouched = true;
      const isTheFormValid = [
        newState.currentPassword.isValid,
        newState.newPassword.isValid
      ].includes(false);
      newState.isFormValid = !isTheFormValid;
      return newState;
    });
  }

  async function saveInfoChages() {
    const formData = new FormData(infoFormRef.current!);
    if (!formData || !userData.userID) {
      return;
    }
    setSavingInfoChangesLoading(true);
    const action = await editProfileDetails(userData.userID, formData);
    if (action.responseStatus === 200) {
      await __getUserData();
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Profile details updated!',
        type: 'success'
      }));
    } else if (action.responseStatus === 400) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: action.msg,
        type: 'error'
      }));
    }
    setSavingInfoChangesLoading(false);
  }

  async function changePassword() {
    setPasswordChangeInProgress(true);
    setPasswordChangeInProgress(false);
  }

  return (
    <div>
      {
        isCompleteUserDataLoading ?
          <Loader />
          :
          <>
            <div>
              <h4>My UserID: {userData.userID}</h4>
            </div>

            <hr className="mb-4 mt-4" />

            <form ref={infoFormRef}>
              <h4>Change Personal Details</h4>

              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="text" className={`form-control ${infoFormState.email ? '' : 'is-invalid'}`} id="email" name="email" defaultValue={completeUserData.email! || ''} onInput={e => infoValueValidator(e)} />
                <p className="form-text">Please enter a valid email like: example123@some.com, example123!?_-@so23me.com.gov</p>
              </div>

              <div className="mb-4">
                <label htmlFor="firstname" className="form-label">First Name</label>
                <input type="text" className={`form-control ${infoFormState.firstname ? '' : 'is-invalid'}`} id="firstname" name="firstname" defaultValue={completeUserData.firstname! || ''} onInput={e => infoValueValidator(e)} />
                <p className="form-text">First name must be between 1 and 50 characters long and may only include letters.</p>
              </div>

              <div className="mb-4">
                <label htmlFor="lastname" className="form-label">Last Name</label>
                <input type="text" className={`form-control ${infoFormState.lastname ? '' : 'is-invalid'}`} id="lastname" name="lastname" defaultValue={completeUserData.lastname! || ''} onInput={e => infoValueValidator(e)} />
                <p className="form-text">Last name must be between 1 and 50 characters long and may only include letters.</p>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="form-label">Address</label>
                <input type="text" className={`form-control ${infoFormState.address ? '' : 'is-invalid'}`} id="address" name="address" defaultValue={completeUserData.address! || ''} onInput={e => infoValueValidator(e)} />
                <p className="form-text">Please enter a postal address. Example: "Some-Str. 34a, 23456, Some City"</p>
              </div>


              <div className={styles.buttonsDataEditor}>
                <button type="button" className="btn btn-success" disabled={!infoFormState.isFormValid || isSavingInfoChangesLoading} onClick={saveInfoChages}>Save Infos</button>
                <button type="button" className="btn btn-outline-warning" onClick={removeChangesFromInfoForm}>Remove Changes</button>
              </div>

            </form>

            <hr className="mb-4 mt-4" />

            <form ref={passwordFormRef}>
              <h4>Change Password</h4>

              <div className="mb-4">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input type="text" className={`form-control ${
                  passwordFormState.currentPassword.isTouched ? 
                  (passwordFormState.currentPassword.isValid ? '' : 'is-invalid') : ''
                  }`} id="currentPassword" name="currentPassword" defaultValue={''} onInput={e => newPasswordValidator(e)} />
                <p className="form-text">Please enter the current password for this account.</p>
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input type="text" className={`form-control ${
                  passwordFormState.newPassword.isTouched ? 
                  (passwordFormState.newPassword.isValid ? '' : 'is-invalid') : ''
                  }`} id="newPassword" name="newPassword" defaultValue={''} onInput={e => newPasswordValidator(e)} />
                <p className="form-text">Please enter the new password. It can be beween 5 and 50 characters long and may include letters, numbers and the following symbols: @-_+?!</p>
              </div>

              <div className={styles.buttonsDataEditor}>
                <button type="button" className="btn btn-danger" disabled={!passwordFormState.isFormValid || isPasswordChangeInProgress} onClick={changePassword}>Change Password</button>
                <button type="button" className="btn btn-outline-warning" onClick={clearPasswordForm}>Clear Changes</button>
              </div>
            </form>
          </>

      }
    </div>
  );
}