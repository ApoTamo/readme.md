document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    const cartIcon = document.getElementById('cart-icon');

    async function fetchProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    function renderProducts(products) {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'col-md-4 mb-4';
            productDiv.innerHTML = `
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.description}">
                    <div class="card-body">
                        <h5 class="card-title">${product.description}</h5>
                        <p class="card-text">${product.price}</p>
                        <button class="btn btn-dark add-to-cart" data-id="${product.id}">Add to cart</button>
                    </div>
                </div>
            `;
            productList.appendChild(productDiv);

            const addToCartButton = productDiv.querySelector('.add-to-cart');
            addToCartButton.addEventListener('click', function() {
                addToCart(product);
                animateAddToCartButton(addToCartButton);
                updateCartCount();
            });
        });
    }

    function addToCart(product) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cartItems.findIndex(item => item.description === product.description);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity++;
        } else {
            cartItems.push({
                id: cartItems.length + 1,
                description: product.description,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));

        const addToCartButton = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
        animateAddToCartButton(addToCartButton);
    }

    function animateAddToCartButton(button) {
        button.classList.add('btn-clicked');

        setTimeout(() => {
            button.classList.remove('btn-clicked');
        }, 300);
    }

    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

        const cartCountElement = document.getElementById('cart-count');

        cartCountElement.textContent = cartCount.toString();

        if (cartCount > 0) {
            cartIcon.style.display = 'inline-block';
        } else {
            cartIcon.style.display = 'none';
        }
    }

    fetchProducts().then(products => {
        renderProducts(products);
    });

    updateCartCount();
});


document.addEventListener('DOMContentLoaded', function() {
    const contactLink = document.querySelector('.contact a');

    contactLink.addEventListener('click', function(event) {

        const footer = document.querySelector('footer.footer');

        footer.scrollIntoView({ behavior: 'smooth' });
    });
});