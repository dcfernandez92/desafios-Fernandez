const socket = io();
const productList = document.getElementById('product-list');

socket.on('products', updatedProducts => {
    updateProductList(updatedProducts);
});

function updateProductList(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (products && products.length > 0) {
        products.forEach(product => {
            const listItem = document.createElement('li');
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.setAttribute('data-id', product.id);
            deleteButton.textContent = 'Eliminar';
            listItem.innerHTML = `<p>${product.title}: $${product.price}</p>`;
            listItem.appendChild(deleteButton);
            productList.appendChild(listItem);
        });
    } else {
        const emptyMessage = document.createElement('h2');
        emptyMessage.textContent = 'Lista de productos vacía';
        productList.appendChild(emptyMessage);
    }
}

function addProduct(title, description, price, code, stock, category, status) {
    const product = {
        title,
        description,
        price,
        code,
        stock,
        category,
        status
    };
    socket.emit('product', product);
}


const addProductForm = document.querySelector('#add-product-form');


addProductForm.addEventListener('submit', e => {
    e.preventDefault();


    const title = addProductForm.elements.title.value;
    const description = addProductForm.elements.description.value;
    const price = addProductForm.elements.price.value;
    const code = addProductForm.elements.code.value;
    const stock = addProductForm.elements.stock.value;
    const category = addProductForm.elements.category.value;
    const status = addProductForm.elements.status.value;


    addProduct(title, description, price, code, stock, category, status);

    addProductForm.reset();
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);

    socket.on('products', updatedProducts => {
        updateProductList(updatedProducts);
    });
}

productList.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
        const productId = e.target.dataset.id;

        deleteProduct(productId);
    }
});