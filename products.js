document.addEventListener('DOMContentLoaded', () => {
  const inputs = {
    name: document.getElementById('prod-name'),
    price: document.getElementById('prod-price'),
    stock: document.getElementById('prod-stock'),
    alertThreshold: document.getElementById('prod-alert')
  };
  const addButton = document.getElementById('add-prod-btn');
  const prodList = document.getElementById('prod-list');

  let products = JSON.parse(localStorage.getItem('products')) || [];

  function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    renderList();
  }

  function clearForm() {
    inputs.name.value = '';
    inputs.price.value = '';
    inputs.stock.value = '';
    inputs.alertThreshold.value = '';
  }

  function renderList() {
    prodList.innerHTML = '';
    products.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${formatRupiah(p.price)}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn-edit" data-index="${idx}">Edit</button>
          <button class="btn-delete" data-index="${idx}">Hapus</button>
        </td>
      `;
      prodList.appendChild(tr);
    });
  }

  function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  addButton.addEventListener('click', () => {
    const p = {
      name: inputs.name.value.trim(),
      price: parseFloat(inputs.price.value),
      stock: parseInt(inputs.stock.value),
      alertThreshold: parseInt(inputs.alertThreshold.value)
    };
    if (!p.name || p.price <= 0 || isNaN(p.stock)) {
      alert('Data produk tidak valid.');
      return;
    }
    products.push(p);
    saveProducts();
    clearForm();
  });

  prodList.addEventListener('click', e => {
    const idx = parseInt(e.target.dataset.index);
    if (e.target.classList.contains('btn-delete')) {
      products.splice(idx, 1);
      saveProducts();
    } else if (e.target.classList.contains('btn-edit')) {
      const p = products[idx];
      inputs.name.value = p.name;
      inputs.price.value = p.price;
      inputs.stock.value = p.stock;
      inputs.alertThreshold.value = p.alertThreshold;
      products.splice(idx, 1);
      saveProducts();
    }
  });

  renderList();
});
