const cartKey = 'shoppingCart'; // Key for local storage

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productElement = button.closest('.product');
        const productId = productElement.dataset.id;
        const productName = productElement.querySelector('h3').innerText;
        const productPrice = parseInt(productElement.querySelector('p').innerText.replace('Rs ', ''));
        const productImage = productElement.querySelector('img').src;  // Get image source

        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ 
                id: productId, 
                name: productName, 
                price: productPrice, 
                quantity: 1, 
                image: productImage 
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert(`${productName} has been added to your cart!`);
    });
});

// Load Cart Items on Cart Page
function loadCart() {
    const cartContainer = document.querySelector('.cart-container');
    const totalPriceElement = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    cartContainer.innerHTML = ''; // Clear container
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        totalPriceElement.innerText = 'Rs 0';
        return;
    }

    let totalPrice = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Price: Rs ${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Subtotal: Rs ${itemTotal}</p>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalPriceElement.innerText = `Rs ${totalPrice}`;

    // Add remove functionality
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const productId = button.dataset.id;
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem(cartKey, JSON.stringify(cart));
            loadCart(); // Reload cart after removal
        });
    });
}

// Automatically load the cart if on cart page
if (document.body.contains(document.querySelector('.cart-container'))) {
    loadCart();
}
