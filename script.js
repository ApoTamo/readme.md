document.addEventListener('DOMContentLoaded', () => {
    const weetjeElement = document.querySelector('.weetje');
    const reviewsElement = document.querySelector('.reviews');
    const reviewButton = document.getElementById('review-knop');
    const cartIcon = document.getElementById('cart-icon');
    const cartCountElement = document.getElementById('cart-count');
    const productList = document.getElementById('product-list');

    fetch('hond.json')
        .then(response => response.json())
        .then(data => {
            const randomWeetje = data.facts[Math.floor(Math.random() * data.facts.length)];
            weetjeElement.innerHTML = `<p>${randomWeetje.fact}</p>`;
        });

    let reviews = [];
    let currentIndex = parseInt(localStorage.getItem('reviewIndex'), 10) || 0;

    fetch('reviews.json')
        .then(response => response.json())
        .then(data => {
            reviews = data.reviews;
            displayReview();
        })
        .catch(() => {
            reviewsElement.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });

    reviewButton.addEventListener('click', displayReview);

    function displayReview() {
        if (!reviews.length) return;
        const currentReview = reviews[currentIndex];
        reviewsElement.innerHTML = `
            <div class="review">
                <h3>${currentReview.product}</h3>
                <p>${currentReview.review}</p>
                <p><strong>Rating:</strong> ${currentReview.rating}/5</p>
                <p><em>By ${currentReview.user}</em></p>
            </div>
        `;
        currentIndex = (currentIndex + 1) % reviews.length;
        localStorage.setItem('reviewIndex', currentIndex);
    }

    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = cartCount.toString();
        cartCountElement.style.display = cartCount > 0 ? 'inline-block' : 'none';
    }

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
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
                productDiv.querySelector('.add-to-cart').addEventListener('click', () => {
                    addToCart(product);
                    animateAddToCartButton(productDiv.querySelector('.add-to-cart'));
                    updateCartCount();
                });
            });
        });

    function addToCart(product) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cartItems.findIndex(item => item.description === product.description);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity++;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    function animateAddToCartButton(button) {
        button.classList.add('btn-clicked');
        setTimeout(() => button.classList.remove('btn-clicked'), 300);
    }

    updateCartCount();

    document.getElementById('explore').addEventListener('click', () => {
        window.location.href = 'product.html';
    });

    document.getElementById('product-link').addEventListener('click', event => {
        event.preventDefault();
        window.location.href = 'product.html';
    });

    const addLinkClickEvent = selector => {
        document.querySelector(selector).addEventListener('click', event => {
            event.preventDefault();
            window.location.href = 'index.html';
        });
    };

    addLinkClickEvent('.nav-link[href="index.html"]');
    addLinkClickEvent('.navbar-brand[href="index.html"]');

    document.querySelector('.contact a').addEventListener('click', () => {
        document.querySelector('footer.footer').scrollIntoView({ behavior: 'smooth' });
    });
});
