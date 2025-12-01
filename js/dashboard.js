<script>
    // Load data saat halaman selesai dimuat
    document.addEventListener('DOMContentLoaded', function () {
      google.script.run.withSuccessHandler(renderDashboard).getDashboardData();
    });

    function renderDashboard(data) {
      // Sembunyikan loading, tampilkan content
      document.getElementById('loading').style.display = 'none';
      document.getElementById('content').style.display = 'block';

      // =========================
      // RENDER STATISTIK
      // =========================
      document.getElementById('stats').innerHTML = `
        <div class="stat-card blue">
          <div class="stat-header">
            <div class="stat-label">Sudah Mengisi</div>
            <div class="stat-icon">✅</div>
          </div>
          <div class="stat-value">${data.totalIsi}</div>
        </div>
        <div class="stat-card red">
          <div class="stat-header">
            <div class="stat-label">Belum Mengisi</div>
            <div class="stat-icon">⏳</div>
          </div>
          <div class="stat-value">${data.totalBelum}</div>
        </div>
        <div class="stat-card green">
          <div class="stat-header">
            <div class="stat-label">Total Pengisian</div>
            <div class="stat-icon">📝</div>
          </div>
          <div class="stat-value">${data.totalRespon}</div>
        </div>
      `;

      // =========================
      // GRAFIK MATA KULIAH (BAR)
      // =========================
      const ctxMatkul = document.getElementById('chartMatkul').getContext('2d');

      new Chart(ctxMatkul, {
        type: 'bar',
        data: {
          labels: data.matkul.labels,
          datasets: [{
            label: 'Jumlah Pengisian',
            data: data.matkul.values,
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

      // =========================
      // GRAFIK PRODI (PIE)
      // =========================
      const ctxProdi = document.getElementById('chartProdi').getContext('2d');

      new Chart(ctxProdi, {
        type: 'pie',
        data: {
          labels: data.prodi.labels,
          datasets: [{
            data: data.prodi.percentages,
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
                  const value = data.prodi.values[context.dataIndex];
                  const percentage = context.parsed;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });

      // =========================
      // GRAFIK SEMESTER (DOUGHNUT)
      // =========================
      const ctxSemester = document.getElementById('chartSemester').getContext('2d');

      new Chart(ctxSemester, {
        type: 'doughnut',
        data: {
          labels: data.semester.labels,
          datasets: [{
            data: data.semester.percentages,
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
                  const value = data.semester.values[context.dataIndex];
                  const percentage = context.parsed;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }
  </script>
