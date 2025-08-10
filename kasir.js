document.addEventListener('DOMContentLoaded', () => {
  const productNameInput = document.getElementById('product-name');
  const productPriceInput = document.getElementById('product-price');
  const addProductBtn = document.getElementById('add-product-btn');
  const errorMsg = document.getElementById('error-msg');

  const cartItemsTbody = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('total-price');
  const checkoutBtn = document.getElementById('checkout-btn');
  const productList = document.getElementById('product-list');

  let cart = [];

  // Ambil daftar produk dari localStorage
  const products = JSON.parse(localStorage.getItem('products')) || [];

  // Tampilkan datalist autocomplete nama produk
  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.name;
    productList.appendChild(option);
  });

  function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  function updateAddBtnState() {
    const nameValid = productNameInput.value.trim().length > 0;
    addProductBtn.disabled = !nameValid;
  }

  function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceEl.textContent = formatRupiah(total);
  }

  function renderCart() {
    cartItemsTbody.innerHTML = '';

    if (cart.length === 0) {
      cartItemsTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">Keranjang kosong</td></tr>`;
      checkoutBtn.disabled = true;
      updateTotal();
      return;
    }

    cart.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${formatRupiah(item.price)}</td>
        <td><input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" /></td>
        <td>${formatRupiah(item.price * item.quantity)}</td>
        <td><button class="btn-delete" data-index="${index}" aria-label="Hapus produk ${item.name}">Hapus</button></td>
      `;
      cartItemsTbody.appendChild(tr);
    });

    checkoutBtn.disabled = false;
    updateTotal();
  }

  function resetForm() {
    productNameInput.value = '';
    productPriceInput.value = '';
    errorMsg.textContent = '';
    updateAddBtnState();
  }

  // Tambahkan produk ke keranjang
  addProductBtn.addEventListener('click', () => {
    const name = productNameInput.value.trim();
    const matchedProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase());

    if (!name) {
      errorMsg.textContent = 'Nama produk harus diisi.';
      return;
    }

    if (!matchedProduct) {
      errorMsg.textContent = 'Produk tidak ditemukan di daftar produk.';
      return;
    }

    const price = matchedProduct.price;

    const existingIndex = cart.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    renderCart();
    resetForm();
  });

  productNameInput.addEventListener('input', () => {
    errorMsg.textContent = '';
    updateAddBtnState();
  });

  // Event hapus produk
  cartItemsTbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
      const index = parseInt(e.target.dataset.index);
      if (!isNaN(index)) {
        cart.splice(index, 1);
        renderCart();
      }
    }
  });

  // Event ubah jumlah
  cartItemsTbody.addEventListener('input', (e) => {
    if (e.target.classList.contains('quantity-input')) {
      const index = parseInt(e.target.dataset.index);
      const val = parseInt(e.target.value);
      if (!isNaN(index) && val >= 1) {
        cart[index].quantity = val;
        renderCart();
      }
    }
  });

  // Checkout dan simpan transaksi
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const transaction = {
      date: new Date().toISOString(),
      items: cart.map(({ name, price, quantity }) => ({ name, price, quantity })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };

    const oldTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    oldTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(oldTransactions));

    alert('Transaksi berhasil disimpan!');
    cart = [];
    renderCart();
  });

  // Inisialisasi
  updateAddBtnState();
  renderCart();
});
