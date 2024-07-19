// Function to add products to the cart and store them in localStorage
function addToCart(productName, productPrice, productImage) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existingProduct = cart.find((item) => item.name === productName);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1, image: productImage });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

    Swal.fire({
      title: "Produk Berhasil Ditambahkan",
      text: `${productName} telah ditambahkan ke keranjang.`,
      icon:"success",
    });
}

// Function to update the cart count badge
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").innerText = totalItems;
}

// Function to display the cart items in the table
function displayCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartBody = document.getElementById("cart-body");
  cartBody.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    let itemTotalPrice = item.price * item.quantity;
    totalPrice += itemTotalPrice;
    cartBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${item.image}" alt="${item.name}" width="150"></td>
                <td data-label="Nama Produk">${item.name}</td>
                <td data-label="Harga">${formatRupiah(item.price)}</td>
                <td data-label="Jumlah"><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
                <td data-label="Total">${formatRupiah(itemTotalPrice)}</td>
                <td><button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button></td>
            </tr>
        `;
  });

  document.getElementById("total-price").innerText = `RP ${formatRupiah(totalPrice)}`;
}

// Function to update the quantity of a product
function updateQuantity(index, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].quantity = parseInt(newQuantity);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// Function to remove an item from the cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// Function to redirect to WhatsApp with cart details
function checkout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let message = "Halo, saya ingin membeli produk berikut:\n";
  let total = 0;
  cart.forEach((item) => {
    message += `${item.name} - RP ${formatRupiah(item.price)} x ${item.quantity}\n`;
    total += item.price * item.quantity;
  });
  message += `Total: RP ${formatRupiah(total)}`;
  let whatsappUrl = `https://wa.me/6281389884769?text=${encodeURIComponent(message)}`;
  window.location.href = whatsappUrl;
}

// Function to format numbers to Rupiah format
function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Update cart count on page load
window.onload = function () {
  updateCartCount();
  if (document.getElementById("cart-body")) {
    displayCart();
  }
};
