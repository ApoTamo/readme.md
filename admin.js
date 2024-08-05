document.addEventListener('DOMContentLoaded', function () {
    const ordersButton = document.getElementById('btn-orders');
    const productsButton = document.getElementById('btn-products');
    const ordersContainer = document.createElement('div');
    ordersContainer.className = 'container mt-3';
    document.body.appendChild(ordersContainer);

    const resetOrdersButton = document.createElement('button');
    resetOrdersButton.id = 'btn-reset-orders';
    resetOrdersButton.className = 'bg-white border rounded-2 mb-3';
    resetOrdersButton.textContent = 'Reset Orders';
    resetOrdersButton.style.display = 'none';

    resetOrdersButton.addEventListener('click', function () {
        resetOrders();
    });

    ordersButton.addEventListener('click', function () {
        displayOrders();
    });

    function displayOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        ordersContainer.innerHTML = '';

        if (orders.length > 0) {
            ordersContainer.appendChild(resetOrdersButton);
            resetOrdersButton.style.display = 'inline-block';

            orders.forEach(order => {
                const orderDiv = createOrderDiv(order);
                ordersContainer.appendChild(orderDiv);
            });
        } else {
            ordersContainer.innerHTML = '<p class="text-center">No orders available.</p>';
            resetOrdersButton.style.display = 'none';
        }
    }

    function createOrderDiv(order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'card mb-3';
        orderDiv.innerHTML = `
            <div class="card-header">
                <h5 class="card-title">Order ID: ${order.id}</h5>
            </div>
            <div class="card-body">
                ${order.items.map(item => `
                    <div class="row g-0 mb-2">
                        <div class="col-md-4">
                            <img src="${item.image}" class="img-fluid rounded-start" alt="${item.description}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${item.description}</h5>
                                <p class="card-text">Price: ${item.price}</p>
                                <p class="card-text">Quantity: ${item.quantity}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
                <div class="card-footer">
                    <h5>Total Amount: ${order.totalAmount}</h5>
                </div>
            </div>
        `;
        return orderDiv;
    }

    function resetOrders() {
        if (confirm('Are you sure you want to reset all orders? This action cannot be undone.')) {
            localStorage.removeItem('orders');
            alert('All orders have been reset.');
            displayOrders();
        }
    }
});
