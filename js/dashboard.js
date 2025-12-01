/* ============================================
   DASHBOARD SIEDOM - MAIN LOGIC (DEBUG)
============================================ */

// Load data saat halaman dimuat
document.addEventListener('DOMContentLoaded', async function () {
  console.log('Dashboard: Page loaded, fetching data...');
  console.log('Dashboard: API_URL =', API_URL);
  
  try {
    // Panggil API untuk mendapatkan data dashboard
    const data = await callAPI('dashboard');
    
    console.log('Dashboard: Raw API Response:', data);
    console.log('Dashboard: totalIsi =', data.totalIsi);
    console.log('Dashboard: totalBelum =', data.totalBelum);
    console.log('Dashboard: totalRespon =', data.totalRespon);
    
    // Render dashboard
    renderDashboard(data);
    
  } catch (error) {
    console.error('Dashboard: Error loading data:', error);
    showError(error.message);
  }
});

// Fungsi untuk menampilkan error
function showError(message) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('error').style.display = 'block';
  document.getElementById('errorMessage').textContent = message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.';
}

// Fungsi untuk render dashboard
function renderDashboard(data) {
  console.log('Dashboard: Rendering with data:', data);
  
  // Sembunyikan loading, tampilkan content
  document.getElementById('loading').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  // Render statistik cards
  const statsHTML = `
    <div class="stat-card blue">
      <div class="stat-header">
        <div class="stat-label">Sudah Mengisi</div>
        <div class="stat-icon">✅</div>
      </div>
      <div class="stat-value">${data.totalIsi || 0}</div>
    </div>
    <div class="stat-card red">
      <div class="stat-header">
        <div class="stat-label">Belum Mengisi</div>
        <div class="stat-icon">⏳</div>
      </div>
      <div class="stat-value">${data.totalBelum || 0}</div>
    </div>
    <div class="stat-card green">
      <div class="stat-header">
        <div class="stat-label">Total Pengisian</div>
        <div class="stat-icon">📝</div>
      </div>
      <div class="stat-value">${data.totalRespon || 0}</div>
    </div>
  `;
  
  console.log('Dashboard: Stats HTML:', statsHTML);
  document.getElementById('stats').innerHTML = statsHTML;

  // Render Chart Mata Kuliah
  renderChartMatkul(data.matkul);
  
  // Render Chart Prodi
  renderChartProdi(data.prodi);
  
  // Render Chart Semester
  renderChartSemester(data.semester);
  
  console.log('Dashboard: Rendering complete');
}

// Render Chart Mata Kuliah (Bar Chart)
function renderChartMatkul(matkulData) {
  console.log('Dashboard: Rendering Matkul chart with:', matkulData);
  
  const ctx = document.getElementById('chartMatkul').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: matkulData.labels || [],
      datasets: [{
        label: 'Jumlah Pengisian',
        data: matkulData.values || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 0,
        borderRadius: 8,
        barThickness: 40,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          labels: {
            font: { size: 13, family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto' },
            padding: 15,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: { size: 13 },
          bodyFont: { size: 12 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6',
            drawBorder: false
          },
          ticks: {
            font: { size: 11 },
            color: '#6b7280'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { size: 11 },
            color: '#6b7280'
          }
        }
      }
    }
  });
}

// Render Chart Prodi (Pie Chart)
function renderChartProdi(prodiData) {
  console.log('Dashboard: Rendering Prodi chart with:', prodiData);
  
  const ctx = document.getElementById('chartProdi').getContext('2d');
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: prodiData.labels || [],
      datasets: [{
        data: prodiData.percentages || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: 'white',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 12 },
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = prodiData.values ? prodiData.values[context.dataIndex] : 0;
              const percentage = context.parsed || 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Render Chart Semester (Doughnut Chart)
function renderChartSemester(semesterData) {
  console.log('Dashboard: Rendering Semester chart with:', semesterData);
  
  const ctx = document.getElementById('chartSemester').getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: semesterData.labels || [],
      datasets: [{
        data: semesterData.percentages || [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: 'white',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 12 },
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = semesterData.values ? semesterData.values[context.dataIndex] : 0;
              const percentage = context.parsed || 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}
