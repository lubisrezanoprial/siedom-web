// Event listener untuk Enter key
document.getElementById('npm').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    cari();
  }
});

async function cari() {
  const npm = document.getElementById('npm').value.trim();
  
  if (!npm) {
    alert("⚠️ Silakan masukkan NPM terlebih dahulu");
    return;
  }

  // Reset hasil dan tampilkan loading
  document.getElementById('hasil').innerHTML = '';
  document.getElementById('loading').style.display = 'block';
  document.getElementById('printBtn').style.display = 'none';

  try {
    const data = await callAPI('search', { npm });
    tampilkan(data);
  } catch (error) {
    document.getElementById('loading').style.display = 'none';
    alert('❌ Terjadi kesalahan: ' + error.message);
  }
}

function tampilkan(data) {
  document.getElementById('loading').style.display = 'none';

  if (!data.found) {
    document.getElementById('hasil').innerHTML = `
      <div class="alert alert-warning">
        ⚠️ NPM tidak ditemukan atau belum mengisi EDOM
      </div>
    `;
    return;
  }

  // Tampilkan tombol print
  document.getElementById('printBtn').style.display = 'flex';

  let html = `
    <div class="info-card">
      <div class="info-grid">
        <div class="info-label">Nama</div>
        <div class="info-value">${data.nama}</div>
        
        <div class="info-label">Program Studi</div>
        <div class="info-value">${data.prodi}</div>
        
        <div class="info-label">NPM</div>
        <div class="info-value">${data.npm}</div>
        
        <div class="info-label">Jenis Kelamin</div>
        <div class="info-value">${data.jk}</div>
        
        <div class="info-label">Semester</div>
        <div class="info-value">${data.semester}</div>
      </div>
    </div>
  `;

  // Mata Kuliah Sudah Diisi
  html += `<div class="section-header"><span>✅</span><span>Mata Kuliah Sudah Diisi</span></div>`;
  html += `<ul class="matkul-list">`;

  if (data.sudahIsi.length === 0) {
    html += `<li class="matkul-item alert-warning">Belum ada mata kuliah yang diisi</li>`;
  } else {
    data.sudahIsi.forEach(m => {
      const isWarning = m.includes('⚠️');
      html += `<li class="matkul-item ${isWarning ? 'matkul-warning' : 'matkul-success'}">${m}</li>`;
    });
  }

  html += `</ul>`;

  // Mata Kuliah Belum Diisi
  html += `<div class="section-header"><span>⏳</span><span>Mata Kuliah Belum Diisi</span></div>`;
  html += `<ul class="matkul-list">`;

  if (data.belumIsi.length === 0) {
    html += `<li class="matkul-item matkul-complete">🎉 Semua mata kuliah sudah diisi. Terima kasih atas partisipasinya!</li>`;
  } else {
    data.belumIsi.forEach(m => {
      html += `<li class="matkul-item matkul-error">${m}</li>`;
    });
  }

  html += `</ul>`;

  document.getElementById('hasil').innerHTML = html;
}

function printHasil() {
  window.print();
}
