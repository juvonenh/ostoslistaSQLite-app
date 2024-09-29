import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [shoppingItems, setShoppingItems] = useState([]);

  const db = SQLite.openDatabaseSync("productdb");

  const initialize = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
      `);
      // update the items list
      await updateList();
    } catch (error) {
      console.error("Could not open database", error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const saveItem = async () => {
    try {
      await db.runAsync(
        "INSERT INTO products VALUES (?, ?, ?)",
        null,
        product,
        amount
      );
      // update the items list
      await updateList();
    } catch (error) {
      console.error("Could not add item", error);
    }
  };

  const updateList = async () => {
    try {
      const list = await db.getAllAsync("SELECT * from products");
      setShoppingItems(list);
    } catch (error) {
      console.error("Could not get items", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await db.runAsync("DELETE FROM products WHERE id=?", id);
      await updateList();
    } catch (error) {
      console.error("Could not delete item", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product"
        onChangeText={(product) => setProduct(product)}
        value={product}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveItem} title="Save" />
      <Text style={styles.listTitle}>Shopping List</Text>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.product}, </Text>
            <Text style={styles.itemText}>{item.amount} </Text>
            <Text style={styles.itemCheck} onPress={() => deleteItem(item.id)}>
              bought
            </Text>
          </View>
        )}
        data={shoppingItems}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  input: {
    height: 40,
    width: 220,
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
  },
  listTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
  },
  itemText: {
    fontSize: 18,
  },
  itemCheck: {
    fontSize: 18,
    color: "#0000ff",
  },
});
