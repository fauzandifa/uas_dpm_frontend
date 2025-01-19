import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.8:3000/api/todos";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [token, setToken] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        const { token } = JSON.parse(storedToken);
        setToken(token);
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTodos(data.data || []);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) => [result.data, ...prev]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } else {
      Alert.alert("Error", result.message || "Error adding todo");
    }
  };

  const handleEditTodo = async () => {
    const response = await fetch(`${API_URL}/${editTodoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();

    if (response.ok) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === editTodoId ? { ...todo, title, description } : todo
        )
      );
      setTitle("");
      setDescription("");
      setShowForm(false);
      setEditTodoId(null);
    } else {
      Alert.alert("Error", result.message || "Error editing todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } else {
      Alert.alert("Error", "Error deleting todo");
    }
  };

  const handleCancelEdit = () => {
    setTitle("");
    setDescription("");
    setShowForm(false);
    setEditTodoId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>hi there</Text>
          <Text style={styles.subHeader}>
            please arrange your shopping materials
          </Text>
        </View>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/bf/0f/75/bf0f752c59bf0ce78d653a10c1a27cc8.jpg",
          }}
          style={styles.avatar}
        />
      </View>
      {showForm ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="item's name"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="price/notes"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.formButtonContainer}>
            <TouchableOpacity
              style={styles.formAddButton}
              onPress={editTodoId ? handleEditTodo : handleAddTodo}
            >
              <Text style={styles.formAddButtonText}>
                {editTodoId ? "Update items" : "Add items"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.formCancelButton}
              onPress={handleCancelEdit}
            >
              <Text style={styles.formCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {todos.length === 0 ? (
            <View style={styles.noOrdersContainer}>
              <Image
                source={require("../../../assets/fruit shop-rafiki (1).png")}
                style={styles.avatarnoorder}
              />
              <Text style={styles.noOrdersText}>
                you haven't ordered anything yet
              </Text>
            </View>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.todoItem}>
                  <View>
                    <Text style={styles.todoTitle}>{item.title}</Text>
                    <Text style={styles.todoDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditTodoId(item._id);
                        setTitle(item.title);
                        setDescription(item.description);
                        setShowForm(true);
                      }}
                    >
                      <Icon name="create" size={20} color="#2464EC" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteTodo(item._id)}
                    >
                      <Icon name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>0</Text>
              <Text style={styles.summaryLabel}>BUYED ITEMS</Text>
            </View>
            <View style={styles.summaryBoxPending}>
              <Text style={styles.summaryNumber}>{todos.length}</Text>
              <Text style={styles.summaryLabel}>PENDING ITEMS</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log("Add button pressed");
              setShowForm(true);
            }}
          >
            <Icon name="add" size={30} style={styles.addButtonIcon} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 10,
  },
  avatarnoorder: {
    width: 200,
    height: 200,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fefefa",
  },
  headerContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#ff5722",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    color: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "start",
    color: "#fff",
  },
  subHeader: {
    fontSize: 16,
    textAlign: "start",
    marginBottom: 20,
    color: "#fff",
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  formButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formAddButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  formAddButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  formCancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  formCancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoItem: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  todoDescription: {
    fontSize: 14,
    color: "#777",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#d1f7d6",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  summaryBoxPending: {
    flex: 1,
    backgroundColor: "#ffd9d9",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#555",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  addButtonIcon: {
    color: "#fff",
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
});
