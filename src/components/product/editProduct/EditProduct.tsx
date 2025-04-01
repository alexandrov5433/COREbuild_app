import { useNavigate, useParams } from 'react-router';
import styles from './editProduct.module.css';
import { useAppDispatch } from '../../../lib/hooks/reduxTypedHooks';
import { useEffect, useRef, useState } from 'react';
import { ProductData } from '../../../lib/definitions';
import productDetails from '../../../lib/actions/product/productDetails';
import { setMessageData } from '../../../redux/popupMessageSlice';
import { convertCentToWholeString } from '../../../lib/util/currency';
import editProductInfos from '../../../lib/actions/product/editProductInfos';
import updateProductThumbnail from '../../../lib/actions/product/updateProductThumbnail';
import addProductPictures from '../../../lib/actions/product/addProductPictures';
import deleteProductPicture from '../../../lib/actions/product/deleteProductPicture';
import deleteProductSpecsDoc from '../../../lib/actions/product/deleteProductSpecsDoc';
import updateProductSpecsDoc from '../../../lib/actions/product/updateProductSpecsDoc';
import ProductNotFound from '../productNotFound/ProductNotFound';

export default function EditProduct() {
  const { productID } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({} as ProductData);
  const [isProductDataLoading, setProductDataLoading] = useState(false);
  const [isSavingInfoChangesLoading, setSavingInfoChangesLoading] = useState(false);

  const infoFormRef = useRef(null);
  const dataEditorDiv = useRef(null);

  const initialInfoFormState = {
    isFormValid: true,
    name: {
      isValid: true,
      isTouched: false,
    },
    description: {
      isValid: true,
      isTouched: false,
    },
    category: {
      isValid: true,
      isTouched: false,
    },
    price: {
      isValid: true,
      isTouched: false,
    },
    stockCount: {
      isValid: true,
      isTouched: false,
    },
    manufacturer: {
      isValid: true,
      isTouched: false,
    }
  };
  const [infoFormState, setInfoFormState] = useState(initialInfoFormState)

  const [isBlockFileUploadButtons, setBlockFileUploadButtons] = useState(false);
  const [isBlockDeleteButtons, setBlockDeleteButtons] = useState(false);
  const thumbnailInputRef = useRef(null);
  const picturesFormRef = useRef(null);
  const specsDocInputRef = useRef(null);

  async function __loadProductData() {
    if (!productID) {
      dispatch(setMessageData({
        duration: 4500,
        isShown: true,
        text: 'The products ID is required in order to find it.',
        type: 'error'
      }));
      return;
    }
    setProductDataLoading(true);
    const actionResult = await productDetails(productID);
    if (actionResult.responseStatus === 200) {
      setProductData(actionResult.data!);
    } else if ([400, 500].includes(actionResult.responseStatus)) {
      // error
      dispatch(setMessageData({
        duration: 4500,
        isShown: true,
        text: actionResult.msg,
        type: 'error'
      }));
    }
    setProductDataLoading(false);
  };

  useEffect(() => {
    __loadProductData()
  }, [productID]);

  useEffect(() => {
    const dependencies = [
      infoFormState.name.isValid,
      infoFormState.description.isValid,
      infoFormState.category.isValid,
      infoFormState.price.isValid,
      infoFormState.stockCount.isValid,
      infoFormState.manufacturer.isValid,
    ];
    setInfoFormState(state => {
      const newState = { ...state };
      newState.isFormValid = !dependencies.includes(false);
      return newState;
    });
  }, [
    infoFormState.name.isValid,
    infoFormState.description.isValid,
    infoFormState.category.isValid,
    infoFormState.price.isValid,
    infoFormState.stockCount.isValid,
    infoFormState.manufacturer.isValid,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);;

  function removeChangesFromInfoForm() {
    (infoFormRef.current! as HTMLFormElement).reset();
    (dataEditorDiv.current! as HTMLDivElement).scrollIntoView({
      behavior: 'smooth'
    });
    setInfoFormState(initialInfoFormState);
  }

  function infoValueValidator(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const val = (e.target as HTMLInputElement | HTMLTextAreaElement).value?.trim();
    const nameAttribute = (e.target as HTMLInputElement | HTMLTextAreaElement).name;
    const regex = {
      'name': new RegExp(/^[^%&\$\*_'"]{1,200}$/),
      'description': new RegExp(/.+/),
      'category': new RegExp(/^[A-Za-z ]{1,200}$/),
      'price': new RegExp(/^[0-9]+(?:\.[0-9]{2}){0,1}$/),
      'stockCount': new RegExp(/^[0-9]+$/),
      'manufacturer': new RegExp(/^[^%&\$\*_'"]{1,200}$/),
    }[nameAttribute];
    let isValid = regex?.test(val);
    if (nameAttribute == 'stockCount') {
      if (/^0{2,}$/.test(val)) {
        isValid = false;
      }
    }
    if (nameAttribute == 'price') {
      if (/^0{1,}$/.test(val)) {
        isValid = false;
      }
    }
    setInfoFormState(state => {
      const newState = { ...state };
      (newState as any)[nameAttribute].isValid = isValid;
      return newState;
    });
  }

  async function saveInfoChanges() {
    if (!productID) {
      return;
    }
    setSavingInfoChangesLoading(true);
    const formData = new FormData(infoFormRef.current! as HTMLFormElement);
    const actionResponse = await editProductInfos(productID, formData);
    if (actionResponse.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Product information updated!',
        type: 'success'
      }));
      await __loadProductData()
    } else if ([400, 500].includes(actionResponse.responseStatus)) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: actionResponse.msg,
        type: 'error'
      }));
      removeChangesFromInfoForm();
    }
    setSavingInfoChangesLoading(false);
  }

  function validateFile(e: React.ChangeEvent<HTMLInputElement>, allowedFileType: string[], maxFileSizeInMB: number) {
    //['image/png', 'image/jpeg']
    //['application/pdf']
    for (let i = 0; i < e.target?.files!.length; i++) {
      const { name, type, size } = e.target?.files![0];
      if (size > maxFileSizeInMB * 1024 * 1024) {
        e.target.value = '';
        dispatch(setMessageData({
          duration: 4000,
          isShown: true,
          text: `File size is too large: ${name}`,
          type: 'error'
        }));
        return;
      }
      if (!allowedFileType.includes(type)) {
        e.target.value = '';
        dispatch(setMessageData({
          duration: 4000,
          isShown: true,
          text: `File file type is not allowed: ${name}`,
          type: 'error'
        }));
        return;
      }

    }
  }

  async function uploadNewThumbnail() {
    const file = (thumbnailInputRef.current! as HTMLInputElement).files![0] || null;
    if (!productID || !file) {
      return;
    }
    setBlockFileUploadButtons(true);
    const updateResult = await updateProductThumbnail(productID, file);
    if (updateResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Thumbnail saved!',
        type: 'success'
      }));
      await __loadProductData();
    } else if ([400, 500].includes(updateResult.responseStatus)) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: updateResult.msg,
        type: 'error'
      }));
    }
    setBlockFileUploadButtons(false);
  }
  async function uploadNewPicture() {
    const formData = new FormData(picturesFormRef.current!);
    if (!productID || !formData) {
      return;
    }
    const file = formData.get('pictures');
    if (!(file as any).name) {
      return;
    }

    setBlockFileUploadButtons(true);
    const pictureUploadResult = await addProductPictures(productID, formData)
    if (pictureUploadResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Pictures saved!',
        type: 'success'
      }));
      await __loadProductData();
    } else if ([400, 500].includes(pictureUploadResult.responseStatus)) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: pictureUploadResult.msg,
        type: 'error'
      }));
    }
    setBlockFileUploadButtons(false);
  }
  async function uploadNewSpecsDoc() {
    const file = (specsDocInputRef.current! as HTMLInputElement).files![0] || null;
    if (!productID || !file) {
      return;
    }
    setBlockDeleteButtons(true);
    const deleteResult = await updateProductSpecsDoc(productID, file);
    if (deleteResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Document updated!',
        type: 'success'
      }));
      await __loadProductData();
    } else if ([400, 500].includes(deleteResult.responseStatus)) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: deleteResult.msg,
        type: 'error'
      }));
    }
    setBlockDeleteButtons(false);
  }
  async function deleteSpecsDoc(specsDocToDeleteID: string | number | null) {
    if (!productID || !specsDocToDeleteID) {
      return;
    }
    setBlockDeleteButtons(true);
    const deleteResult = await deleteProductSpecsDoc(productID, specsDocToDeleteID);
    if (deleteResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Document deleted!',
        type: 'success'
      }));
      await __loadProductData();
    } else if ([400, 500].includes(deleteResult.responseStatus)) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: deleteResult.msg,
        type: 'error'
      }));
    }
    setBlockDeleteButtons(false);
  }
  async function deletePictureOfProduct(pictureToDeleteID: string | number) {
    if (!pictureToDeleteID || !productID) {
      return;
    }
    setBlockDeleteButtons(true);
    const deleteResult = await deleteProductPicture(productID, pictureToDeleteID);
    if (deleteResult.responseStatus === 200) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: 'Picture deleted!',
        type: 'success'
      }));
      await __loadProductData();
    } else if ([400, 500].includes(deleteResult.responseStatus)) {
      dispatch(setMessageData({
        duration: 4000,
        isShown: true,
        text: deleteResult.msg,
        type: 'error'
      }));
    }
    setBlockDeleteButtons(false);
  }

  return (
    <div className={styles.wrapper}>
      <h1>Edit Product</h1>
      {
        isProductDataLoading ?
          <div className={`${styles.loaderContainer}`}>
            <div className={`spinner-border text-success`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          :
          (productData && productData.productID) ?
          <div className={styles.editingContainer}>
            <div >
              <h2>ID: {productData.productID}</h2>
            </div>

            <div className={styles.fileEditor}>
              <h4>Edit the files</h4>

              <section className={styles.thumbnailSection}>
                <div>
                  <p>Current Thumbnail</p>
                  <img src={`/api/file/pic/${productData.thumbnailID}`} className="img-thumbnail" alt={`Thumbnail image of the product ${productData.name}.`}></img>
                </div>
                <div className={styles.uploadControls}>
                  <div className="input-group">
                    <input type="file" className="form-control" onChange={e => validateFile(e, ['image/png', 'image/jpeg'], 0.5)} ref={thumbnailInputRef} accept='.png,.jpg,.jpeg'/>
                  </div>
                  <button className="btn btn-success" type="button" disabled={isBlockFileUploadButtons} onClick={uploadNewThumbnail}>Upload</button>
                </div>
                <p className="form-text">PNG, JPG and JPEG files are supported, with a 0.5MB size limit.</p>
              </section>

              <section className={styles.picturesSection}>
                <p>Pictures</p>
                <div className={styles.allPicturesContainer}>
                  {
                    productData.pictures?.length ?
                      <>
                        {productData.pictures.map(id =>
                          <div className={styles.pictureContainer} key={id}>
                            <img src={`/api/file/pic/${id}`} className="img-thumbnail" alt={`Image of the product ${productData.name}.`}></img>
                            <button className="btn btn-danger" type="button" onClick={() => deletePictureOfProduct(id)} disabled={isBlockDeleteButtons}>Delete</button>
                          </div>
                        )}
                      </>
                      : <p>No images available.</p>
                  }
                </div>
                {
                  productData?.pictures?.length >= 5 ?
                    <p className="mt-3">The maximum amount of pictures is reacted. To upload more, please delete some first.</p>
                    :
                    <div className={styles.uploadControls}>
                      <form className="input-group" ref={picturesFormRef}>
                        <input type="file" className="form-control" multiple onChange={e => validateFile(e, ['image/png', 'image/jpeg'], 0.5)} name='pictures' accept='.png,.jpg,.jpeg' />
                      </form>
                      <button className="btn btn-success" type="button" disabled={isBlockFileUploadButtons} onClick={uploadNewPicture}>Upload</button>
                    </div>
                }
                <p className="form-text">Optionally, there may be up to 5 pictures of the product. PNG, JPG and JPEG files are supported, with a 0.5MB size limit for each one.</p>
              </section>

              <section className={styles.specsDocSection}>
                <p>Specifications document</p>
                <div className={styles.specsDocDownloadAndDelete}>
                  {
                    productData.specsDocID ?
                      <>
                        <a href={`/api/file/doc/${productData.specsDocID}`} download={productData.name.replaceAll('.', '_') || 'Product Specifications'}>{productData.name}</a>
                        <button className="btn btn-danger" type="button" disabled={isBlockDeleteButtons} onClick={() => deleteSpecsDoc(productData.specsDocID)}>Delete Document</button>
                      </>
                      :
                      <p>No document available.</p>
                  }
                </div>
                <div className={styles.uploadControls}>
                  <div className="input-group">
                    <input type="file" className="form-control" onChange={e => validateFile(e, ['application/pdf'], 4)} ref={specsDocInputRef} accept='.pdf'/>
                  </div>
                  <button className="btn btn-success" type="button" disabled={isBlockFileUploadButtons} onClick={uploadNewSpecsDoc}>Upload</button>
                </div>
                <p className="form-text">The product specification sheet is optional. PDF files are supported, with a 4MB size limit.</p>
              </section>

            </div>

            <div ref={dataEditorDiv} className={styles.dataEditor}>
              <h4>Edit the information</h4>
              <form ref={infoFormRef}>

                <div className="mb-4">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" className={`form-control ${infoFormState.name.isValid ? '' : 'is-invalid'}`} id="name" name="name" defaultValue={productData.name} onInput={e => infoValueValidator(e)} />
                  <p className="form-text">For the product name the symbols % &amp; $ * _ ' " are not allowed. Maximum length: 200 characters.</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea className={`form-control ${infoFormState.description.isValid ? '' : 'is-invalid'}`} id="description" name="description" defaultValue={productData.description} onInput={e => infoValueValidator(e)}></textarea>
                  <p className="form-text">Please enter the product description.</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input type="text" className={`form-control ${infoFormState.category.isValid ? '' : 'is-invalid'}`} id="category" name="category" defaultValue={productData.category} onInput={e => infoValueValidator(e)} />
                  <p className="form-text">This field is case-INsensitive. The words cpu, Cpu and CPU are the same. Only letters and space are allowed. Maximum length: 200 characters.</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input type="text" className={`form-control ${infoFormState.price.isValid ? '' : 'is-invalid'}`} id="price" name="price" defaultValue={convertCentToWholeString(productData.price || 0)} onInput={e => infoValueValidator(e)} />
                  <p className="form-text">Two digits after the dot are allowed. Please use a dot as a decimal separator.</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="stockCount" className="form-label">Stock Count</label>
                  <input type="number" min={0} className={`form-control ${infoFormState.stockCount.isValid ? '' : 'is-invalid'}`} id="stockCount" name="stockCount" defaultValue={productData.stockCount} onInput={e => infoValueValidator(e)} />
                  <p className="form-text">Please enter quantity of this product available in stock as a whole number.</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
                  <input type="text" className={`form-control ${infoFormState.manufacturer.isValid ? '' : 'is-invalid'}`} id="manufacturer" name="manufacturer" defaultValue={productData.manufacturer} onInput={e => infoValueValidator(e)} />
                  <p className="form-text">The field for the manufacturers name is case-sensitive! It will appear as you write it.</p>
                </div>

                <div className={styles.buttonsDataEditor}>
                  <button type="button" className="btn btn-success" disabled={!infoFormState.isFormValid || isSavingInfoChangesLoading} onClick={saveInfoChanges}>Save Infos</button>
                  <button type="button" className="btn btn-outline-warning" onClick={removeChangesFromInfoForm}>Remove Changes</button>
                  <button type="button" className="btn btn-outline-primary" onClick={() => navigate(`/product-details/${productID}`)}>View Product Details Page</button>
                </div>

              </form>
            </div>

          </div>
          :
          <ProductNotFound idOfNotFoundProduct={productID}></ProductNotFound>
      }
    </div>
  );
}