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








const getPrice = (price, currency) => `${parseInt(price)}.00 ${currency}`;
const parseKey = key => key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");

const renderCards = props => {
    const cards = document.querySelector("#cards");

    for (let entry of props) {
        const card = createCard(entry);
        cards.appendChild(card);
    }
};

const createCard = cardObj => {
    const {
        id,
        sku,
        image,
        title,
        price,
        options,
        currency
    } = cardObj;

    try {
        let idText = `#${id}`;
        let priceText = getPrice(price, currency);
        let optionsTitleTest = 'product options';

        const columnElement = getDivElement('four wide column');
        const cardElement = getDivElement('ui segment product-card');
        const idElement = getDivElement("product-id", idText);
        const titleElement = getDivElement("product-title", title);
        const skuElement = getDivElement("product-sku", sku);
        const imageElement = getImageElement("product-image", image);
        const optionsTitleElement = getDivElement("product-options_title", optionsTitleTest);
        const optionsElement = getListElement("product-options", options);
        const priceElement = getDivElement("product-price", priceText);

        cardElement.appendChild(idElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(skuElement);
        cardElement.appendChild(imageElement);
        cardElement.appendChild(optionsTitleElement);
        cardElement.appendChild(optionsElement);
        cardElement.appendChild(priceElement);
        columnElement.appendChild(cardElement);

        return columnElement;
    } catch (error) {
        console.error(error)
    }
};

const getDivElement = (className, value = null) => {
    const div = document.createElement("div");
    div.className = className;

    if (value) {
        const node = document.createTextNode(value);
        div.appendChild(node);
    }

    return div;
};

const getImageElement = (className, imgSrc) => {
    const div = document.createElement("div");
    const image = document.createElement("IMG");
    div.className = `${className}_container image`;

    image.setAttribute("src", imgSrc);
    image.className = `${className}_image`;

    div.appendChild(image);

    return div;
};

const getListElement = (className, array) => {
    const [obj] = array;

    const ul = document.createElement("ul");
    ul.className = `${className}_list`;

    for (let [key, value] of Object.entries(obj)) {
        let parsedKey = parseKey(key);
        let li = document.createElement("li");
        let node = document.createTextNode(`${parsedKey}: ${value}`);

        li.className = `${className}_item`;
        li.appendChild(node);
        ul.appendChild(li);
    }

    return ul;
};
