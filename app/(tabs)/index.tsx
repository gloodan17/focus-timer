import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import your App content component, or keep code inline

export default function App() {
  const [minutesInput, setMinutesInput] = useState("10"); // text from input
  const [secondsLeft, setSecondsLeft] = useState(10 * 60); // total seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const m = minutes.toString().padStart(2, "0");
    const s = seconds.toString().padStart(2, "0");

    return `${m}:${s}`;
  };

  const handleStart = () => {
    const minutes = parseInt(minutesInput);
    if (isNaN(minutes) || minutes <= 0) {
      return
    }

    setSecondsLeft(minutes * 60);
    setIsRunning(true);
  };

  const handlePause = () => {
    if (parseInt(minutesInput) * 60 === secondsLeft) return;
    if (!isPausing) setIsRunning(false);
    else setIsRunning(true);
    setIsPausing(!isPausing);
  };

  const handleReset = () => {
    setIsRunning(false);
    const minutes = parseInt(minutesInput);
    if (!isNaN(minutes) && minutes > 0) {
      setSecondsLeft(minutes * 60);
    } else {
      setSecondsLeft(0);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          Alert.alert("Time's up!", "Go take a piss and get the hell back.")
          return 0;
        }
        return prev - 1;
      })
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [isRunning, secondsLeft]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Focus Timer</Text>

        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={minutesInput}
            onChangeText={setMinutesInput}
            placeholder="Minutes"
          />
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handlePause}>
            <Text style={styles.buttonText}>Pause</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>

        <Text style={styles.statusText}>
          Running: {isRunning ? "Yes" : "No"}
        </Text>
        <Text style={styles.statusText}>
          Seconds left (raw): {secondsLeft}
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: "#111827",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#F9FAFB",
  },
  timerBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    borderRadius: 16,
    backgroundColor: "#1F2937",
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#F9FAFB",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },
  buttonText: {
    color: "#F9FAFB",
    fontWeight: "600",
  },
  statusText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
});