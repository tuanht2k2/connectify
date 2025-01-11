import color from "@/assets/styles/color";
import AvatarComponent from "@/components/Avatar";
import IconButtonComponent from "@/components/IconButton";
import MessageComponent from "@/components/Message";
import { Interfaces } from "@/data/interfaces/model";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { RootState } from "@/redux/store";
import CommonService from "@/services/CommonService";
import messageService from "@/services/messageService";
import messengerService from "@/services/messengerService";
import useSocket from "@/utils/useSocket";
import { Icon } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

function MessengerScreen() {
  const { control, getValues, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const currentAccount = useSelector((state: RootState) => state.auth.account);
  const { id } = useLocalSearchParams();

  const [messenger, setMessenger] =
    useState<ResponseInterfaces.IMessengerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigateVideoCall = () => {
    router.push(`/room/${id}`);
  };

  const getData = (id: string) => {
    messengerService
      .get(id)
      .then((res) => {
        const messenger = res.data?.data;
        if (messenger) setMessenger(messenger);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getData(id as string);
  }, []);

  const getMessengerImage = (
    messenger: ResponseInterfaces.IMessengerResponse
  ) => {
    if (messenger.type == "PERSONAL") {
      const another = messenger?.members?.find(
        (member) => member.id !== currentAccount?.id
      );
      return another?.profileImage;
    }
  };

  const getMessengerName = (
    members: Interfaces.IUser[],
    messengerType: "PERSONAL" | "GROUP"
  ) => {
    if (messengerType == "PERSONAL") {
      const another = members.find(
        (member) => member.id !== currentAccount?.id
      );
      return another?.displayName;
    }
    return members.reduce((acc, member) => {
      if (member?.id !== currentAccount?.id)
        return acc + member?.displayName + ", ";
      return acc;
    }, "");
  };

  const content = watch("content");

  const [images, setImages] = useState<string[]>([]);
  const [sendButtonLoading, setSendButtonLoading] = useState<boolean>(false);

  const onSubmit = () => {
    setSendButtonLoading(true);

    const request: RequestInterfaces.IEditMessageRequest = {
      messengerId: id as string,
      ...getValues(),
    };

    messageService
      .create(request)
      .then(() => {
        setValue("content", "");
      })
      .catch((e) => {
        CommonService.showToast("error", "Thất bại", "Đã xảy ra lỗi!");
      })
      .finally(() => {
        setSendButtonLoading(false);
      });
  };

  const [messages, setMessages] = useState<
    ResponseInterfaces.IMessageResponse[] | null
  >();
  const [messageLoading, setMessageLoading] = useState<boolean>(true);

  const handleSocketData = (
    newMessage: ResponseInterfaces.IMessageResponse | null
  ) => {
    if (!newMessage) return;
    setMessages((prev) => (prev ? [...prev, newMessage] : [newMessage]));
  };

  useSocket(`/topic/messengers/${id as string}/messages`, handleSocketData);

  const getMessages = (messengerId: string) => {
    const request: RequestInterfaces.ISearchMessageRequest = { messengerId };

    messageService
      .search(request)
      .then((res) => {
        if (res?.data?.data) setMessages(res?.data?.data);
      })
      .catch(() => {})
      .finally(() => {
        setMessageLoading(false);
      });
  };

  useEffect(() => {
    getMessages(id as string);
  }, []);

  return (
    <View style={{ height: "100%", width: "100%" }}>
      {loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator style={{ marginTop: 20 }} size={30} />
        </View>
      ) : (
        <View style={{}}>
          {messenger?.members && messenger.type && (
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                minHeight: "100%",
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: color.extraLightGrey,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderTopWidth: 1,
                    borderColor: color.primary,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <AvatarComponent
                      imageUrl={getMessengerImage(messenger)}
                      size={35}
                    />
                    <View>
                      <Text style={{ fontWeight: 500, fontSize: 15 }}>
                        {getMessengerName(messenger.members, messenger.type)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: color.grey,
                        }}
                      >
                        Người lạ
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 5,
                    }}
                  >
                    <IconButtonComponent
                      icon="videocam"
                      iconColor={color.primary}
                      size={30}
                      onPress={navigateVideoCall}
                    />
                    <IconButtonComponent
                      icon="info"
                      iconColor={color.primary}
                      size={25}
                    />
                  </View>
                </View>
                <ScrollView
                  style={{
                    paddingHorizontal: 20,
                    maxHeight: Dimensions.get("window").height - 210,
                  }}
                  scrollEnabled
                >
                  {messageLoading && <ActivityIndicator size={30} />}
                  {!messageLoading && !messages && (
                    <View
                      style={{
                        gap: 5,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 30,
                      }}
                    >
                      <Icon name="hourglass-disabled" color={color.grey} />
                      <Text style={{ color: color.grey }}>
                        Chưa có tin nhắn nào
                      </Text>
                    </View>
                  )}
                  {!messageLoading &&
                    messages &&
                    messages.length > 0 &&
                    messages.map((message, index) => {
                      return <MessageComponent key={index} {...message} />;
                    })}
                </ScrollView>
              </View>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 10,
                  padding: 20,
                }}
              >
                <AvatarComponent
                  accountUrl={currentAccount?.id}
                  imageUrl={currentAccount?.profileImage}
                  size={40}
                />
                <Controller
                  control={control}
                  name="content"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Nhập tin nhắn..."
                      placeholderTextColor="#666"
                      style={{
                        flex: 1,
                        backgroundColor: color.extraLightGrey,
                        paddingHorizontal: 20,
                        fontSize: 16,
                        height: "100%",
                        borderRadius: 10,
                      }}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                    />
                  )}
                />
                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                  }}
                  onPress={handleSubmit(onSubmit)}
                  disabled={
                    (!content.trim() && images.length == 0) || sendButtonLoading
                  }
                >
                  {sendButtonLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Icon
                      name="send"
                      color={
                        !content.trim() && images.length == 0
                          ? color.grey
                          : color.primary
                      }
                      size={30}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      )}

      <Toast />
    </View>
  );
}

export default MessengerScreen;
