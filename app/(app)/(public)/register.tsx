import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { Interfaces } from "@/data/interfaces/model";
import { Link } from "expo-router";
import { Button, Icon } from "@rneui/themed";

import loginBackground from "@/assets/images/login_bgr.png";
import styles from "./style";
import GlobalStyle from "@/assets/styles/globalStyles";
import { ImagePickerComponent } from "@/components/ImagePicker";

export default function RegisterScreen() {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = (data: Interfaces.IAccount) => {
    setLoading(true);

    setTimeout(() => {
      if (data.username === "tuanht" && data.password === "111111") {
      } else {
        setLoading(false);
      }
    }, 3000);
  };

  const [step, setStep] = useState<number>(0);

  // view functions
  const submitBasicView = () => {
    setLoading(true);
    setTimeout(() => {
      // setError("phoneNumber", {
      //   type: "manual",
      //   message: "Số điện thoại đã tồn tại",
      // });
      // setError("email", {
      //   type: "manual",
      //   message: "Email đã tồn tại",
      // });

      setLoading(false);
      nextStep();
    }, 2000);
  };

  const submitSecurityView = () => {
    nextStep();
  };

  const backStep = () => {
    if (step <= 0) return;
    setStep((prev) => prev - 1);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const basicView = () => {
    return (
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
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email không được bỏ trống",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.email && { borderColor: "red", borderWidth: 1 },
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
          name="displayName"
          rules={{ required: "Tên hiển thị không được bỏ trống" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Tên hiển thị"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.displayName && { borderColor: "red", borderWidth: 1 },
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={{ ...styles.errorTextWrapper, bottom: -40 }}>
          {(errors.phoneNumber?.message ||
            errors.email?.message ||
            errors.displayName?.message) && (
            <Text style={styles.errorText}>
              {errors.phoneNumber?.message?.toString() ||
                errors.email?.message?.toString() ||
                errors.displayName?.message?.toString()}
            </Text>
          )}
        </View>

        <Button
          buttonStyle={GlobalStyle.mdBorderRadius}
          onPress={handleSubmit(submitBasicView)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            "Tiếp tục"
          )}
        </Button>
      </View>
    );
  };

  const securityView = () => {
    return (
      <View style={styles.inputContainer}>
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

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) =>
              value === watch("password") || "Mật khẩu không khớp",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#666"
              style={[
                styles.input,
                errors.confirmPassword && {
                  borderColor: "red",
                  borderWidth: 1,
                },
              ]}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={{ ...styles.errorTextWrapper, bottom: -40 }}>
          {(errors.password?.message || errors.confirmPassword?.message) && (
            <Text style={styles.errorText}>
              {errors.password?.message?.toString() ||
                errors.confirmPassword?.message?.toString()}
            </Text>
          )}
        </View>

        <View style={GlobalStyle.horizontalButtonGroup}>
          <Button
            buttonStyle={{
              ...GlobalStyle.xsBorderRadius,
              borderColor: "white",
            }}
            onPress={backStep}
            type="outline"
          >
            <Text style={{ color: "white" }}>Quay lại</Text>
          </Button>
          <Button
            title={"Tiếp tục"}
            buttonStyle={GlobalStyle.xsBorderRadius}
            onPress={handleSubmit(submitSecurityView)}
          />
        </View>
      </View>
    );
  };

  const [text, setText] = useState("");
  // authentication
  const submitAuthenticationView = async (uri: string) => {};

  const authenticationView = () => {
    return (
      <View>
        <ImagePickerComponent
          header="Chụp ảnh căn cước công dân"
          onCancel={backStep}
          onSubmit={submitAuthenticationView}
        />
      </View>
    );
  };

  const views = [basicView, securityView, authenticationView];
  const CurrentView = views[step];

  return (
    <ImageBackground style={styles.container} source={loginBackground}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.logoTitle}>onnectify</Text>
      </View>

      <CurrentView />

      {step === 0 && (
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <Link href={"/login"}>
            <Text style={styles.linkText}>Đã có tài khoản?</Text>
          </Link>
        </View>
      )}
    </ImageBackground>
  );
}
