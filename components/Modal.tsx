import color from "@/assets/styles/color";
import GlobalStyle from "@/assets/styles/globalStyles";
import { Icon } from "@rneui/themed";
import React, { Fragment } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TextStyle,
  Text,
  ImageSourcePropType,
  Image,
} from "react-native";
import { ViewStyle } from "react-native";
import IconButtonComponent from "./IconButton";

interface IProps {
  visible?: boolean;
  animationType?: "fade" | "none" | "slide";
  children: React.ReactNode;
  style?: ViewStyle;
  showHeader?: boolean;
  icon?: string;
  image?: ImageSourcePropType;
  title?: string;
  iconStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  onClose?: () => void; // Callback function to handle modal closing
}

function ModalComponent(props: IProps) {
  const { visible, animationType, onClose, children, style } = props;

  return (
    <Modal
      visible={visible}
      animationType={animationType || "slide"}
      transparent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, style]}>
              {props.showHeader && (
                <View
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingLeft: 15,
                    paddingTop: 10,
                    ...props.headerStyle,
                  }}
                >
                  <View
                    style={{
                      ...GlobalStyle.horizontalFlex,
                      gap: 4,
                      borderBottomWidth: 1,
                      borderColor: color.pink3,
                    }}
                  >
                    {props.icon && (
                      <Icon name={props.icon} color={color.yellow2} />
                    )}
                    {props.image && (
                      <Image
                        source={props.image}
                        style={{ height: 30, width: 30 }}
                      />
                    )}
                    <Text style={{ ...GlobalStyle.mainText, fontSize: 16 }}>
                      {props.title}
                    </Text>
                  </View>
                  <IconButtonComponent icon="close" onPress={onClose} />
                </View>
              )}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: color.transparent,
  },
  modalContent: {
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    borderWidth: 1,
    borderColor: color.pink2,
    width: "100%",
    backgroundColor: color.white1,
    shadowColor: color.yellow2, // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Shadow offset (vertical distance of the shadow)
    shadowOpacity: 0.5, // Shadow opacity for iOS
    shadowRadius: 6, // Blur radius for the shadow on iOS
    elevation: 8, // Shadow effect on Android (higher number = stronger shadow)
  },
});

export default ModalComponent;
