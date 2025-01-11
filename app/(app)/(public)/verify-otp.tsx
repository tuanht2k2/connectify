import color from "@/assets/styles/color";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { OtpInput } from "react-native-otp-entry";

//@ts-ignore
import otpImg from "@/assets/images/otp_bgr.png";
import otpService from "@/services/otpService";
import { RequestInterfaces } from "@/data/interfaces/request";
import CommonService from "@/services/CommonService";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { useRouter } from "expo-router";
import { Modal } from "react-native";
import usePublicLayout from "@/contexts/publicLayoutContext/usePublicLayout";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/redux/reducers/authSlice";
import ModalComponent from "@/components/Modal";
import Toast from "react-native-toast-message";

function VerifyOtpScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { publicLayoutData, setPublicLayoutData } = usePublicLayout();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [getOtpLoading, setGetOtpLoading] = useState(false);

  const [verifyResponse, setVerifyResponse] =
    useState<ResponseInterfaces.IVerifyOtpResponse | null>(null);

  const verifyOtp = async () => {
    if (!publicLayoutData?.verifyPhoneNumber) return;

    setLoading(true);
    try {
      const request: RequestInterfaces.IVerifyOtpRequest = {
        phoneNumber: publicLayoutData?.verifyPhoneNumber,
        otp,
      };
      const res = await otpService.verifyOtp(request);
      const data: ResponseInterfaces.IVerifyOtpResponse = res.data?.data;
      if (!data) {
        CommonService.showToast("error", "Đã xảy ra lỗi, vui lòng thử lại");
        setLoading(false);
        return;
      }
      setVerifyResponse(data);
      handleVerifyResponse(data);
    } catch (error) {
      CommonService.showToast("info", "Mã OTP không chính xác");
      setLoading(false);
    }
    setLoading(false);
  };

  const getOtp = async () => {
    if (!publicLayoutData?.verifyPhoneNumber) return;
    setGetOtpLoading(true);
    const request: RequestInterfaces.IGetOtpRequest = {
      phoneNumber: publicLayoutData.verifyPhoneNumber,
    };

    try {
      const res = await otpService.getOtp(request);

      const data = res?.data?.data;
      if (!data) {
        CommonService.showToast(
          "error",
          "Bạn đã gửi OTP quá 5 lần",
          "Vui lòng thử lại sau 2 tiếng"
        );
        return;
      }

      setVerifyResponse((prev) => {
        const ver = {
          ...prev,
          remainResent: data.remainResent,
          remainRetried: data.remainRetried,
        };

        return ver;
      });
      CommonService.showToast(
        "info",
        "Gửi OTP thành công",
        "Hãy kiểm tra email mà bạn đã đăng ký"
      );
    } catch (error) {
      CommonService.showToast(
        "error",
        "Bạn đã gửi OTP quá 5 lần",
        "Vui lòng thử lại sau 2 tiếng"
      );
    }
    setGetOtpLoading(false);
  };

  const handleVerifyResponse = async (
    ver: ResponseInterfaces.IVerifyOtpResponse
  ) => {
    if (!ver) return;
    if (!ver.remainResent && !ver.remainRetried) {
      setNotiTitle("Bạn đã gửi lại OTP 5 lần, vui lòng thử lại sau 2 tiếng");
      return;
    }
    if (!ver.correct || !ver.token) {
      console.log("fail", ver);
      CommonService.showToast("info", "Mã OTP không chính xác");
      return;
    }
    setPublicLayoutData({});
    await AsyncStorage.setItem("token", ver.token);
    dispatch(login());
    router.replace("/");
  };

  useEffect(() => {
    if (!publicLayoutData?.verifyPhoneNumber) return;
    // getOtp();
  }, [publicLayoutData]);

  // max retried
  const [notiTitle, setNotiTitle] = useState("");

  return (
    <>
      <Modal transparent statusBarTranslucent visible={getOtpLoading}>
        <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: color.lightOverlay,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={35} />
        </View>
      </Modal>
      <ModalComponent
        showHeader
        title="Thông báo"
        visible={!!notiTitle}
        onClose={() => {
          setNotiTitle("");
        }}
      >
        <Text style={{ margin: 20, fontSize: 15 }}>{notiTitle}</Text>
      </ModalComponent>
      <View
        style={{
          padding: 50,
          backgroundColor: color.white,
          gap: 50,
          height: "100%",
        }}
      >
        <Image source={otpImg} style={{ height: 200, objectFit: "contain" }} />
        <View
          style={{
            gap: 10,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontWeight: 800 }}>Xác thực OTP</Text>
          <OtpInput
            numberOfDigits={6}
            focusColor={color.primary3}
            onTextChange={(value) => {
              setOtp(value);
            }}
            placeholder="******"
          />
          <Text style={{ color: color.grey3, fontWeight: 500 }}>
            Nhập mã OTP được gửi về email bạn đã đăng ký
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                display: "flex",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
                onPress={() => {
                  if (verifyResponse && !verifyResponse.remainResent) {
                    setNotiTitle(
                      "Bạn đã gửi OTP quá 5 lần, vui lòng thử lại sau 2 tiếng"
                    );
                  } else {
                    getOtp();
                  }
                }}
              >
                <Text style={{ color: color.pink3, fontWeight: "bold" }}>
                  Gửi OTP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPublicLayoutData({});
                  router.replace("/login");
                }}
              >
                <Text style={{ color: color.primary3, fontWeight: "bold" }}>
                  Đăng nhập bằng tài khoản khác
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: `${
                otp.length == 6 ? color.primary3 : color.grey3
              }`,
              padding: 10,
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={otp.length != 6}
            onPress={() => {
              if (verifyResponse && !verifyResponse.remainRetried) {
                setNotiTitle(
                  "Bạn đã nhập sai OTP quá 5 lần, vui lòng gửi lại OTP"
                );
              } else {
                verifyOtp();
              }
            }}
          >
            {loading ? (
              <ActivityIndicator color={color.white} />
            ) : (
              <Text style={{ color: color.white, fontWeight: "bold" }}>
                Xác nhận
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </>
  );
}

export default VerifyOtpScreen;
