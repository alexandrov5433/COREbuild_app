function convertCentToWholeString(cent: number) {;
    let res: number | string = cent / 100;
    if (res.toString().includes('.') && res.toString().split('.')[1].length < 2) {
        res = res.toString() + '0';
    }
    return res.toString();
}

export {
    convertCentToWholeString
};