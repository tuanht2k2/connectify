import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import loginBackground from "@/assets/images/login_bgr.png";

import styles from "./style";
import { useDispatch } from "react-redux";
import { login } from "@/redux/reducers/authSlice";
import { Controller, useForm } from "react-hook-form";
import { Interfaces } from "@/data/interfaces/model";
import { useState } from "react";
import { Link } from "expo-router";

export default function LoginScreen() {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const handleLogin = (data: Interfaces.IAccount) => {
    setLoggingIn(true);

    setTimeout(() => {
      if (data.username === "tuanht" && data.password === "111111")
        dispatch(login({ displayName: "Dinh cong tuan", id: "user1" }));
      else {
        setLoggingIn(false);
        setError("username", {
          type: "manual",
          message: "Sai tên đăng nhập hoặc mật khẩu",
        });
        setError("password", {
          type: "manual",
          message: "Sai tên đăng nhập hoặc mật khẩu",
        });
      }
    }, 3000);
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
          name="username"
          rules={{ required: "Tên đăng nhập không được bỏ trống" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Tên đăng nhập"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.username && { borderColor: "red", borderWidth: 1 },
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
        <View style={styles.errorTextWrapper}>
          {(errors.username?.message || errors.password?.message) && (
            <Text style={styles.errorText}>
              {errors.username?.message?.toString() ||
                errors.password?.message?.toString()}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.button}
        onPress={handleSubmit(handleLogin)}
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
    </ImageBackground>
  );
}
