# Mental Fatigue Detection System

A comprehensive fatigue detection platform combining **EEG brainwave analysis** and **real-time driver monitoring** using AI and computer vision.

## 🎯 Features

### 1. EEG Brainwave Analysis
- Multi-channel EEG data analysis (TP9, AF7, AF8, TP10)
- 5 frequency band decomposition (Delta, Theta, Alpha, Beta, Gamma)
- ML-powered fatigue classification
- Interactive visualization of brainwave patterns
- Detailed probability scoring

### 2. Driver Fatigue Monitoring
- Real-time face detection using MediaPipe
- Eye closure tracking (PERCLOS)
- Blink rate monitoring
- Instant drowsiness alerts
- Session analytics dashboard
- Historical trend analysis

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Webcam (for driver monitoring)

### Installation

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd driver-backend
pip install -r requirements.txt
```

Or if using virtual environment:
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Mac/Linux

pip install -r driver-backend/requirements.txt
pip install -r requirements.txt
```

### Running the Application

#### Option 1: Run Both Servers Separately

**Terminal 1 - Frontend (React + Vite)**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

**Terminal 2 - Driver Monitoring Backend (FastAPI)**
```bash
cd driver-backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend will run on `http://127.0.0.1:8000`

**Terminal 3 - EEG Analysis Backend (Flask)** *(if needed)*
```bash
python src/prediction_ml.py
```

#### Option 2: Use the Provided Script
```bash
# Start all services
npm run dev & cd driver-backend && uvicorn app.main:app --reload
```

## 📱 Usage

### EEG Brainwave Analysis

1. Navigate to the homepage
2. Click "EEG Analysis" or go to `/analysis`
3. Enter the path to your CSV file containing EEG data
4. Click "Analyze" and wait for results
5. View detailed frequency band analysis and fatigue classification

**Expected CSV Format:**
```
TP9, AF7, AF8, TP10
value1, value2, value3, value4
...
```

### Driver Fatigue Monitoring

1. Navigate to homepage
2. Click "Driver Monitoring" or go to `/driver-monitoring`
3. Allow camera access when prompted
4. The system will start monitoring in real-time
5. You'll receive audio alerts if drowsiness is detected
6. View analytics at `/driver-analytics`

## 🏗️ Project Structure

```
├── src/
│   ├── driver/                 # Driver monitoring module
│   │   ├── Monitoring.jsx     # Real-time monitoring page
│   │   ├── Analytics.jsx      # Analytics dashboard
│   │   └── components/        # Reusable components
│   ├── AnalysisPage.jsx       # EEG analysis page
│   ├── HomePage.jsx           # Landing page
│   └── prediction_ml.py       # EEG ML backend
├── driver-backend/
│   └── app/
│       ├── main.py            # FastAPI server
│       ├── fatigue_engine.py  # Computer vision engine
│       ├── config.py          # Configuration
│       └── utils.py           # Utilities
└── public/                    # Static assets
```

## 🔧 Configuration

### WebSocket Connection
The driver monitoring WebSocket connects to `ws://localhost:8000/ws` by default.

To change this, edit:
```javascript
// src/driver/components/CameraFeed.jsx
const WEBSOCKET_URL = "ws://your-server:port/ws";
```

### Detection Parameters
Adjust sensitivity in `driver-backend/app/config.py`:
```python
EYE_AR_CONSEC_FRAMES = 20    # Frames before drowsy
PERCLOS_WINDOW = 900          # Window size for PERCLOS
DROWSY_CONFIRM_FRAMES = 15    # Confirmation frames
```

## 🎨 Design System

The project uses a unified design system with:
- CSS variables for theming (`theme.css`)
- Tailwind CSS for utilities
- Consistent card components
- Lucide React icons

## 🐛 Troubleshooting

### Camera Not Working
- Ensure browser has camera permissions
- Check if another app is using the camera
- Try using HTTPS (required by some browsers)

### Backend Connection Error
- Verify the backend server is running on port 8000
- Check firewall settings
- Ensure WebSocket support is enabled

### EEG Analysis Not Working
- Verify CSV file format matches expected structure
- Check Python backend is running
- Ensure all ML dependencies are installed

## 📊 API Endpoints

### Driver Monitoring Backend
- `WS /ws` - WebSocket for real-time frame processing

### EEG Analysis Backend
- `POST /predict-fatigue` - Analyze EEG data
  ```json
  {
    "csv_path": "path/to/file.csv"
  }
  ```

## 🤝 Contributing

This project combines two fatigue detection methods:
1. **EEG-based**: For clinical/research applications
2. **Vision-based**: For real-world driver monitoring

Both modules are fully integrated with a consistent UI/UX.

## 📝 License

This project is free to use for educational and research purposes.

## 🙏 Acknowledgments

- MediaPipe for face landmark detection
- Recharts for data visualization
- React Circular Progressbar for gauge components
- FastAPI for the backend framework
