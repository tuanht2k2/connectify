import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function HeaderLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="account/[id]"
        options={{
          headerTitle: "",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
      <Stack.Screen
        name="messenger/[id]"
        options={{
          headerTitle: "Nhắn tin",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
      <Stack.Screen
        name="post/[id]"
        options={{
          headerTitle: "Bài viết",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
      <Stack.Screen
        name="post/create"
        options={{
          headerTitle: "Tạo bài viết mới",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
      <Stack.Screen
        name="post/edit/[id]"
        options={{
          headerTitle: "Chỉnh sửa bài viết",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
      <Stack.Screen
        name="image/[id]"
        options={{
          headerTitle: "Ảnh",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
      <Stack.Screen
        name="room/[roomId]"
        options={{
          headerTitle: "Gọi Video",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerText,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
