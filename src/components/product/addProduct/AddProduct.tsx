import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { setMessageData } from '../../../redux/popupMessageSlice';
import styles from './addProduct.module.css';
import { SyntheticEvent, useRef, useState } from 'react';


export default function AddProduct() {
    // productID: number,
    // name: string,
    // description: string,
    // price: number,
    // stockCount: number,
    // manufacturer: string,
    // specsDoc: number,
    // thumbnailID: number,
    // pictures: Array<number>,
    // reviews: Array<number>
    const dispatch = useAppDispatch();
    const thumbnailInputRef = useRef(null);
    const picturesInputRef = useRef(null);
    const specsDocInputRef = useRef(null);
    const [chosenPicturesList, setChosenPictures] = useState([] as Array<string>);

    function clearSelectedFiles(ref: React.RefObject<null | HTMLInputElement>) {
        if (ref.current?.value) {
            ref.current!.value = '';
        }
        if (ref.current?.id === 'pictures') {
            setChosenPictures([]);
        }
    }

    function fileExtentionWarden(e: React.ChangeEvent, allowedFileTypes: Array<string>, inputRefToClear: React.RefObject<null | HTMLInputElement>) {
        const currentTypes = Object.values(inputRefToClear.current?.files as FileList).map(f => f.type);
        for (let i = 0; i < currentTypes.length; i++) {
            const type = currentTypes[i];
            if (!allowedFileTypes.includes(type)) {
                clearSelectedFiles(inputRefToClear);
                return;
            }
        }
    }

    function chosenPicturesWatcher(e: React.ChangeEvent<HTMLInputElement>) {
        const pics = Object.values(e.target.files!).map(f => f.name);
        setChosenPictures(pics);
    }

    function testPopup() {
        dispatch(setMessageData({
            duration: 3000,
            isShown: true,
            text: 'Testing the popup.',
            type: 'success'
        }))
    }

    return (
        <div className={styles.wrapper}>
            <h1>Add A New Product</h1>
            <form>
                <div className={`${styles.inputContainer}`}>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className={`form-control`} id="name" name="name" aria-describedby="nameHelp" />
                    <div id="nameHelp" className="form-text">Please enter the product name.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name='description' aria-describedby="descriptionHelp"></textarea>
                    <div id="descriptionHelp" className="form-text">Please enter the product description.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="description" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" name="price" aria-describedby="priceHelp" />
                    <div id="priceHelp" className="form-text">Please enter the product price. Two digits after the dot are allowed.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="stockCount" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stockCount" name="stockCount" aria-describedby="stockCountHelp" />
                    <div id="stockCountHelp" className="form-text">Please enter quantity of this product available in stock.</div>
                </div>
                <div className={styles.inputContainer}>
                    <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
                    <input type="text" className="form-control" id="manufacturer" name="manufacturer" aria-describedby="manufacturerHelp" />
                    <div id="manufacturerHelp" className="form-text">Please enter the name of the product's manufacturer.</div>
                </div>



                <div className={styles.inputContainer}>
                    <label htmlFor="thumbnail" className="form-label">Thumbnail</label>
                    <div className="input-group mb-3">
                        <button onClick={clearSelectedFiles.bind(null, thumbnailInputRef)} className="btn btn-outline-danger" type="button">Remove</button>
                        <input ref={thumbnailInputRef} onChange={e => fileExtentionWarden(e, ['image/png', 'image/jpeg'], thumbnailInputRef)} type="file" accept='.png,.jpg,.jpeg' className="form-control" id="thumbnail" name='thumbnail' aria-describedby="thumbnailHelp" aria-label="Upload thumbnail" />
                    </div>
                    <div id="thumbnailHelp" className="form-text">Please select a picture for the product's thumbnail. PNG, JPG and JPEG files are supported, with a 0.5MB size limit.</div>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="pictures" className="form-label">Additional Images</label>
                    <div className="input-group mb-3">
                        <button onClick={clearSelectedFiles.bind(null, picturesInputRef)} className="btn btn-outline-danger" type="button">Remove</button>
                        <input ref={picturesInputRef} onChange={e => {
                            fileExtentionWarden(e, ['image/png', 'image/jpeg'], picturesInputRef);
                            chosenPicturesWatcher(e);
                        }} type="file" accept='.png,.jpg,.jpeg' className="form-control" name='pictures' id="pictures" aria-describedby="picturesHelp" aria-label="Upload additional images" multiple />
                    </div>
                    <ul className={styles.chosenFilesList}>
                        {chosenPicturesList.map((name, index) =>  <li key={index}>{name}</li>)}
                    </ul>
                    <div id="picturesHelp" className="form-text">Optionally, you may add other pictures of the product. PNG, JPG and JPEG files are supported, with a 0.5MB size limit for each one.</div>
                </div>

                <div className={styles.inputContainer}>
                    <label htmlFor="specsDoc" className="form-label">Specification Sheet</label>
                    <div className="input-group mb-3">
                        <button onClick={clearSelectedFiles.bind(null, specsDocInputRef)} className="btn btn-outline-danger" type="button">Remove</button>
                        <input ref={specsDocInputRef} onChange={e => fileExtentionWarden(e, ['application/pdf'], specsDocInputRef)} type="file" accept='.pdf' className="form-control" id="specsDoc" name='specsDoc' aria-describedby="specsDocHelp" aria-label="Upload specification sheet" />
                    </div>
                    <div id="specsDocHelp" className="form-text">Optionally, you may add a product specification sheet. PDF files are supported, with a 4MB size limit.</div>
                </div>


                {/* <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div> */}
                <button type="button" onClick={testPopup} className={`btn btn-success ${styles.submitButton}`}>Add Product</button>

            </form>
        </div>
    );
}