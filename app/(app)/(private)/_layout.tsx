import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { loadAccount, login, logout } from "@/redux/reducers/authSlice";
import accountService from "@/services/accountService";
import { loaded } from "@/redux/reducers/globalSlide";
import Toast from "react-native-toast-message";
import { ResponseInterfaces } from "@/data/interfaces/response";
import CommonService from "@/services/CommonService";
import useSocket from "@/utils/useSocket";
import { RootState } from "@/redux/store";
import { Audio } from "expo-av";

interface ITokenData {
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  jti: string;
  id: string;
}

export default function PrivateLayout() {
  const dispatch = useDispatch();
  const router = useRouter();

  const account = useSelector((state: RootState) => state.auth.account);

  useEffect(() => {
    AsyncStorage.getItem("token")
      .then((token) => {
        console.log(token);
        if (!token) {
          handleLogout();
          return;
        }
        const data: ITokenData = jwtDecode(token);

        accountService
          .getAccount(data?.id)
          .then((res) => {
            const data = res.data?.data;
            dispatch(loadAccount(data));
            dispatch(login());
          })
          .catch(() => {
            handleLogout();
          })
          .finally(() => {
            dispatch(loaded());
          });
      })
      .catch(() => {});

    return () => {};
  }, []);

  const handleLogout = () => {
    AsyncStorage.clear().then(() => {
      dispatch(logout());
      dispatch(loaded());
      router.replace("/login");
    });
  };

  const playNotificationAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/notification_sound.mp3")
    );
    await sound.playAsync();
  };

  const notice = (notification: ResponseInterfaces.INotificationResponse) => {
    CommonService.showToast("error", "Thông báo", notification.message, false);
    playNotificationAudio();
  };

  useSocket(`/topic/${account?.id}/notifications`, notice);

  return (
    <>
      <Stack
        screenOptions={{
          presentation: "card",
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(header-layout)" options={{ headerShown: false }} />
        <Stack.Screen name="(tab-layout)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </>
  );
}
