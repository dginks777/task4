const apiUrl = "http://54.39.188.42/";

const init = async () => {
    const {response, error} = await getBase64Data(apiUrl);

    if (error) {
        console.error(error);
        return;
    }

    if (response && response.length) {
        renderCards(response);
    }
};


const getBase64Data = url => (
    fetch(url)
        .then(response => response.text())
        .then(base64 => atob(base64))
        .then(json => JSON.parse(json))
        .then(response => ({response}))
        .catch(error => ({error}))
);

document.addEventListener('DOMContentLoaded', init);







