import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import * as SQLite from "expo-sqlite";
import { SQLiteProvider } from "expo-sqlite";
import { useState, useEffect } from "react";
import Shoppinglist from "./Shoppinglist";

export default function App() {
  const initialize = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
      `);
  };

  return (
    <SQLiteProvider
      databaseName="productdb"
      onInit={initialize}
      onError={(error) => console.error("Could not open database", error)}
    >
      <Shoppinglist />
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
