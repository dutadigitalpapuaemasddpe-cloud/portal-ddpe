/* =========================================================
   Result + Twibbon Generator (Custom Frame)
   ========================================================= */

const DIMENSIONS = window.DDPE_DIMENSIONS || {};
let resultData = null;

function init() {
  const raw = localStorage.getItem('ddpe_last_result');
  if (!raw) {
    document.getElementById('noResult').style.display = 'block';
    return;
  }

  resultData = JSON.parse(raw);
  document.getElementById('resultContent').style.display = 'block';
  document.getElementById('resultNama').textContent =
    resultData.personal.panggilan || resultData.personal.nama.split(' ')[0];

  renderRadar();
  renderDimensions();
  renderRoles();
  generateTwibbon();
}

function renderRadar() {
  const labels = Object.values(DIMENSIONS).map(d => d.short);
  const data = Object.keys(DIMENSIONS).map(k => resultData.scoresNormalized[k] || 0);

  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Skor Potensi',
        data,
        fill: true,
        backgroundColor: 'rgba(124, 58, 237, 0.25)',
        borderColor: 'rgba(167, 139, 250, 0.9)',
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#fff',
        pointRadius: 4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 20 },
          grid: { color: 'rgba(255,255,255,0.08)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: {
            color: '#cbd5e1',
            font: { size: 11, family: 'Inter' }
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderDimensions() {
  const list = document.getElementById('dimList');
  const sorted = Object.entries(resultData.scoresNormalized)
    .sort((a, b) => b[1] - a[1]);

  list.innerHTML = sorted.map(([key, val]) => {
    const dim = DIMENSIONS[key] || { short: key, label: key };
    return `
      <div class="dim-item glass-sm">
        <div class="dim-bar-wrap">
          <div class="dim-name">
            <span>${dim.short}</span>
            <span>${val}</span>
          </div>
          <div class="dim-track">
            <div class="dim-fill" style="width:${val}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderRoles() {
  const cards = document.getElementById('roleCards');
  cards.innerHTML = (resultData.roles || []).map(r => `
    <div class="role-card glass-sm">
      <h4>${r.title}</h4>
      <p>${r.desc}</p>
      <div style="margin-top:0.5rem;font-size:0.75rem;color:var(--gold-400)">${r.fit}</div>
    </div>
  `).join('');
}

/* ---------- Custom Frame Twibbon Generator ---------- */
/*
  Frame: assets/twibbon-frame.png (1080x1080)
  Photo slot based on green chroma region:
    approx x:163-967, y:129-909
*/
function generateTwibbon() {
  const canvas = document.getElementById('twibbonCanvas');
  const ctx = canvas.getContext('2d');
  const size = 1080;
  canvas.width = size;
  canvas.height = size;

  // Photo slot aligned to green area of provided frame
  const slot = { x: 170, y: 140, w: 790, h: 760 };

  const frame = new Image();
  frame.crossOrigin = 'anonymous';

  const finish = (photoImg) => {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    if (photoImg) {
      const scale = Math.max(slot.w / photoImg.width, slot.h / photoImg.height);
      const pw = photoImg.width * scale;
      const ph = photoImg.height * scale;
      const px = slot.x + (slot.w - pw) / 2;
      const py = slot.y + (slot.h - ph) / 2;

      ctx.save();
      roundRectPath(ctx, slot.x, slot.y, slot.w, slot.h, 24);
      ctx.clip();
      ctx.drawImage(photoImg, px, py, pw, ph);
      ctx.restore();
    }

    ctx.drawImage(frame, 0, 0, size, size);
  };

  frame.onload = () => {
    if (resultData.fotoDataUrl) {
      const photo = new Image();
      photo.onload = () => finish(photo);
      photo.onerror = () => finish(null);
      photo.src = resultData.fotoDataUrl;
    } else {
      finish(null);
    }
  };

  frame.onerror = () => {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.font = '22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Frame gagal dimuat', size / 2, size / 2);
  };

  frame.src = 'assets/twibbon-frame.png';
}

function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function downloadTwibbon() {
  const canvas = document.getElementById('twibbonCanvas');
  const link = document.createElement('a');
  const safeName = (resultData.personal.nama || 'peserta').replace(/\s+/g, '-');
  link.download = `Twibbon-DDPE-${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function shareResult() {
  const text = `Saya baru saja menyelesaikan Pemetaan Potensi DDPE 2026!\n\nRekomendasi peran: ${(resultData.roles || []).map(r => r.title).join(', ')}\n\n#DutaDigitalPapuaEmas #DDPE2026`;
  if (navigator.share) {
    navigator.share({ title: 'Hasil Pemetaan DDPE', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Teks hasil disalin ke clipboard.'));
  }
}

init();
