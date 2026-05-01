const copyToClipboard = (slug: string, baseUrl: string) => {

    navigator.clipboard.writeText(`${baseUrl}${slug}`).then(() => {
        alert('Copied to clipboard');
    });
};

export default copyToClipboard;