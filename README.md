# PingWatch 📡

[![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Pydantic](https://img.shields.io/badge/-Pydantic-464646?logo=Pydantic)](https://docs.pydantic.dev/latest/)
[![Python](https://img.shields.io/badge/Python-3.12+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

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

The API will be available at `http://localhost:8000/api/v1/`

The current endpoints available are (`/health` -> Are the following services available) and (`/ping` -> Is this actual service running?)

**API Documentation:** `http://localhost:8000/docs`

## 🐳 Docker Deployment

### Prerequisites
- Docker 28.5+
- Docker Compose 2.39+

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/tsotetsi/pingwatch.git
cd pingwatch
```

2. **Create environment file.**
```bash
cp .env.example .env
# Edit .env with your configuration.
```

3. **Build and run.**
```bash
docker compose up --build -d
```

4. **Verify it's working.**
```bash
# Check container status.
docker compose ps

# View logs.
docker compose logs -f backend

# Test the API.
curl http://localhost:8000/api/v1/health
```

**The API will be available at:**

- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/docs
- **Health check**: http://localhost:8000/health

**Common Docker Commands.**

```bash
# Stop services

docker compose down

# Rebuild after code changes
docker compose up -d --build

# View logs
docker compose logs -f backend

# Execute commands in container
docker compose exec backend python --version

# Run tests in container
docker compose exec backend pytest
```

Production Deployment
For production, update your .env file:

```env
ENVIRONMENT=production
LOG_LEVEL=WARNING
ALLOWED_ORIGINS=https://yourdomain.com
```

**Then deploy:**

```bash
docker compose up -d --build
```

# Secure Dependency Management

This project uses a security-first approach to Python dependency management with `pip-tools` and hash pinning to prevent supply chain attacks.

## 🛡️ Security Features

- **Hash verification**: All packages are verified against stored hashes during installation.
- **Reproducible builds**: Exact same dependencies every time.
- **Dependency separation**: Base, local, and production environments.
- **Transitive dependency control**: All sub-dependencies are explicitly pinned.

## 📁 Requirements Structure

* requirements/
\
&nbsp;&nbsp;&nbsp;&nbsp;├── **base.in** # Source: Core dependencies with version ranges
\
&nbsp;&nbsp;&nbsp;&nbsp;├── **base.txt** # Generated: Locked versions with hashes
\
&nbsp;&nbsp;&nbsp;&nbsp;├── **local.in** # Source: Development tools
\
&nbsp;&nbsp;&nbsp;&nbsp;├── **local.txt** # Generated: Development environment
&nbsp;&nbsp;&nbsp;&nbsp;\
&nbsp;&nbsp;&nbsp;&nbsp;├── **production.in** # Source: Production-only packages
\
&nbsp;&nbsp;&nbsp;&nbsp;└── **production.txt** # Generated: Production environment


* **README.md** # This documentation.


## 🔄 Workflow

### Adding a New Dependency

1. **Add to the appropriate `.in` file**:
```bash
echo "new-package>=1.0.0,<2.0.0" >> requirements/base.in
```

2. **Generate locked versions with hashes**:
```bash
./scripts/update-requirements.sh
```

3. **Test and commit both files**:
```bash
git add requirements/base.in requirements/base.txt
git commit -m "feat: add new-package dependency"
```
****

**Regular Security Updates(Monthly)**
```bash
# Update all dependencies to latest compatible versions.
./scripts/update-requirements.sh

# Test thoroughly, then commit updates.
git add requirements/*.txt
git commit -m "chore: update dependencies for security"
```

**Updating Specific Packages**
```bash
# Update a specific package and its dependencies.
pip-compile --upgrade-package fastapi --generate-hashes requirements/base.in -o requirements/base.txt

# Update all packages in a file.
pip-compile --upgrade --generate-hashes requirements/base.in -o requirements/base.txt
```

**Development Setup**
```bash
# Install development dependencies (with hash verification).
pip install --require-hashes -r requirements/local.txt

# Or for production-like environment.
pip install --require-hashes -r requirements/base.txt
```

🏗️ **Build Process**
The Docker build automatically enforces hash verification:

```dockerfile
# In Dockerfile - all installations require hashes
RUN /opt/venv/bin/pip install --no-cache-dir --require-hashes -r /app/requirements/base.txt
```

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


7. **Testing on the actual device(Androin)**

- **Make sure you have turned on android debugging or USB mode.**
- **If you are using USB debugging, make sure File transfer... or Transfer .. is selected. Not just charging**

Then run the following command to check and connect your phone to your PC/Laptop:
```bash
adb devicesList of devices attached
8a5517d1        device
```

you should get something like:
```bash
List of devices attached
1z1516r9        device  # (This is a random string for reference only.)
```

**For the best Native Development Experience(Recommended)**

Expo Go is the perfect tool for learning, prototyping, and experimenting, but most production apps will convert to using development builds sooner rather than later.

Please see the (why) reason you should convert to development build: https://docs.expo.dev/develop/development-builds/introduction/

**Run the native devlopment build(s)**

The following command will create prebuild packages for the provided operating system. 

```bash
# For Andoid Operating System.

npx expo run:android

# For iPhome Operating System.

npx expo run:ios

# Note for ios, you need to have Xcode installed. 

- MacBook is not strictly required for App development.
- Mac is required for App Store distribution.
- Register for an Apple Developer program, you need  an iPhone
  or iPad with Touch ID, Face ID, or a passcode, or a Mac with T2
  Security Chip or Apple Silicon, to verify your identity during
  the enrollment process.

```

Here is a snipper regarding having a free Apple Developer Account:

**AI Overview**
Yes, you can create a free Apple Developer Account without a Mac, iPhone, or iPad by simply signing up with an existing Apple ID or creating a new one on their website, Apple Developer. This free account gives you access to Xcode, documentation, and the ability to test apps on your own devices, but it does not allow you to distribute apps on the App Store, which requires a paid membership. 




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