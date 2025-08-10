document.addEventListener('DOMContentLoaded', () => {
  const transactionList = document.getElementById('transaction-list');
  const clearBtn = document.getElementById('clear-history');
  const searchInput = document.getElementById('search-input');
  const sortBtn = document.getElementById('sort-btn');
  const toast = document.getElementById('toast');

  // Ambil riwayat transaksi dari localStorage
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  // Urutan default: terbaru ke terlama
  let sortDescending = true;

  // Format tanggal Indonesia
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  // Format ke Rupiah
  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Tampilkan notifikasi
  const showToast = (message, duration = 3000) => {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  };

  // Render isi transaksi
  const renderTransactions = (filter = '') => {
    let filtered = [...transactions];

    if (filter.trim() !== '') {
      const keyword = filter.toLowerCase();
      filtered = filtered.filter(trx => {
        const itemText = trx.items.map(i => i.name.toLowerCase()).join(' ');
        const dateText = formatDate(trx.date).toLowerCase();
        return itemText.includes(keyword) || dateText.includes(keyword);
      });
    }

    // Urutkan transaksi berdasarkan tanggal
    filtered.sort((a, b) => {
      return sortDescending
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

    // Kosongkan tabel
    transactionList.innerHTML = '';

    if (filtered.length === 0) {
      transactionList.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:#888;">
            Tidak ada transaksi ditemukan.
          </td>
        </tr>`;
      return;
    }

    // Tampilkan transaksi
    filtered.forEach(trx => {
      const row = document.createElement('tr');
      const itemText = trx.items.map(i => `${i.name} × ${i.quantity}`).join(', ');

      row.innerHTML = `
        <td>${formatDate(trx.date)}</td>
        <td>${itemText}</td>
        <td>${formatRupiah(trx.total)}</td>
      `;
      transactionList.appendChild(row);
    });
  };

  // Event: Pencarian
  searchInput.addEventListener('input', (e) => {
    renderTransactions(e.target.value);
  });

  // Event: Tombol sort
  sortBtn.addEventListener('click', () => {
    sortDescending = !sortDescending;
    sortBtn.title = sortDescending
      ? 'Urutkan terbaru ke terlama'
      : 'Urutkan terlama ke terbaru';
    renderTransactions(searchInput.value);
  });

  // Event: Hapus semua riwayat
  clearBtn.addEventListener('click', () => {
    if (transactions.length === 0) {
      showToast('Riwayat sudah kosong.');
      return;
    }

    const confirmed = confirm('Yakin ingin menghapus semua riwayat transaksi?');
    if (confirmed) {
      localStorage.removeItem('transactions');
      transactions = [];
      renderTransactions();
      showToast('Semua riwayat berhasil dihapus.');
    }
  });

  // Inisialisasi tampilan
  renderTransactions();
});
