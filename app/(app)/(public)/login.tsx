import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import React from "react";

//@ts-ignore
import loginBackground from "@/assets/images/login_bgr.png";
import styles from "./style";
import Toast from "react-native-toast-message";

import { useDispatch } from "react-redux";
import { login } from "@/redux/reducers/authSlice";
import authService from "@/services/authService";

import CommonService from "@/services/CommonService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePublicLayout from "@/contexts/publicLayoutContext/usePublicLayout";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { setPublicLayoutData } = usePublicLayout();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const onError = (errors: any) => {
    CommonService.showToast(
      "error",
      "Lỗi",
      errors.phoneNumber?.message?.toString() ||
        errors.password?.message?.toString()
    );
  };

  const loginFailed = () => {
    CommonService.showToast(
      "error",
      "Đăng nhập thất bại",
      "Sai tên đăng nhập hoặc mật khẩu"
    );
    setError("phoneNumber", {
      type: "manual",
      message: "Sai tên đăng nhập hoặc mật khẩu",
    });
    setError("password", {
      type: "manual",
      message: "Sai tên đăng nhập hoặc mật khẩu",
    });
  };

  const handleLogin = (request: any) => {
    setLoggingIn(true);

    authService
      .login(request)
      .then((res: any) => {
        const resData = res.data?.data;
        if (!resData.authenticated) {
          loginFailed();
          return;
        }
        if (resData.otpAuthenticated && resData.token) {
          const token = resData?.token;
          AsyncStorage.setItem("token", token);
          setPublicLayoutData({});
          dispatch(login());
          router.replace("/");
          return;
        } else {
          setPublicLayoutData({ verifyPhoneNumber: request.phoneNumber });
          router.push("/verify-otp");
          return;
        }
      })
      .catch((e) => {
        console.log(e);
        loginFailed();
      })
      .finally(() => {
        setLoggingIn(false);
      });
  };

  return (
    <ImageBackground style={styles.container} source={loginBackground}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.logoTitle}>onnectify</Text>
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: "Số điện thoại không được bỏ trống",
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ, phải có 10-11 chữ số",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Số điện thoại"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.phoneNumber && { borderColor: "red", borderWidth: 1 },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Mật khẩu không được bỏ trống",
            minLength: {
              value: 6,
              message: "Mật khẩu phải dài ít nhất 6 ký tự",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.password && { borderColor: "red", borderWidth: 1 },
              ]}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.button}
        onPress={handleSubmit(handleLogin, () => {
          onError(errors);
        })}
        disabled={loggingIn}
      >
        {loggingIn ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <Link href={"/register"}>
          <Text style={styles.linkText}>Đăng ký</Text>
        </Link>
      </View>

      <Toast />
    </ImageBackground>
  );
}
