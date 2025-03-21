function capitalize(str: string) {
    return str.split(' ')
        .map(word => {
            const wordArr = word.split('');
            wordArr[0] = wordArr[0].toUpperCase();
            return wordArr.join('');
        })
        .join(' ');
}

export {
    capitalize
};