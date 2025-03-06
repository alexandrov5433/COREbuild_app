import { useNavigate } from 'react-router';
import addProduct from '../../../lib/actions/addProduct';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import styles from './addProduct.module.css';
import { useActionState, useEffect, useRef, useState } from 'react';


export default function AddProduct() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const thumbnailInputRef = useRef(null);
    const picturesInputRef = useRef(null);
    const specsDocInputRef = useRef(null);
    const [chosenPicturesList, setChosenPictures] = useState([] as Array<string>);
    const initialFormState = {
        isFormValid: false,
        name: {
            isValid: false,
            isTouched: false,
        },
        description: {
            isValid: false,
            isTouched: false,
        },
        category: {
            isValid: false,
            isTouched: false,
        },
        price: {
            isValid: false,
            isTouched: false,
        },
        stockCount: {
            isValid: false,
            isTouched: false,
        },
        manufacturer: {
            isValid: false,
            isTouched: false,
        },
        thumbnail: {
            isValid: false,
            isTouched: false,
        },
    };
    const [formState, setFormState] = useState(initialFormState);
    useEffect(() => {
        const formStateDependencies = [formState.name.isValid, formState.description.isValid, formState.category.isValid, formState.price.isValid, formState.stockCount.isValid, formState.manufacturer.isValid, formState.thumbnail.isValid];
        const _isFormValid = !formStateDependencies.includes(false);
        setFormState(state => {
            const newState = { ...state };
            newState.isFormValid = _isFormValid;
            return newState;
        });
    }, [formState.name.isValid, formState.description.isValid, formState.category.isValid, formState.price.isValid, formState.stockCount.isValid, formState.manufacturer.isValid, formState.thumbnail.isValid]);
    function nameValidator(e: React.ChangeEvent<HTMLInputElement>) {
        const isValid = /^[^%&\$\*_'"]{1,200}$/.test(e.target?.value || '');
        setFormState(state => {
            const newState = { ...state };
            newState.name.isValid = isValid;
            newState.name.isTouched = true;
            return newState;
        });
    }
    function descriptionValidator(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const isValid = /^[^%&\$\*_'"]{1,}$/.test(e.target?.value || '');
        setFormState(state => {
            const newState = { ...state };
            newState.description.isValid = isValid;
            newState.description.isTouched = true;
            return newState;
        });
    }
    function categoryValidator(e: React.ChangeEvent<HTMLInputElement>) {
        const isValid = /^[A-Za-z]{1,200}$/.test(e.target?.value || '');
        setFormState(state => {
            const newState = { ...state };
            newState.category.isValid = isValid;
            newState.category.isTouched = true;
            return newState;
        });
    }
    function priceValidator(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target?.value || '';
        let isValid = /^[0-9]+(?:\.[0-9]{2}){0,1}$/.test(val);
        if (val.endsWith('.') || val == '0') {
            isValid = false;
        }
        setFormState(state => {
            const newState = { ...state };
            newState.price.isValid = isValid;
            newState.price.isTouched = true;
            return newState;
        });
    }
    function stockCountValidator(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target?.value || '';
        let isValid = /^[0-9]+$/.test(val);
        if (/^0{2,}$/.test(val)) {
            isValid = false;
        }
        setFormState(state => {
            const newState = { ...state };
            newState.stockCount.isValid = isValid;
            newState.stockCount.isTouched = true;
            return newState;
        });
    }
    function manufacturerValidator(e: React.ChangeEvent<HTMLInputElement>) {
        const isValid = /^[^%&\$\*_'"]{1,200}$/.test(e.target?.value || '');
        setFormState(state => {
            const newState = { ...state };
            newState.manufacturer.isValid = isValid;
            newState.manufacturer.isTouched = true;
            return newState;
        });
    }

    const [addProductState, addProductAction, isProcessPending] = useActionState(addProduct, {
        success: false,
        msg: '',
        data: null,
        responseStatus: 0,
        inputValues: {
            name: '',
            description: '',
            category: '',
            price: '',
            stockCount: '',
            manufacturer: ''
        },
        isError: false
    });

    useEffect(() => {
        if (addProductState.responseStatus === 200 && addProductState.success) {
            // product added successfully
            dispatch(setMessageData({
                duration: 3000,
                isShown: true,
                type: 'success',
                text: addProductState.msg
            }));
            navigate('/');
        } else if (
            addProductState.isError
            || addProductState.responseStatus === 400
            || addProductState.responseStatus === 500
        ) {
            // isError === true -> client-side error in addProduct action from catch block
            // status 400 -> product was not added due to validation error
            // status 500 -> other erorr server-side
            dispatch(setMessageData({
                duration: 3000,
                isShown: true,
                type: 'error',
                text: addProductState.msg
            }));
            setFormState(initialFormState);
        }
    }, [addProductState]);

    function clearSelectedFiles(ref: React.RefObject<null | HTMLInputElement>) {
        if (ref.current?.value) {
            ref.current!.value = '';
        }
        if (ref.current?.id === 'pictures') {
            setChosenPictures([]);
        }
        if (ref.current?.id === 'thumbnail') {
            setFormState(state => {
                const newState = { ...state };
                newState.thumbnail.isValid = false;
                newState.thumbnail.isTouched = true;
                return newState;
            });
        }
    }

    function fileWarden(allowedFileTypes: Array<string>, inputRefToClear: React.RefObject<null | HTMLInputElement>, maxFileSizeInMB: number) {
        const currentTypes = Object.values(inputRefToClear.current?.files as FileList).map(f => [f.type, Number(f.size)]);
        if (inputRefToClear.current?.id === 'pictures' && currentTypes.length > 5) {
            clearSelectedFiles(inputRefToClear);
            dispatch(setMessageData({
                duration: 3000,
                isShown: true,
                text: 'You may select up to 5 extra pictures.',
                type: 'error'
            }))
            return;
        }
        for (let i = 0; i < currentTypes.length; i++) {
            const [type, size] = currentTypes[i];
            if (!allowedFileTypes.includes(type as string)) {
                clearSelectedFiles(inputRefToClear);
                dispatch(setMessageData({
                    duration: 3000,
                    isShown: true,
                    text: 'Unsupported file type.',
                    type: 'error'
                }));
                if (inputRefToClear.current?.id === 'thumbnail') {
                    setFormState(state => {
                        const newState = { ...state };
                        newState.thumbnail.isValid = false;
                        newState.thumbnail.isTouched = true;
                        return newState;
                    });
                }
                return;
            }
            if ((size as number) > maxFileSizeInMB * 1024 * 1024) {
                clearSelectedFiles(inputRefToClear);
                dispatch(setMessageData({
                    duration: 3000,
                    isShown: true,
                    text: 'Too large file size.',
                    type: 'error'
                }));
                if (inputRefToClear.current?.id === 'thumbnail') {
                    setFormState(state => {
                        const newState = { ...state };
                        newState.thumbnail.isValid = false;
                        newState.thumbnail.isTouched = true;
                        return newState;
                    });
                }
                return;
            }
        }
        if (inputRefToClear.current?.id === 'thumbnail') {
            setFormState(state => {
                const newState = { ...state };
                newState.thumbnail.isValid = true;
                newState.thumbnail.isTouched = true;
                return newState;
            });
        }
    }

    function chosenPicturesWatcher(e: React.ChangeEvent<HTMLInputElement>) {
        const pics = Object.values(e.target.files!).map(f => f.name);
        setChosenPictures(pics);
    }

    return (
        <div className={styles.wrapper}>
            <h1>Add A New Product</h1>
            <p className={`${styles.mandatoryFielsExplanation}`}>Please fill out all mandatory <i>*</i> fields.</p>
            <form action={addProductAction}>
                <div className={`${styles.inputContainer}`}>
                    <label htmlFor="name" className="form-label">Name <i>*</i></label>
                    <input type="text" className={`form-control ${formState.name.isTouched ? (
                        formState.name.isValid ? 'is-valid' : 'is-invalid'
                    ) : ''
                        }`} id="name" name="name" aria-describedby="nameHelp" onChange={nameValidator} defaultValue={addProductState.inputValues.name || ''}/>
                    <div id="nameHelp" className="form-text">Please enter the product name. The symbols % &amp; $ * _ ' " are not allowed. Maximum length: 200 characters.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="description" className="form-label">Description <i>*</i></label>
                    <textarea className={`form-control ${formState.description.isTouched ? (
                        formState.description.isValid ? 'is-valid' : 'is-invalid'
                    ) : ''
                        }`} id="description" name='description' aria-describedby="descriptionHelp" onChange={descriptionValidator} defaultValue={addProductState.inputValues.description || ''}></textarea>
                    <div id="descriptionHelp" className="form-text">Please enter the product description. The symbols % &amp; $ * _ ' " are not allowed.</div>
                </div>
                <div className={`${styles.inputContainer}`}>
                    <label htmlFor="category" className="form-label">Category <i>*</i></label>
                    <input type="text" className={`form-control ${formState.category.isTouched ? (
                        formState.category.isValid ? 'is-valid' : 'is-invalid'
                    ) : ''
                        }`} id="category" name="category" aria-describedby="categoryHelp" onChange={categoryValidator} defaultValue={addProductState.inputValues.category || ''}/>
                    <div id="categoryHelp" className="form-text">Please enter the category of the product. E.g.: cpu, ram, ssd. Only letters are allowed. Maximum length: 200 characters.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="description" className="form-label">Price <i>*</i></label>
                    <input type="text" className={`form-control ${formState.price.isTouched ? (
                        formState.price.isValid ? 'is-valid' : 'is-invalid'
                    ) : ''
                        }`} id="price" name="price" aria-describedby="priceHelp" onChange={priceValidator} defaultValue={addProductState.inputValues.price || ''}/>
                    <div id="priceHelp" className="form-text">Please enter the product price. Two digits after the dot are allowed. Please use a dot as a decimal separator.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="stockCount" className="form-label">Stock <i>*</i></label>
                    <input type="text" className={`form-control ${formState.stockCount.isTouched ? (
                        formState.stockCount.isValid ? 'is-valid' : 'is-invalid'
                    ) : ''
                        }`} id="stockCount" name="stockCount" aria-describedby="stockCountHelp" onChange={stockCountValidator} defaultValue={addProductState.inputValues.stockCount || ''}/>
                    <div id="stockCountHelp" className="form-text">Please enter quantity of this product available in stock as a whole number.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="manufacturer" className="form-label">Manufacturer <i>*</i></label>
                    <input type="text" className={`form-control ${formState.manufacturer.isTouched ? (
                        formState.manufacturer.isValid ? 'is-valid' : 'is-invalid'
                    ) : ''
                        }`} id="manufacturer" name="manufacturer" aria-describedby="manufacturerHelp" onChange={manufacturerValidator} defaultValue={addProductState.inputValues.manufacturer || ''}/>
                    <div id="manufacturerHelp" className="form-text">Please enter the name of the product's manufacturer. The symbols % &amp; $ * _ ' " are not allowed. Maximum length: 200 characters.</div>
                </div>



                <div className={styles.inputContainer}>
                    <label htmlFor="thumbnail" className="form-label">Thumbnail <i>*</i></label>
                    <div className="input-group mb-3">
                        <button onClick={clearSelectedFiles.bind(null, thumbnailInputRef)} className="btn btn-outline-danger" type="button">Remove</button>
                        <input ref={thumbnailInputRef} onChange={() => fileWarden(['image/png', 'image/jpeg'], thumbnailInputRef, 0.5)} type="file" accept='.png,.jpg,.jpeg' className={`form-control ${formState.thumbnail.isTouched ? (
                            formState.thumbnail.isValid ? 'is-valid' : 'is-invalid'
                        ) : ''
                            }`} id="thumbnail" name='thumbnail' aria-describedby="thumbnailHelp" aria-label="Upload thumbnail" />
                    </div>
                    <div id="thumbnailHelp" className="form-text">Please select a picture for the product's thumbnail. PNG, JPG and JPEG files are supported, with a 0.5MB size limit.</div>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="pictures" className="form-label">Additional Images</label>
                    <div className="input-group mb-3">
                        <button onClick={clearSelectedFiles.bind(null, picturesInputRef)} className="btn btn-outline-danger" type="button">Remove</button>
                        <input ref={picturesInputRef} onChange={e => {
                            fileWarden(['image/png', 'image/jpeg'], picturesInputRef, 0.5);
                            chosenPicturesWatcher(e);
                        }} type="file" accept='.png,.jpg,.jpeg' className="form-control" name='pictures' id="pictures" aria-describedby="picturesHelp" aria-label="Upload additional images" multiple />
                    </div>
                    <ul className={styles.chosenFilesList}>
                        {chosenPicturesList.map((name, index) => <li key={index}>{name}</li>)}
                    </ul>
                    <div id="picturesHelp" className="form-text">Optionally, you may add up to 5 pictures of the product. PNG, JPG and JPEG files are supported, with a 0.5MB size limit for each one.</div>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="specsDoc" className="form-label">Specification Sheet</label>
                    <div className="input-group mb-3">
                        <button onClick={clearSelectedFiles.bind(null, specsDocInputRef)} className="btn btn-outline-danger" type="button">Remove</button>
                        <input ref={specsDocInputRef} onChange={() => fileWarden(['application/pdf'], specsDocInputRef, 4)} type="file" accept='.pdf' className="form-control" id="specsDoc" name='specsDoc' aria-describedby="specsDocHelp" aria-label="Upload specification sheet" />
                    </div>
                    <div id="specsDocHelp" className="form-text">Optionally, you may add a product specification sheet. PDF files are supported, with a 4MB size limit.</div>
                </div>

                {
                    isProcessPending ?
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        : <button type="submit" className={`btn btn-success ${styles.submitButton}`} disabled={!formState.isFormValid}>Add Product</button>
                }

            </form>
        </div>
    );
}