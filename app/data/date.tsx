export const getDate = ()=>{
    const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };
    return String(now.toLocaleDateString('ja-JP', options));
}