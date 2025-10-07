import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import NetInfo from '@react-native-community/netinfo';

const PING_TASK = 'CONNECTIVITY_PING_TASK';
const PING_INTERVAL = 10; // seconds
const HOST = 'http://localhost';
const PORT = '8000';
const PATH = '/health';
const API_URL = `${HOST}:${PORT}${PATH}`; // Update with your FastAPI URL

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Define the background task
TaskManager.defineTask(PING_TASK, async () => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(API_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    // Connection failed
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔴 Connection Lost',
        body: 'Internet connectivity issue detected',
        data: { type: 'connection_lost' },
      },
      trigger: null,
    });
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export default function App() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [lastPingTime, setLastPingTime] = useState(null);
  const [pingHistory, setPingHistory] = useState([]);
  const [pingInterval, setPingInterval] = useState(PING_INTERVAL);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInterval, setCustomInterval] = useState('60');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    requestPermissions();
    
    // Listen to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        setConnectionStatus('offline');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (connectionStatus === 'online') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [connectionStatus]);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permissions are required for connection alerts!');
    }
  };

  const performPing = async () => {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(API_URL, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      const latency = Date.now() - startTime;

      if (response.ok) {
        const prevStatus = connectionStatus;
        setConnectionStatus('online');
        setLastPingTime(new Date());
        
        setPingHistory(prev => [
          { time: new Date(), status: 'success', latency },
          ...prev.slice(0, 19), // Keep last 20
        ]);

        // Connection restored notification
        if (prevStatus === 'offline') {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🟢 Connection Restored',
              body: `Back online (${latency}ms)`,
            },
            trigger: null,
          });
        }
      } else {
        throw new Error('Bad response');
      }
    } catch (error) {
      const prevStatus = connectionStatus;
      setConnectionStatus('offline');
      setLastPingTime(new Date());
      
      setPingHistory(prev => [
        { time: new Date(), status: 'failed' },
        ...prev.slice(0, 19),
      ]);

      // Only notify on status change
      if (prevStatus !== 'offline') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🔴 Connection Lost',
            body: 'Unable to reach server',
          },
          trigger: null,
        });
      }
    }
  };

  const startMonitoring = async () => {
    setIsMonitoring(true);
    
    // Show foreground notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔄 Monitoring Active',
        body: `Checking connection every ${pingInterval}s`,
        sticky: true,
      },
      trigger: null,
    });

    // Initial ping
    await performPing();

    // Set up interval
    intervalRef.current = setInterval(() => {
      performPing();
    }, pingInterval * 1000);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await Notifications.dismissAllNotificationsAsync();

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCustomInterval = () => {
    const value = parseInt(customInterval);
    if (!isNaN(value) && value >= 5 && value <= 300) {
      setPingInterval(value);
      setShowCustomModal(false);
    } else {
      alert('Please enter a valid interval between 5 and 300 seconds');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connectivity Monitor</Text>
        <Text style={styles.headerSubtitle}>Real-time network monitoring</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Animated.View style={[styles.statusIconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.statusIcon, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusEmoji}>{getStatusIcon()}</Text>
            </View>
          </Animated.View>
          
          <Text style={styles.statusText}>
            {connectionStatus === 'online' ? 'Connected' : 
             connectionStatus === 'offline' ? 'Disconnected' : 'Unknown'}
          </Text>
          
          {lastPingTime && (
            <Text style={styles.lastPingText}>
              Last checked: {lastPingTime.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Control Button */}
        <TouchableOpacity
          style={[styles.controlButton, isMonitoring && styles.controlButtonActive]}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Text style={styles.controlButtonText}>
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Ping Interval</Text>
            <View style={styles.intervalButtons}>
              {[5, 30].map(interval => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.intervalButton,
                    pingInterval === interval && styles.intervalButtonActive
                  ]}
                  onPress={() => setPingInterval(interval)}
                  disabled={isMonitoring}
                >
                  <Text style={[
                    styles.intervalButtonText,
                    pingInterval === interval && styles.intervalButtonTextActive
                  ]}>
                    {interval}s
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.intervalButton,
                  ![5, 30].includes(pingInterval) && styles.intervalButtonActive
                ]}
                onPress={() => setShowCustomModal(true)}
                disabled={isMonitoring}
              >
                <Text style={[
                  styles.intervalButtonText,
                  ![5, 30].includes(pingInterval) && styles.intervalButtonTextActive
                ]}>
                  {![5, 30].includes(pingInterval) ? `${pingInterval}s` : 'Own?'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto-reconnect</Text>
            <Switch
              value={autoReconnect}
              onValueChange={setAutoReconnect}
              trackColor={{ false: '#374151', true: '#10b981' }}
              thumbColor={autoReconnect ? '#fff' : '#9ca3af'}
            />
          </View>
        </View>

        {/* Ping History */}
        {isMonitoring && pingHistory.length > 0 && (
          <Animated.View style={[styles.historyCard, { opacity: fadeAnim }]}>
            <Text style={styles.historyTitle}>Recent Activity</Text>
            {pingHistory.slice(0, 5).map((ping, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyIcon}>
                  {ping.status === 'success' ? '✓' : '✕'}
                </Text>
                <Text style={styles.historyTime}>
                  {ping.time.toLocaleTimeString()}
                </Text>
                {ping.latency && (
                  <Text style={styles.historyLatency}>{ping.latency}ms</Text>
                )}
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* Custom Interval Modal */}
      <Modal
        visible={showCustomModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom Interval</Text>
            <Text style={styles.modalSubtitle}>Enter interval in seconds (5-300)</Text>
            
            <TextInput
              style={styles.modalInput}
              value={customInterval}
              onChangeText={setCustomInterval}
              keyboardType="numeric"
              placeholder="60"
              placeholderTextColor="#6b7280"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleCustomInterval}
              >
                <Text style={styles.modalButtonText}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIconContainer: {
    marginBottom: 20,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 50,
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  lastPingText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  controlButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButtonActive: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  intervalButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  intervalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#334155',
    minWidth: 55,
    alignItems: 'center',
  },
  intervalButtonActive: {
    backgroundColor: '#10b981',
  },
  intervalButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  intervalButtonTextActive: {
    color: '#fff',
  },
  historyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  historyIcon: {
    fontSize: 18,
    width: 30,
    color: '#fff',
  },
  historyTime: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
  },
  historyLatency: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#334155',
  },
  modalButtonConfirm: {
    backgroundColor: '#10b981',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});