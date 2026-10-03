# 🚦 UrbanTwin AI

**Smart Traffic Optimization Using Graph Neural Networks and Vision Transformers**

An intelligent traffic management system that uses computer vision, graph neural networks, and adaptive traffic signal control to monitor and optimize urban traffic.

---

## 🌟 Features

- **Live Traffic Dashboard** — Real-time vehicle counts, density, speed, congestion monitoring
- **AI Analysis** — Vision Transformer for vehicle detection + Graph Neural Network for traffic prediction
- **Interactive Traffic Map** — Leaflet/OpenStreetMap with intersection markers and traffic density overlays
- **Signal Control** — Animated 4-way intersection with Auto/Manual/Optimize modes and countdown timer
- **Digital Twin Simulation** — Canvas-based simulation with moving vehicles and signal cycling
- **Hardware Integration** — ESP32, IR sensors, LED traffic lights, camera system architecture
- **Dark/Light Theme** — Toggle between dark and light mode
- **Fully Responsive** — Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

| Frontend | AI / ML | Hardware |
|----------|---------|----------|
| HTML5, CSS3, JavaScript | PyTorch, TensorFlow | ESP32 |
| Chart.js | OpenCV | IR Sensors |
| Leaflet.js | NetworkX | LED Traffic Lights |
| Glassmorphism UI | NumPy, Pandas | Wi-Fi / LoRa |

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/UrbanTwin-AI.git
   cd UrbanTwin-AI
   ```

2. Open `index.html` in a browser, or serve locally:
   ```bash
   npx http-server . -p 8080
   ```

3. Visit `http://localhost:8080`

## 📁 Project Structure

```
UrbanTwin-AI/
├── index.html          # Main HTML (all sections)
├── css/
│   └── style.css       # Complete stylesheet
├── js/
│   └── main.js         # All interactivity & simulations
├── .gitignore
└── README.md
```

## 📡 API Endpoints (Future Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/traffic` | Get live traffic data |
| GET | `/api/signals` | Get signal status |
| GET | `/api/prediction` | Get traffic predictions |
| POST | `/api/optimize-signal` | Optimize signal timing |
| POST | `/api/upload-image` | Upload image for AI analysis |

## 📜 License

This project is for educational and demonstration purposes.

---

> Built with ❤️ by UrbanTwin AI Team
