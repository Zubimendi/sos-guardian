import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, FlatList} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {Ionicons} from "@expo/vector-icons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {COLORS} from "../../constants/colors";
import Card from "../../components/common/Card";
import {Alert} from "../../types";
import {useAuth} from "../../context/AuthContext";
import {getUserAlerts} from "../../services/database";

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

  useEffect(() => {
    (async () => {
      if (!firebaseUser) return;
      const data = await getUserAlerts(firebaseUser.uid);
      setAlerts(data);
    })();
  }, [firebaseUser]);

  return (
    <LinearGradient
      colors={["#040613", "#060818", "#050509"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 40,
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
});

export default AlertHistoryScreen;

