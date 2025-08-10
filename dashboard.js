document.addEventListener('DOMContentLoaded', () => {
  const greetingEl = document.getElementById('greeting');
  const statTransactions = document.getElementById('stat-transactions');
  const statProducts = document.getElementById('stat-products');
  const statUsers = document.getElementById('stat-users');
  const statLowStock = document.getElementById('stat-lowstock');
  const transactionTableBody = document.getElementById('transaction-table-body');
  const noTransactions = document.getElementById('no-transactions');

  // Fungsi untuk format Rupiah
  function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  // Fungsi greeting berdasarkan waktu
  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Selamat datang';

    if (hour < 12) greeting = 'Selamat pagi';
    else if (hour < 17) greeting = 'Selamat siang';
    else if (hour < 20) greeting = 'Selamat sore';
    else greeting = 'Selamat malam';

    greetingEl.textContent = `${greeting}, Kasir!`;
  }

  // Ambil transaksi dari localStorage
  function loadRecentTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Ambil transaksi dari hari ini
    const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
    const todayTransactions = transactions.filter(trx => trx.date.startsWith(today));

    if (todayTransactions.length === 0) {
      noTransactions.style.display = 'block';
      return;
    }

    // Tampilkan hanya 5 transaksi terakhir
    const latest = todayTransactions.slice(-5).reverse();

    latest.forEach(trx => {
      const tr = document.createElement('tr');

      const items = trx.items.map(item => `${item.name} × ${item.quantity}`).join(', ');

      tr.innerHTML = `
        <td>${new Date(trx.date).toLocaleString('id-ID', {
          dateStyle: 'short',
          timeStyle: 'short'
        })}</td>
        <td>${items}</td>
        <td>${trx.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
        <td>${formatRupiah(trx.total)}</td>
      `;

      transactionTableBody.appendChild(tr);
    });
  }

  // Statistik dummy (bisa diganti dengan data asli jika ada backend)
  function loadStatistics() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const today = new Date().toISOString().slice(0, 10);
    const todayTotal = transactions
      .filter(trx => trx.date.startsWith(today))
      .reduce((sum, trx) => sum + trx.total, 0);

    statTransactions.textContent = formatRupiah(todayTotal);
    statProducts.textContent = '12'; // Bisa diganti dengan data produk dari localStorage
    statUsers.textContent = '3'; // Bisa diganti sesuai data pengguna
    statLowStock.textContent = '2 Produk'; // Dummy
  }

  // Toggle sidebar (jika butuh)
  const toggleBtn = document.getElementById('btn-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
  // di dalam loadStatistics()
function loadStatistics() {
  const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];

  const today = new Date().toISOString().slice(0, 10);
  const todayTotal = transactions
    .filter(trx => trx.date.startsWith(today))
    .reduce((sum, trx) => sum + trx.total, 0);

  statTransactions.textContent = formatRupiah(todayTotal);
  statProducts.textContent = products.length;
  statUsers.textContent = '—';
  statLowStock.textContent = products.filter(p => p.stock <= p.alertThreshold).length + ' Produk';
}
// Cek status login saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (isLoggedIn !== 'true') {
    // Kalau belum login, redirect ke halaman login
    window.location.href = 'login.html';
    return;
  }

  const username = localStorage.getItem('username') || 'User';

  // Tampilkan greeting
  const greetingEl = document.getElementById('greeting');
  const hours = new Date().getHours();
  let greetText = 'Selamat datang, ' + username + '!';

  if(hours < 12) greetText = `Selamat pagi, ${username}!`;
  else if(hours < 18) greetText = `Selamat siang, ${username}!`;
  else greetText = `Selamat sore, ${username}!`;

  greetingEl.textContent = greetText;

  // Contoh load data (bisa kamu ganti sesuai data produk dan transaksi dari localStorage atau API)
  // Dummy data untuk demo:
  const transactionsToday = 1500000; // Rp 1.500.000
  const totalProducts = 25;
  const activeUsers = 5;
  const lowStock = 3;

  document.getElementById('stat-transactions').textContent = `Rp ${transactionsToday.toLocaleString('id-ID')}`;
  document.getElementById('stat-products').textContent = totalProducts;
  document.getElementById('stat-users').textContent = activeUsers;
  document.getElementById('stat-lowstock').textContent = `${lowStock} Produk`;

  // Dummy last transactions
  const transactionTableBody = document.getElementById('transaction-table-body');
  const noTransactionsMsg = document.getElementById('no-transactions');

  const lastTransactions = [
    { date: '2025-08-05', product: 'Kopi Sachet', quantity: 3, total: 45000 },
    { date: '2025-08-05', product: 'Teh Botol', quantity: 2, total: 30000 },
    { date: '2025-08-05', product: 'Roti Tawar', quantity: 1, total: 15000 },
  ];

  if(lastTransactions.length === 0) {
    noTransactionsMsg.style.display = 'block';
  } else {
    noTransactionsMsg.style.display = 'none';
    transactionTableBody.innerHTML = '';
    lastTransactions.forEach(trx => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${trx.date}</td>
        <td>${trx.product}</td>
        <td>${trx.quantity}</td>
        <td>Rp ${trx.total.toLocaleString('id-ID')}</td>
      `;
      transactionTableBody.appendChild(tr);
    });
  }

  // Logout button event
  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn.addEventListener('click', () => {
    if(confirm('Anda yakin ingin logout?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      window.location.href = 'login.html';
    }
  });
});


  updateGreeting();
  loadRecentTransactions();
  loadStatistics();
});
