import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Splash({ onFinish }) {
  useEffect(() => {
   
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000); 

    return () => clearTimeout(timer); 
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/Product hunt-bro.png")}
          style={styles.avatarnoorder}
        />
        <Text style={styles.text}>shopping list</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722", 
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
  avatarnoorder: {
    width: 200,
    height: 200,
    marginLeft: 10,
  },
});
