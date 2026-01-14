import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {COLORS} from "../../constants/colors";
import Card from "../../components/common/Card";
import Screen from "../../components/common/Screen";
import HeaderBar from "../../components/common/HeaderBar";
import {Alert} from "../../types";
import {useAuth} from "../../context/AuthContext";
import {getUserAlerts, subscribeToUserActiveAlerts} from "../../services/database";

type Props = NativeStackScreenProps<any>;

const formatDateTime = (timestamp: number) => {
  const d = new Date(timestamp);
  return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const statusLabel: Record<Alert["status"], string> = {
  active: "Active",
  resolved: "Resolved",
  false_alarm: "False alarm",
};

const statusColor: Record<Alert["status"], string> = {
  active: "#FF9500",
  resolved: "#34C759",
  false_alarm: "#98989D",
};

const AlertHistoryScreen: React.FC<Props> = () => {
  const {firebaseUser} = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!firebaseUser) return;
      const data = await getUserAlerts(firebaseUser.uid);
      setAlerts(data);
    })();
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) return;
    const unsubscribe = subscribeToUserActiveAlerts(
      firebaseUser.uid,
      (current) => setActiveAlerts(current),
    );
    return () => unsubscribe();
  }, [firebaseUser]);

  return (
    <Screen>
      <View style={styles.container}>
        <HeaderBar style={{marginBottom: 12}} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Alert history</Text>
            <Text style={styles.subtitle}>
              Overview of your past SOS and timer alerts.
            </Text>
          </View>
          <View style={styles.iconCircle}>
            <Ionicons name="alert-circle" size={22} color={COLORS.text} />
          </View>
        </View>

        {activeAlerts.length > 0 && (
          <Card>
            <View style={styles.activeRow}>
              <Ionicons
                name="flash"
                size={18}
                color={COLORS.warning}
                style={{marginRight: 8}}
              />
              <View style={{flex: 1}}>
                <Text style={styles.activeTitle}>Active alert</Text>
                <Text style={styles.activeMeta}>
                  Live SOS in progress. Last update at{" "}
                  {formatDateTime(activeAlerts[0].timestamp)}
                </Text>
              </View>
            </View>
          </Card>
        )}

        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <Card>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <Text style={styles.alertTitle}>
                    {item.type === "sos" ? "SOS Alert" : "Safety Timer"}
                  </Text>
                  <Text style={styles.alertMeta}>
                    {formatDateTime(item.timestamp)}
                  </Text>
                  <Text style={styles.alertMeta}>
                    Lat {item.location.latitude.toFixed(4)}, Lng{" "}
                    {item.location.longitude.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.statusChipContainer}>
                  <Text
                    style={[
                      styles.statusChip,
                      {color: statusColor[item.status]},
                    ]}
                  >
                    ● {statusLabel[item.status]}
                  </Text>
                </View>
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No alerts yet. When you trigger SOS or start timers, they will
              appear here.
            </Text>
          }
          contentContainerStyle={{paddingBottom: 40}}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  alertMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statusChipContainer: {
    marginLeft: 12,
  },
  statusChip: {
    fontSize: 12,
    fontWeight: "600",
  },
  empty: {
    color: COLORS.textSecondary,
    marginTop: 24,
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeTitle: {
    color: COLORS.warning,
    fontSize: 14,
    fontWeight: "600",
  },
  activeMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

export default AlertHistoryScreen;

