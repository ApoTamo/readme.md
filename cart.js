document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');
    const totalAmountElement = document.getElementById('total-amount');
    const placeOrderButton = document.getElementById('place-order-btn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const contactLink = document.querySelector('.contact a');

    clearCartBtn.addEventListener('click', clearCart);
    contactLink.addEventListener('click', event => {
        event.preventDefault();
        document.querySelector('footer.footer').scrollIntoView({ behavior: 'smooth' });
    });

    placeOrderButton.addEventListener('click', placeOrder);

    cartList.addEventListener('change', event => {
        if (event.target.matches('.quantity-input')) {
            updateQuantity(event.target.dataset.id, parseInt(event.target.value));
        }
    });

    cartList.addEventListener('click', event => {
        if (event.target.matches('.remove-from-cart')) {
            removeFromCart(event.target.dataset.id);
        }
    });

    function renderCartItems() {
        cartList.innerHTML = cartItems.length ? cartItems.map(createCartItemDiv).join('') : '<p class="text-center">No items selected.</p>';
        totalAmountElement.textContent = cartItems.length ? calculateTotal() : '€0.00';
    }

    function createCartItemDiv(item) {
        return `
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image}" class="img-fluid rounded-start" alt="${item.description}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.description}</h5>
                            <p class="card-text">Price: ${item.price}</p>
                            <div class="input-group mb-3">
                                <span class="input-group-text">Quantity:</span>
                                <input type="number" class="form-control quantity-input text-center" value="${item.quantity}" min="1" data-id="${item.id}">
                            </div>
                            <button class="btn btn-danger remove-from-cart" data-id="${item.id}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function updateQuantity(itemId, newQuantity) {
        const item = cartItems.find(item => item.id == itemId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCartItems();
        }
    }

    function removeFromCart(itemId) {
        const updatedCartItems = cartItems.filter(item => item.id != itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        renderCartItems();
    }

    function calculateTotal() {
        const total = cartItems.reduce((acc, item) => acc + parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity, 0);
        return `€${total.toFixed(2)}`;
    }

    function placeOrder() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({ id: Date.now(), items: cartItems, totalAmount: calculateTotal() });
        localStorage.setItem('orders', JSON.stringify(orders));
        alert('Order successful!');
        clearCart();
    }

    function clearCart() {
        localStorage.removeItem('cart');
        cartItems.length = 0;
        renderCartItems();
    }

    renderCartItems();
});
