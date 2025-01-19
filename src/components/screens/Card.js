import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import Linear Gradient
import { Ionicons } from "@expo/vector-icons"; // Import Icons for visual effect

export default function Splash({ onFinish }) {
  useEffect(() => {
    // Simulate loading or delay before finishing splash
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 5000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onFinish]);

  return (
    <LinearGradient
      colors={["#FF6F61", "#FFD700"]} // Gradasi warna
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Ionicons name="rocket" size={64} color="#fff" style={styles.icon} />
        <Text style={styles.text}>App To Do</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: 10,
  },
  icon: {
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
