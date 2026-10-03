/* ============================================
   UrbanTwin AI — Main JavaScript
   ============================================ */

// ─── API Endpoints (for future backend) ───
const API = {
  traffic: '/api/traffic',
  signals: '/api/signals',
  prediction: '/api/prediction',
  optimizeSignal: '/api/optimize-signal',
  uploadImage: '/api/upload-image',
};

// ═══════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════

function showToast(message, icon = '✅') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ═══════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Scroll effect
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active nav link highlight
const sections = document.querySelectorAll('section, .hero-section');
const navAnchors = navLinks.querySelectorAll('a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveNav);

// ═══════════════════════════════════════════
//  THEME TOGGLE
// ═══════════════════════════════════════════

const themeToggle = document.getElementById('themeToggle');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.body.classList.toggle('light-mode', !isDark);
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', isDark ? '🌙' : '☀️');
});

// ═══════════════════════════════════════════
//  BACKGROUND PARTICLES
// ═══════════════════════════════════════════

(function initParticles() {
  const container = document.getElementById('bgParticles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = rand(3, 8);
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = rand(0, 100) + '%';
    p.style.animationDuration = rand(12, 30) + 's';
    p.style.animationDelay = rand(0, 15) + 's';
    container.appendChild(p);
  }
})();

// ═══════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ═══════════════════════════════════════════
//  HERO CANVAS — Animated Intersection
// ═══════════════════════════════════════════

(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    W = canvas.width = rect.width * (window.devicePixelRatio || 1);
    H = canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  resize();
  window.addEventListener('resize', resize);

  const rW = () => canvas.clientWidth;
  const rH = () => canvas.clientHeight;

  // Nodes for the network
  const nodes = [];
  const nodeCount = 8;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: 0.15 + Math.random() * 0.7,
      y: 0.15 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      r: 4 + Math.random() * 4,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  // Edges
  const edges = [];
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 0.45) {
        edges.push([i, j]);
      }
    }
  }

  // Data packets flowing along edges
  const packets = [];
  for (let i = 0; i < 12; i++) {
    const edge = edges[i % edges.length];
    packets.push({
      edge: edge,
      t: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      size: 2 + Math.random() * 2,
    });
  }

  // Simple cars
  const cars = [];
  for (let i = 0; i < 6; i++) {
    const horizontal = Math.random() > 0.5;
    cars.push({
      x: Math.random(),
      y: Math.random(),
      horizontal: horizontal,
      speed: 0.001 + Math.random() * 0.002,
      color: ['#00d4ff', '#00ff88', '#ffd32a', '#ff8c00'][rand(0, 3)],
      w: horizontal ? 16 : 8,
      h: horizontal ? 8 : 16,
    });
  }

  function draw() {
    const w = rW(), h = rH();
    ctx.clearRect(0, 0, w, h);

    // Draw road grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.06)';
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h);
    ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5);
    ctx.stroke();

    // Center intersection
    ctx.fillStyle = 'rgba(0, 212, 255, 0.04)';
    ctx.fillRect(w * 0.5 - 20, h * 0.5 - 20, 40, 40);

    // Draw edges
    edges.forEach(([a, b]) => {
      const nA = nodes[a], nB = nodes[b];
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(nA.x * w, nA.y * h);
      ctx.lineTo(nB.x * w, nB.y * h);
      ctx.stroke();
    });

    // Draw data packets
    packets.forEach(p => {
      const nA = nodes[p.edge[0]], nB = nodes[p.edge[1]];
      const px = nA.x + (nB.x - nA.x) * p.t;
      const py = nA.y + (nB.y - nA.y) * p.t;
      ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
      ctx.beginPath();
      ctx.arc(px * w, py * h, p.size, 0, Math.PI * 2);
      ctx.fill();
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
    });

    // Draw nodes
    nodes.forEach(n => {
      n.pulse += 0.03;
      const r = n.r + Math.sin(n.pulse) * 1.5;

      // Glow
      const grd = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, r * 3);
      grd.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
      grd.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x * w, n.y * h, r * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
      ctx.fill();

      // Move
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0.1 || n.x > 0.9) n.vx *= -1;
      if (n.y < 0.1 || n.y > 0.9) n.vy *= -1;
    });

    // Draw cars
    cars.forEach(c => {
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x * w - c.w / 2, c.y * h - c.h / 2, c.w, c.h);

      if (c.horizontal) { c.x += c.speed; if (c.x > 1.05) c.x = -0.05; }
      else { c.y += c.speed; if (c.y > 1.05) c.y = -0.05; }
    });

    // Draw traffic lights at intersection
    const lights = [
      { x: 0.5, y: 0.42, color: '#ff4757' },
      { x: 0.58, y: 0.5, color: '#00ff88' },
      { x: 0.5, y: 0.58, color: '#ff4757' },
      { x: 0.42, y: 0.5, color: '#ff4757' },
    ];
    lights.forEach(l => {
      ctx.fillStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(l.x * w, l.y * h, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Labels
    ctx.font = '10px Orbitron';
    ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText('AI NODE', w * 0.2, h * 0.12);
    ctx.fillText('ESP32', w * 0.8, h * 0.15);
    ctx.fillText('CAMERA', w * 0.15, h * 0.85);

    requestAnimationFrame(draw);
  }
  draw();
})();

// ═══════════════════════════════════════════
//  LIVE TRAFFIC — Animated Counters
// ═══════════════════════════════════════════

function updateLiveStats() {
  const totalV = rand(100, 180);
  const density = rand(55, 90);
  const speed = rand(20, 50);
  const waiting = rand(20, 70);

  document.getElementById('statVehicles').textContent = totalV;
  document.getElementById('statDensity').textContent = density + '%';
  document.getElementById('statSpeed').textContent = speed + ' km/h';
  document.getElementById('statWaiting').textContent = waiting + 's';

  let congLabel = 'LOW';
  if (density > 80) congLabel = 'HIGH';
  else if (density > 60) congLabel = 'MODERATE';
  document.getElementById('statCongestion').textContent = congLabel;

  // Direction data
  const dirs = [
    { id: 'North', veh: rand(15, 50), den: rand(30, 80) },
    { id: 'South', veh: rand(10, 40), den: rand(20, 70) },
    { id: 'East',  veh: rand(20, 60), den: rand(40, 95) },
    { id: 'West',  veh: rand(10, 45), den: rand(25, 75) },
  ];

  dirs.forEach(d => {
    document.getElementById(`dir${d.id}Veh`).textContent = d.veh;
    document.getElementById(`dir${d.id}Den`).textContent = d.den + '%';

    const card = document.getElementById(`dir${d.id}`);
    const indicator = card.querySelector('.dir-indicator');
    indicator.className = 'dir-indicator';
    if (d.den > 80) indicator.classList.add('critical');
    else if (d.den > 60) indicator.classList.add('high');
    else if (d.den > 40) indicator.classList.add('moderate');
    else indicator.classList.add('low');
  });
}

setInterval(updateLiveStats, 4000);

// ═══════════════════════════════════════════
//  CHARTS
// ═══════════════════════════════════════════

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 800 },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#5a6380', font: { size: 10 } },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#5a6380', font: { size: 10 } },
    },
  },
  plugins: { legend: { display: false } },
};

const timeLabels = ['0s', '10s', '20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s'];

function makeChartData(label, color, data) {
  return {
    labels: timeLabels,
    datasets: [{
      label, data,
      borderColor: color,
      backgroundColor: color + '22',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: color,
    }],
  };
}

const chartVehicles = new Chart(document.getElementById('chartVehicles'), {
  type: 'line',
  data: makeChartData('Vehicles', '#00d4ff', [90, 100, 115, 126, 120, 135, 140, 130, 125, 118]),
  options: chartDefaults,
});

const chartDensity = new Chart(document.getElementById('chartDensity'), {
  type: 'line',
  data: makeChartData('Density %', '#00ff88', [55, 60, 65, 72, 68, 75, 80, 74, 70, 66]),
  options: chartDefaults,
});

const chartSpeed = new Chart(document.getElementById('chartSpeed'), {
  type: 'line',
  data: makeChartData('Speed km/h', '#a855f7', [40, 38, 35, 32, 34, 30, 28, 31, 33, 36]),
  options: chartDefaults,
});

const chartQueue = new Chart(document.getElementById('chartQueue'), {
  type: 'line',
  data: makeChartData('Queue', '#ff8c00', [8, 12, 15, 20, 18, 22, 25, 20, 16, 12]),
  options: chartDefaults,
});

// Update charts periodically
function pushChartData(chart, newVal) {
  chart.data.labels.push('');
  chart.data.datasets[0].data.push(newVal);
  if (chart.data.labels.length > 15) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
  }
  chart.update('none');
}

setInterval(() => {
  pushChartData(chartVehicles, rand(90, 160));
  pushChartData(chartDensity, rand(50, 90));
  pushChartData(chartSpeed, rand(20, 50));
  pushChartData(chartQueue, rand(5, 30));
}, 5000);

// ═══════════════════════════════════════════
//  LEAFLET MAP
// ═══════════════════════════════════════════

(function initMap() {
  const mapEl = document.getElementById('leafletMap');
  if (!mapEl) return;

  const map = L.map('leafletMap', {
    center: [12.9716, 77.5946], // Bangalore
    zoom: 15,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 19,
  }).addTo(map);

  // Traffic light icon
  const tlIcon = L.divIcon({
    html: '<div style="width:18px;height:18px;background:#00ff88;border-radius:50%;box-shadow:0 0 10px #00ff88;border:2px solid #fff;"></div>',
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  // Main intersection marker
  const mainMarker = L.marker([12.9716, 77.5946], { icon: tlIcon }).addTo(map);
  mainMarker.bindPopup(`
    <div style="font-family:Inter,sans-serif;color:#111;min-width:200px;">
      <h3 style="margin:0 0 8px;font-size:14px;color:#0077cc;">UrbanTwin Intersection 01</h3>
      <p style="margin:2px 0;font-size:12px;"><b>Vehicle Count:</b> 126</p>
      <p style="margin:2px 0;font-size:12px;"><b>Traffic Density:</b> 72%</p>
      <p style="margin:2px 0;font-size:12px;"><b>Average Speed:</b> 32 km/h</p>
      <p style="margin:2px 0;font-size:12px;"><b>Queue Length:</b> 18</p>
      <p style="margin:2px 0;font-size:12px;"><b>Signal Status:</b> 🟢 Active</p>
      <p style="margin:2px 0;font-size:12px;"><b>Recommended Green:</b> 35 sec</p>
      <p style="margin:6px 0 0;font-size:10px;color:#888;">DEMO DATA</p>
    </div>
  `);

  // Additional intersections
  const otherIntersections = [
    { pos: [12.9736, 77.5926], id: '02', density: 45, status: 'green' },
    { pos: [12.9696, 77.5966], id: '03', density: 78, status: 'orange' },
    { pos: [12.9726, 77.5976], id: '04', density: 92, status: 'red' },
    { pos: [12.9706, 77.5916], id: '05', density: 30, status: 'green' },
  ];

  otherIntersections.forEach(inter => {
    const color = inter.status === 'green' ? '#00ff88' : inter.status === 'orange' ? '#ff8c00' : '#ff4757';
    const icon = L.divIcon({
      html: `<div style="width:14px;height:14px;background:${color};border-radius:50%;box-shadow:0 0 8px ${color};border:2px solid #fff;"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    const m = L.marker(inter.pos, { icon }).addTo(map);
    m.bindPopup(`
      <div style="font-family:Inter,sans-serif;color:#111;">
        <h3 style="margin:0 0 6px;font-size:13px;color:#0077cc;">UrbanTwin Intersection ${inter.id}</h3>
        <p style="margin:2px 0;font-size:12px;"><b>Density:</b> ${inter.density}%</p>
        <p style="margin:4px 0 0;font-size:10px;color:#888;">DEMO DATA</p>
      </div>
    `);
  });

  // Traffic density polylines
  const roads = [
    { path: [[12.9716, 77.5946], [12.9736, 77.5926]], color: '#00ff88', weight: 5 },
    { path: [[12.9716, 77.5946], [12.9696, 77.5966]], color: '#ff8c00', weight: 5 },
    { path: [[12.9716, 77.5946], [12.9726, 77.5976]], color: '#ff4757', weight: 5 },
    { path: [[12.9716, 77.5946], [12.9706, 77.5916]], color: '#00ff88', weight: 5 },
    { path: [[12.9736, 77.5926], [12.9726, 77.5976]], color: '#ffd32a', weight: 4 },
  ];

  roads.forEach(r => {
    L.polyline(r.path, { color: r.color, weight: r.weight, opacity: 0.7 }).addTo(map);
  });
})();

// ═══════════════════════════════════════════
//  AI ANALYSIS — Image Upload
// ═══════════════════════════════════════════

(function initImageUpload() {
  const input = document.getElementById('imageUpload');
  const preview = document.getElementById('uploadPreview');

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.src = ev.target.result;
      preview.style.display = 'block';

      // Simulated AI results
      setTimeout(() => {
        const vehicles = rand(8, 45);
        const density = rand(30, 95);
        let congestion = 'Low';
        if (density > 75) congestion = 'High';
        else if (density > 50) congestion = 'Moderate';

        document.getElementById('vtVehicles').textContent = vehicles;
        document.getElementById('vtDensity').textContent = density + '%';
        document.getElementById('vtCongestion').textContent = congestion;

        showToast('Image analyzed (Demo AI Result)', '🔬');
      }, 1500);
    };
    reader.readAsDataURL(file);
  });
})();

// ═══════════════════════════════════════════
//  AI ANALYSIS — GNN Graph Canvas
// ═══════════════════════════════════════════

(function initGNNCanvas() {
  const canvas = document.getElementById('gnnCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  resize();
  window.addEventListener('resize', () => { resize(); });

  const w = () => canvas.clientWidth;
  const h = () => canvas.clientHeight;

  // Define graph nodes (intersections)
  const graphNodes = [
    { id: 0, label: 'INT-1', x: 0.5,  y: 0.15 },
    { id: 1, label: 'INT-2', x: 0.2,  y: 0.45 },
    { id: 2, label: 'INT-3', x: 0.8,  y: 0.45 },
    { id: 3, label: 'INT-4', x: 0.35, y: 0.8  },
    { id: 4, label: 'INT-5', x: 0.65, y: 0.8  },
  ];

  const graphEdges = [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4],
  ];

  // Flowing particles on edges
  const gnnPackets = [];
  for (let i = 0; i < 15; i++) {
    const edge = graphEdges[i % graphEdges.length];
    gnnPackets.push({
      edge, t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      size: 2 + Math.random() * 1.5,
    });
  }

  let pulse = 0;

  function draw() {
    const cw = w(), ch = h();
    ctx.clearRect(0, 0, cw, ch);
    pulse += 0.02;

    // Draw edges
    graphEdges.forEach(([a, b]) => {
      const nA = graphNodes[a], nB = graphNodes[b];
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nA.x * cw, nA.y * ch);
      ctx.lineTo(nB.x * cw, nB.y * ch);
      ctx.stroke();
    });

    // Draw packets
    gnnPackets.forEach(p => {
      const nA = graphNodes[p.edge[0]], nB = graphNodes[p.edge[1]];
      const px = nA.x + (nB.x - nA.x) * p.t;
      const py = nA.y + (nB.y - nA.y) * p.t;
      ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
      ctx.beginPath();
      ctx.arc(px * cw, py * ch, p.size, 0, Math.PI * 2);
      ctx.fill();
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
    });

    // Draw nodes
    graphNodes.forEach(n => {
      const nx = n.x * cw, ny = n.y * ch;
      const r = 16 + Math.sin(pulse + n.id) * 3;

      // Glow
      const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 2);
      grd.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
      grd.addColorStop(1, 'rgba(0, 212, 255, 0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(nx, ny, r * 2, 0, Math.PI * 2);
      ctx.fill();

      // Node circle
      ctx.fillStyle = '#0c1a3a';
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#00d4ff';
      ctx.font = '10px Orbitron';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, nx, ny);
    });

    requestAnimationFrame(draw);
  }
  draw();

  // Update GNN stats periodically
  setInterval(() => {
    document.getElementById('gnnFlow').textContent = rand(100, 200);
    document.getElementById('gnnDensity').textContent = rand(50, 85) + '%';
    document.getElementById('gnnSpeed').textContent = rand(20, 45);
    document.getElementById('pred15').textContent = (Math.random() > 0.5 ? '+' : '-') + rand(5, 25) + '%';
    document.getElementById('pred30').textContent = (Math.random() > 0.5 ? '+' : '-') + rand(10, 35) + '%';
    document.getElementById('pred60').textContent = (Math.random() > 0.5 ? '+' : '-') + rand(3, 20) + '%';
  }, 6000);
})();

// ═══════════════════════════════════════════
//  SIGNAL CONTROL
// ═══════════════════════════════════════════

const signalState = {
  mode: 'auto', // 'auto' | 'manual'
  currentDir: 'east',
  phase: 'green',       // green, yellow, red
  countdown: 30,
  greenTime: 30,
  yellowTime: 3,
  cycleCount: 0,
  running: true,
  directions: ['north', 'east', 'south', 'west'],
  dirIndex: 1,
};

function setTrafficLight(dir, color) {
  const box = document.getElementById('tl' + dir.charAt(0).toUpperCase() + dir.slice(1));
  if (!box) return;
  box.querySelectorAll('.tl-lamp').forEach(l => l.classList.remove('on'));
  const lamp = box.querySelector('.tl-lamp.' + color.charAt(0));
  if (lamp) lamp.classList.add('on');
}

function setAllLightsRed() {
  signalState.directions.forEach(d => setTrafficLight(d, 'red'));
}

function updateSignalUI() {
  const dir = signalState.currentDir.toUpperCase();
  const phase = signalState.phase.toUpperCase();

  document.getElementById('currentPhase').textContent = dir + ' ' + phase;
  document.getElementById('currentPhase').style.color =
    phase === 'GREEN' ? 'var(--green)' : phase === 'YELLOW' ? 'var(--yellow)' : 'var(--red)';

  document.getElementById('remainingTime').textContent = signalState.countdown + ' sec';
  document.getElementById('countdownValue').textContent = signalState.countdown;
  document.getElementById('recommendedGreen').textContent = rand(25, 45) + ' sec';
  document.getElementById('signalMode').textContent = signalState.mode.toUpperCase();
  document.getElementById('cycleCount').textContent = signalState.cycleCount;
}

function signalTick() {
  if (!signalState.running || signalState.mode !== 'auto') return;

  signalState.countdown--;

  if (signalState.countdown <= 0) {
    if (signalState.phase === 'green') {
      signalState.phase = 'yellow';
      signalState.countdown = signalState.yellowTime;
      setAllLightsRed();
      setTrafficLight(signalState.currentDir, 'yellow');
    } else {
      // Move to next direction
      signalState.dirIndex = (signalState.dirIndex + 1) % signalState.directions.length;
      signalState.currentDir = signalState.directions[signalState.dirIndex];
      signalState.phase = 'green';
      signalState.countdown = signalState.greenTime;
      signalState.cycleCount++;
      setAllLightsRed();
      setTrafficLight(signalState.currentDir, 'green');
    }
  }

  updateSignalUI();
}

// Start signal cycle
setAllLightsRed();
setTrafficLight('east', 'green');
updateSignalUI();
setInterval(signalTick, 1000);

function toggleAutoMode() {
  signalState.mode = 'auto';
  signalState.running = true;
  showToast('Auto mode enabled', '🤖');
  updateSignalUI();
}

function toggleManualMode() {
  signalState.mode = 'manual';
  signalState.running = false;
  showToast('Manual mode enabled — click lights to change', '🖐️');
  updateSignalUI();
}

function optimizeSignal() {
  signalState.greenTime = rand(25, 45);
  signalState.countdown = signalState.greenTime;
  showToast('Signal optimized! Green time: ' + signalState.greenTime + 's', '⚡');
  updateSignalUI();
}

function resetSignal() {
  signalState.dirIndex = 1;
  signalState.currentDir = 'east';
  signalState.phase = 'green';
  signalState.countdown = 30;
  signalState.greenTime = 30;
  signalState.cycleCount = 0;
  signalState.mode = 'auto';
  signalState.running = true;
  setAllLightsRed();
  setTrafficLight('east', 'green');
  updateSignalUI();
  showToast('Signal reset', '🔄');
}

// Manual mode click handlers on traffic light boxes
document.querySelectorAll('.tl-box').forEach(box => {
  box.style.cursor = 'pointer';
  box.addEventListener('click', () => {
    if (signalState.mode !== 'manual') return;
    const dir = box.id.replace('tl', '').toLowerCase();
    setAllLightsRed();
    setTrafficLight(dir, 'green');
    signalState.currentDir = dir;
    signalState.phase = 'green';
    signalState.countdown = signalState.greenTime;
    updateSignalUI();
    showToast(dir.toUpperCase() + ' set to GREEN', '🚦');
  });
});

// ═══════════════════════════════════════════
//  DIGITAL TWIN — Simulation Canvas
// ═══════════════════════════════════════════

const twinState = {
  running: false,
  vehicles: [],
  tick: 0,
  spawnRate: 60,
  signalDir: 'east',
  signalPhase: 'green',
  signalTimer: 0,
  greenDuration: 150,
  yellowDuration: 20,
};

(function initTwin() {
  const canvas = document.getElementById('twinCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  resize();
  window.addEventListener('resize', resize);

  const w = () => canvas.clientWidth;
  const h = () => canvas.clientHeight;

  const roadWidth = 50;
  const carColors = ['#00d4ff', '#00ff88', '#ffd32a', '#ff8c00', '#a855f7', '#3b82f6'];

  function spawnVehicle() {
    const dirs = ['north', 'south', 'east', 'west'];
    const dir = dirs[rand(0, 3)];
    const cw = w(), ch = h();
    const cx = cw / 2, cy = ch / 2;
    let x, y, vx, vy, vw, vh;

    switch (dir) {
      case 'north':
        x = cx + 8; y = -20; vx = 0; vy = 1.2 + Math.random() * 0.8;
        vw = 12; vh = 20;
        break;
      case 'south':
        x = cx - 20; y = ch + 20; vx = 0; vy = -(1.2 + Math.random() * 0.8);
        vw = 12; vh = 20;
        break;
      case 'east':
        x = cw + 20; y = cy + 8; vx = -(1.2 + Math.random() * 0.8); vy = 0;
        vw = 20; vh = 12;
        break;
      case 'west':
        x = -20; y = cy - 20; vx = 1.2 + Math.random() * 0.8; vy = 0;
        vw = 20; vh = 12;
        break;
    }

    twinState.vehicles.push({
      x, y, vx, vy, w: vw, h: vh, dir,
      color: carColors[rand(0, carColors.length - 1)],
      stopped: false,
    });
  }

  function isRedForDir(dir) {
    if (twinState.signalPhase === 'yellow') return true;
    return dir !== twinState.signalDir;
  }

  function drawRoads(cw, ch) {
    const cx = cw / 2, cy = ch / 2;

    // Horizontal road
    ctx.fillStyle = '#141428';
    ctx.fillRect(0, cy - roadWidth / 2, cw, roadWidth);

    // Vertical road
    ctx.fillRect(cx - roadWidth / 2, 0, roadWidth, ch);

    // Center
    ctx.fillStyle = '#1a1a32';
    ctx.fillRect(cx - roadWidth / 2, cy - roadWidth / 2, roadWidth, roadWidth);

    // Dashed lines
    ctx.strokeStyle = 'rgba(255, 211, 42, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 8]);

    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(cx - roadWidth / 2, cy);
    ctx.moveTo(cx + roadWidth / 2, cy); ctx.lineTo(cw, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, 0); ctx.lineTo(cx, cy - roadWidth / 2);
    ctx.moveTo(cx, cy + roadWidth / 2); ctx.lineTo(cx, ch);
    ctx.stroke();

    ctx.setLineDash([]);

    // Traffic lights
    const tlPositions = [
      { x: cx, y: cy - roadWidth / 2 - 12, dir: 'north' },
      { x: cx, y: cy + roadWidth / 2 + 12, dir: 'south' },
      { x: cx + roadWidth / 2 + 12, y: cy, dir: 'east' },
      { x: cx - roadWidth / 2 - 12, y: cy, dir: 'west' },
    ];

    tlPositions.forEach(tl => {
      const isGreen = twinState.signalDir === tl.dir && twinState.signalPhase === 'green';
      const isYellow = twinState.signalPhase === 'yellow';
      const color = isGreen ? '#00ff88' : isYellow ? '#ffd32a' : '#ff4757';
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(tl.x, tl.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  function draw() {
    const cw = w(), ch = h();
    const cx = cw / 2, cy = ch / 2;
    ctx.clearRect(0, 0, cw, ch);

    // Background grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < cw; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, ch); ctx.stroke();
    }
    for (let i = 0; i < ch; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(cw, i); ctx.stroke();
    }

    drawRoads(cw, ch);

    if (twinState.running) {
      twinState.tick++;
      twinState.signalTimer++;

      // Signal cycle
      if (twinState.signalPhase === 'green' && twinState.signalTimer >= twinState.greenDuration) {
        twinState.signalPhase = 'yellow';
        twinState.signalTimer = 0;
      } else if (twinState.signalPhase === 'yellow' && twinState.signalTimer >= twinState.yellowDuration) {
        const dirs = ['north', 'east', 'south', 'west'];
        const idx = (dirs.indexOf(twinState.signalDir) + 1) % 4;
        twinState.signalDir = dirs[idx];
        twinState.signalPhase = 'green';
        twinState.signalTimer = 0;
      }

      // Spawn vehicles
      if (twinState.tick % twinState.spawnRate === 0) {
        spawnVehicle();
      }

      // Update vehicles
      const stopLine = roadWidth / 2 + 25;
      twinState.vehicles.forEach(v => {
        const distX = Math.abs(v.x - cx);
        const distY = Math.abs(v.y - cy);
        const approaching = (v.dir === 'north' && v.y < cy - stopLine) ||
                           (v.dir === 'south' && v.y > cy + stopLine) ||
                           (v.dir === 'east' && v.x > cx + stopLine) ||
                           (v.dir === 'west' && v.x < cx - stopLine);

        const nearStop = ((v.dir === 'north' || v.dir === 'south') && distY > stopLine - 5 && distY < stopLine + 30) ||
                         ((v.dir === 'east' || v.dir === 'west') && distX > stopLine - 5 && distX < stopLine + 30);

        if (nearStop && approaching && isRedForDir(v.dir)) {
          v.stopped = true;
        } else {
          v.stopped = false;
        }

        if (!v.stopped) {
          v.x += v.vx;
          v.y += v.vy;
        }
      });

      // Remove off-screen vehicles
      twinState.vehicles = twinState.vehicles.filter(v =>
        v.x > -50 && v.x < cw + 50 && v.y > -50 && v.y < ch + 50
      );
    }

    // Draw vehicles
    twinState.vehicles.forEach(v => {
      ctx.fillStyle = v.color;
      ctx.fillRect(v.x, v.y, v.w, v.h);
      // Headlights
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      if (v.vy > 0) { ctx.fillRect(v.x + 1, v.y + v.h - 2, 3, 2); ctx.fillRect(v.x + v.w - 4, v.y + v.h - 2, 3, 2); }
      else if (v.vy < 0) { ctx.fillRect(v.x + 1, v.y, 3, 2); ctx.fillRect(v.x + v.w - 4, v.y, 3, 2); }
      else if (v.vx > 0) { ctx.fillRect(v.x + v.w - 2, v.y + 1, 2, 3); ctx.fillRect(v.x + v.w - 2, v.y + v.h - 4, 2, 3); }
      else if (v.vx < 0) { ctx.fillRect(v.x, v.y + 1, 2, 3); ctx.fillRect(v.x, v.y + v.h - 4, 2, 3); }
    });

    // HUD overlay
    if (twinState.running) {
      ctx.fillStyle = 'rgba(0, 212, 255, 0.7)';
      ctx.font = '10px Orbitron';
      ctx.textAlign = 'left';
      ctx.fillText('SIMULATION ACTIVE', 12, 20);
      ctx.fillText('VEHICLES: ' + twinState.vehicles.length, 12, 35);
      ctx.fillText('SIGNAL: ' + twinState.signalDir.toUpperCase() + ' ' + twinState.signalPhase.toUpperCase(), 12, 50);
    } else {
      ctx.fillStyle = 'rgba(0, 212, 255, 0.4)';
      ctx.font = '14px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText('CLICK START TO BEGIN SIMULATION', cw / 2, ch / 2 - 50);
    }

    requestAnimationFrame(draw);
  }

  draw();

  // Update twin stats
  setInterval(() => {
    if (!twinState.running) return;
    const vc = twinState.vehicles.length;
    const stopped = twinState.vehicles.filter(v => v.stopped).length;

    document.getElementById('twinVehicles').textContent = vc;
    document.getElementById('twinFlow').textContent = rand(10, 30) + ' v/min';
    document.getElementById('twinSpeed').textContent = (vc > 0 ? rand(15, 45) : 0) + ' km/h';
    document.getElementById('twinQueue').textContent = stopped;
    document.getElementById('twinWaiting').textContent = (stopped > 0 ? rand(5, 40) : 0) + 's';
    document.getElementById('twinSignal').textContent = twinState.signalDir.toUpperCase() + ' ' + twinState.signalPhase.toUpperCase();
    document.getElementById('twinSignal').style.color =
      twinState.signalPhase === 'green' ? 'var(--green)' : twinState.signalPhase === 'yellow' ? 'var(--yellow)' : 'var(--red)';
  }, 1000);
})();

function twinStart() {
  twinState.running = true;
  showToast('Simulation started', '▶️');
}

function twinPause() {
  twinState.running = false;
  showToast('Simulation paused', '⏸️');
}

function twinReset() {
  twinState.running = false;
  twinState.vehicles = [];
  twinState.tick = 0;
  twinState.signalTimer = 0;
  twinState.signalDir = 'east';
  twinState.signalPhase = 'green';
  document.getElementById('twinVehicles').textContent = '0';
  document.getElementById('twinFlow').textContent = '0 v/min';
  document.getElementById('twinSpeed').textContent = '0 km/h';
  document.getElementById('twinQueue').textContent = '0';
  document.getElementById('twinWaiting').textContent = '0s';
  document.getElementById('twinSignal').textContent = '—';
  showToast('Simulation reset', '🔄');
}

function startSimulation() {
  scrollToSection('twin');
  setTimeout(() => twinStart(), 600);
}

// ═══════════════════════════════════════════
//  INITIALIZATION
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  showToast('UrbanTwin AI loaded successfully', '🚀');
});
