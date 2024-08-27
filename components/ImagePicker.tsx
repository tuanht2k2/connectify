import GlobalStyle from "@/assets/styles/globalStyles";
import { Image } from "@rneui/base";
import { Button, Icon } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

interface IProps {
  header?: string;
  onSubmit: (uri: any) => void;
  onCancel: () => void;
}

export function ImagePickerComponent(props: IProps) {
  const [image, setImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Bạn cần cấp quyền cho connectify truy cập thư viện");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setImage(uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setImage(uri);
    }
  };

  return (
    <View
      style={{
        borderWidth: 2,
        borderColor: "#027d6b",
        borderRadius: 15,
        padding: 10,
        backgroundColor: "#0f6357",
      }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: 2,
          marginBottom: 40,
        }}
      >
        <Text
          style={{
            color: "#34edd3",
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          {props.header}
        </Text>
        <Icon name="remember-me" color={"#0a94cf"} />
      </View>

      <View style={GlobalStyle.horizontalButtonGroup}>
        <Button
          title="Chọn ảnh từ thư viện"
          onPress={pickImage}
          buttonStyle={GlobalStyle.smBorderRadius}
        />
        <Button
          title="Chụp ảnh"
          onPress={takePhoto}
          color={"secondary"}
          buttonStyle={GlobalStyle.smBorderRadius}
        />
      </View>

      {image && (
        <View
          style={{
            width: "100%",
            ...GlobalStyle.center,
            marginTop: 20,
          }}
        >
          <Image
            style={{ width: 280, height: 180, borderRadius: 10 }}
            source={{ uri: image }}
          />
        </View>
      )}

      <View style={{ ...GlobalStyle.horizontalButtonGroup, marginTop: 20 }}>
        <Button
          buttonStyle={{
            ...GlobalStyle.xsBorderRadius,
            borderColor: "white",
          }}
          onPress={props.onCancel}
          type="outline"
        >
          <Text style={{ color: "white" }}>Quay lại</Text>
        </Button>
        <Button
          disabled={!image}
          title={"Tiếp tục"}
          buttonStyle={GlobalStyle.xsBorderRadius}
          onPress={() => {
            props.onSubmit(image);
          }}
        />
      </View>
    </View>
  );
}
