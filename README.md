# ConnectPulse 📡

[![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> Real-time network connectivity monitoring with instant notifications. Never be caught off-guard by connection issues again.

## ✨ Features

- 🔄 **Real-time Monitoring** - Configurable ping intervals (5s to 60s).
- 🔔 **Instant Notifications** - Immediate alerts on connection loss/restoration.
- 📊 **Activity History** - Track recent pings with latency metrics.
- 🎨 **Beautiful UI** - Modern dark theme with smooth animations.
- 🔋 **Battery Efficient** - Optimized foreground service.
- 📱 **Works Everywhere** - WiFi and mobile data (perfect for hotspot users).
- 🚫 **No Invasive Permissions** - No location or storage access required.

## 🏗️ Architecture

### Frontend Stack
- **React Native** - Cross-platform mobile framework.
- **Expo SDK 54+** - Development and build tooling.
- **Expo Notifications** - Push notification handling.
- **NetInfo** - Network state detection.
- **Task Manager** - Background task execution.

### Backend Stack
- **FastAPI** - High-performance async Python framework.
- **Uvicorn** - ASGI server with performance enhancements.
- **Pydantic** - Data validation.
- **Python 3.12+** - Modern Python features.

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.12+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/tsotetsi/pingwatch.git
cd pingwatch/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements/local.txt
```

4. **Run the server**
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Install Expo modules**
```bash
npx expo install expo-notifications expo-task-manager expo-background-fetch @react-native-community/netinfo
```

4. **Update API URL**
Edit `App.tsx` and update the `API_URL` constant:
```typescript
const API_URL = 'https://your-server-url.com/ping';
// For local testing: http://YOUR_LOCAL_IP:8000/ping
```

5. **Configure app.json**
```json
{
  "expo": {
    "name": "PingWatch",
    "slug": "pingwatch",
    "version": "1.0.0",
    "plugins": [
      [
        "expo-notifications",
        {
          "sounds": []
        }
      ]
    ],
    "android": {
      "permissions": [
        "FOREGROUND_SERVICE",
        "WAKE_LOCK",
        "POST_NOTIFICATIONS"
      ],
      "package": "com.yourcompany.pingwatch"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.pingwatch",
      "infoPlist": {
        "UIBackgroundModes": ["fetch", "remote-notification"]
      }
    }
  }
}
```

6. **Start the app**
```bash
npx expo start
```

Press `i` for iOS simulator or `a` for Android emulator.

## 🚀 Usage

1. **Start Monitoring**
   - Launch the app.
   - Tap "Start Monitoring" button.
   - Grant notification permissions when prompted.

2. **Configure Settings**
   - Choose your preferred ping interval (5s, 10s, 30s, or 60s).
   - Toggle auto-reconnect detection.
   - *Note: Stop monitoring before changing intervals*.

3. **Monitor Connection**
   - Watch real-time status indicator.
   - View ping history with latency.
   - Receive instant notifications on connection changes.

4. **Foreground Service**
   - Persistent notification shows monitoring is active.
   - App continues monitoring even when minimized.
   - Swipe away notification to stop monitoring.

## 📡 API Endpoints

### `GET /ping`
Lightweight connectivity check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T12:34:56.789Z",
  "server_time": 1728048896.789,
  "message": "pong"
}
```

### `GET /health`
Server health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T12:34:56.789Z"
}
```

### `GET /`
API information endpoint.

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app --cov-report=html
```

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

### E2E Tests
```bash
npm run test:e2e
```

## 📊 Code Coverage

| Component | Coverage |
|-----------|----------|
| Backend API | ![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen) |
| Frontend Components | ![Coverage](https://img.shields.io/badge/coverage-87%25-yellowgreen) |
| Integration Tests | ![Coverage](https://img.shields.io/badge/coverage-80%25-yellow) |

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in the backend directory:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
RELOAD=True

# CORS Settings
ALLOWED_ORIGINS=*

# Logging
LOG_LEVEL=INFO
```

### App Configuration (Frontend)

Edit constants in `App.js`:

```typescript
const PING_INTERVAL = 10; // seconds
const API_URL = 'https://your-api.com/ping';
const PING_TIMEOUT = 5000; // milliseconds
```

## 📱 Building for Production

### Android (APK/AAB)
```bash
eas build --platform android
```

### iOS (IPA)
```bash
eas build --platform ios
```

### Both Platforms
```bash
eas build --platform all
```

*Note: Requires Expo EAS account. See [Expo docs](https://docs.expo.dev/build/introduction/) for setup.*

## 🐛 Troubleshooting

### Common Issues

**Issue:** Notifications not showing
- Ensure notification permissions are granted.
- Check Android notification settings for the app.
- Verify foreground service is running.

**Issue:** Background monitoring stops
- Enable "Remove battery restrictions" for the app.
- Disable battery optimization for ConnectPulse.
- Check if phone has aggressive battery management.

**Issue:** Can't connect to backend
- Verify backend is running.
- Check API_URL is correct (use local IP, not localhost).
- Ensure device and server are on same network (for local testing).
- Check firewall settings.

**Issue:** iOS background limitations
- iOS restricts background fetch to ~15min intervals.
- Use foreground service for real-time monitoring.
- Keep app in foreground for best results

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style conventions.
- Tests pass (`npm test` and `pytest`).
- Documentation is updated.
- Commit messages are clear and descriptive.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Thapelo Tsotetsi**
- GitHub: [@tsotetsi](https://github.com/tsotetsi)
- LinkedIn: [Thapelo Tsotetsi](https://linkedin.com/in/tsotetsi-thapelo)

## 🙏 Acknowledgments

- Built with [React Native](https://reactnative.dev/)
- Powered by [Expo](https://expo.dev/)
- Backend with [FastAPI](https://fastapi.tiangolo.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📈 Roadmap

- [ ] Multiple ping endpoints (fallback servers).
- [ ] Bandwidth usage statistics.
- [ ] Export ping history to CSV.
- [ ] Dark/Light theme toggle.
- [ ] Connection quality metrics.
- [ ] Custom notification sounds.
- [ ] Widget support (Android/iOS).
- [ ] Speed test integration.
- [ ] Historical data graphs

## 💬 Support

Having issues? Please check the [Issues](https://github.com/tsotetsi/pingwatch/issues) page or create a new issue.

---

<p align="center">Made with ❤️ by developers who got tired of surprise connection drops.</p>