import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, ScrollView, RefreshControl} from "react-native";
import {collection, query, orderBy, getDocs, limit} from "firebase/firestore";
import {db} from "../../services/firebase";
import {COLORS} from "../../constants/colors";
import Screen from "../../components/common/Screen";
import HeaderBar from "../../components/common/HeaderBar";
import SectionHeader from "../../components/common/SectionHeader";
import {Ionicons} from "@expo/vector-icons";

interface SmsLog {
  id: string;
  to: string;
  message: string;
  status: string;
  sentAt: number;
  mock: boolean;
}

const SmsLogsScreen: React.FC = () => {
  const [logs, setLogs] = useState<SmsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLogs = async () => {
    try {
      const q = query(
        collection(db, "smsLogs"),
        orderBy("sentAt", "desc"),
        limit(50),
      );
      const snap = await getDocs(q);
      const logsData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SmsLog[];
      setLogs(logsData);
    } catch (error) {
      console.error("Error loading SMS logs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{paddingBottom: 32}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <HeaderBar style={{marginBottom: 16}} />
        <SectionHeader
          title="SMS Logs"
          subtitle="View all SMS alerts sent to emergency contacts"
        />

        {loading ? (
          <Text style={styles.loading}>Loading logs...</Text>
        ) : logs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No SMS logs yet</Text>
            <Text style={styles.emptySubtext}>
              SMS logs will appear here when you trigger SOS alerts
            </Text>
          </View>
        ) : (
          <View style={styles.logsContainer}>
            {logs.map((log) => (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <View style={styles.logHeaderLeft}>
                    <Ionicons
                      name={log.mock ? "phone-portrait-outline" : "checkmark-circle"}
                      size={20}
                      color={log.mock ? COLORS.warning : COLORS.success}
                    />
                    <Text style={styles.phoneNumber}>{log.to}</Text>
                  </View>
                  {log.mock && (
                    <View style={styles.mockBadge}>
                      <Text style={styles.mockText}>MOCK</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.message}>{log.message}</Text>
                <View style={styles.logFooter}>
                  <Text style={styles.timestamp}>{formatTime(log.sentAt)}</Text>
                  <Text style={styles.status}>{log.status.toUpperCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loading: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 32,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  logsContainer: {
    gap: 12,
  },
  logCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  logHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneNumber: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  mockBadge: {
    backgroundColor: COLORS.warning + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  mockText: {
    color: COLORS.warning,
    fontSize: 10,
    fontWeight: "700",
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  logFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timestamp: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  status: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SmsLogsScreen;
