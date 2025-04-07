function convertTimeToDate(time: number) {
    const formater = new Intl.DateTimeFormat('en-GB', {
        minute: '2-digit',
        hour: '2-digit',
        hourCycle: 'h24',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    return formater.format(new Date(Number(time) || 0));
}

export {
    convertTimeToDate
};