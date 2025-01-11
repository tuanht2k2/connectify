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
import React from "react";

import { Controller, useForm } from "react-hook-form";
import { Interfaces } from "@/data/interfaces/model";
import { Link } from "expo-router";
import { Button, Icon } from "@rneui/themed";

//@ts-ignore
import loginBackground from "@/assets/images/login_bgr.png";
import styles from "./style";
import GlobalStyle from "@/assets/styles/globalStyles";
import { ImagePickerComponent } from "@/components/ImagePicker";
import Toast from "react-native-toast-message";
import authService from "@/services/authService";
import CommonService from "@/services/CommonService";
import { RequestInterfaces } from "@/data/interfaces/request";
import fptAiService from "@/services/fptAiService";
import { Modal } from "react-native";
import color from "@/assets/styles/color";
// import RNTextDetector from "react-native-tesseract-ocr";

interface OCRResult {
  id?: string;
  address?: string;
  dob?: string;
  name?: string;
  sex?: string;
}

export default function RegisterScreen() {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      email: "",
      password: "",
      address: "",
      displayName: "",
      identificationNumber: "",
      gender: "",
      fullName: "",
      dob: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);

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

  const checkValidRegisterInfo = (onSuccess: () => void) => {
    setLoading(true);

    const request: RequestInterfaces.IRegisterRequest = {
      email: getValues("email"),
      phoneNumber: getValues("phoneNumber"),
      identificationNumber: getValues("identificationNumber"),
    };
    return authService
      .checkValidRegisterInfo(request)
      .then((res) => {
        onSuccess();
      })
      .catch((error) => {
        CommonService.showToast(
          "error",
          "Lỗi",
          "Email hoặc Số điện thoại đã được sử dụng!"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const basicView = () => {
    const submitBasicView = () => {
      checkValidRegisterInfo(nextStep);
    };

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

  // const performOCR = async (uri: any) => {
  //   try {
  //     const data: any = await RNTextDetector.recognize(uri, "vie");

  //     if (!data) {
  //       CommonService.showToast(
  //         "success",
  //         "Thành công",
  //         "Xác thực căn cước công dân thành công!"
  //       );
  //       return;
  //     }
  // console.log(data)
  //     setValue("identificationNumber", data.id as string);
  //     setValue("address", data.address as string);
  //     setValue("dob", data.dob as string);
  //     setValue("fullName", data.name as string);
  //     setValue("gender", data.sex as string);
  //     nextStep();
  //   } catch (error) {
  //     CommonService.showToast(
  //       "error",
  //       "Thất bại",
  //       "Ảnh không hợp lệ, hãy chụp lại!"
  //     );
  //   }
  // };

  const authenticationView = () => {
    const submitAuthenticationView = async (uri: string) => {
      setLoading(true);
      const images = await CommonService.uriListToFiles([uri]);

      const request: any = images[0];

      // performOCR(images[0])

      fptAiService
        .identify(request)
        .then((res) => {
          CommonService.showToast(
            "success",
            "Thành công",
            "Xác thực căn cước công dân thành công!"
          );
          showToast();
          const data = res?.data?.data?.[0];
          if (!data) return;
          setValue("identificationNumber", data.id);
          setValue("address", data.address);
          setValue("dob", data.dob);
          setValue("fullName", data.name);
          setValue("gender", data.sex);
          nextStep();
        })
        .catch(() => {
          CommonService.showToast(
            "error",
            "Thất bại",
            "Ảnh không hợp lệ, hãy chụp lại!"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };

    return (
      <View>
        <ImagePickerComponent
          header="Chụp ảnh căn cước công dân"
          onCancel={backStep}
          onSubmit={submitAuthenticationView}
          loading={loading}
        />
      </View>
    );
  };

  const submitFaceMatchView = () => {};

  const faceMatchView = () => {
    return (
      <View>
        <ImagePickerComponent
          header="Chụp ảnh khuôn mặt"
          onCancel={backStep}
          onSubmit={submitFaceMatchView}
          pickDisabled
        />
      </View>
    );
  };

  const confirmView = () => {
    const [confirmViewLoading, setConfirmViewLoading] = useState(false);

    const Field = (props: { label: string; value: string | number }) => {
      return (
        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
          <Text style={{ fontWeight: 500 }}>{props.label} :</Text>
          <Text>{props.value}</Text>
        </View>
      );
    };

    const fields = [
      { label: "Số điện thoại", value: getValues("phoneNumber") },
      { label: "Email", value: getValues("email") },
      { label: "Tên hiển thị", value: getValues("displayName") },
      { label: "Họ tên", value: getValues("fullName") },
      { label: "Giới tính", value: getValues("gender") },
      { label: "Số CCCD", value: getValues("identificationNumber") },
      { label: "Ngày sinh", value: getValues("dob") },
      { label: "Địa chỉ", value: getValues("address") },
    ];

    const submit = () => {
      setConfirmViewLoading(true);

      const request: RequestInterfaces.IRegisterRequest = {
        ...getValues(),
        gender: getValues("gender") == "NAM" ? 0 : 1,
        dob: CommonService.stringToDate(getValues("dob")),
      };
      authService
        .register(request)
        .then(() => {
          CommonService.showToast(
            "success",
            "Thành công",
            "Bạn có thể quay lại trang đăng nhập"
          );
        })
        .catch(() => {
          CommonService.showToast("error", "Lỗi", "CCCD đã được sử dụng!");
        })
        .finally(() => {
          setConfirmViewLoading(false);
        });
    };

    const cancel = () => {
      setStep(2);
    };

    return (
      <Modal visible>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <View style={{ gap: 30 }}>
            <Text style={{ textAlign: "center", fontSize: 20 }}>
              Xác nhận thông tin
              <Icon name="check-circle" size={20} color={color.success} />
            </Text>
            <Image
              source={require("@/assets/images/authentication.png")}
              style={{ height: 100, width: "auto", objectFit: "contain" }}
            />
            <View style={{ height: 1, backgroundColor: color.black }}></View>
            <View>
              {fields.map((field, index) => {
                return (
                  <Field key={index} label={field.label} value={field.value} />
                );
              })}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              marginTop: 45,
            }}
          >
            <Button
              onPress={cancel}
              color={color.danger}
              buttonStyle={{ borderRadius: 10 }}
            >
              Hủy
            </Button>
            <Button
              onPress={submit}
              color={color.primary}
              buttonStyle={{ borderRadius: 10, minWidth: 90 }}
              disabled={loading}
            >
              {confirmViewLoading ? <ActivityIndicator /> : "Xác nhận"}
            </Button>
          </View>
        </View>

        <Toast />
      </Modal>
    );
  };

  const views = [basicView, securityView, authenticationView, confirmView];
  // const views = [authenticationView, confirmView];
  const CurrentView = views[step];

  const showToast = () => {
    const data = {
      id: "042202004399",
      name: "ĐINH CÔNG TUẤN",
      dob: "26/10/2002",
      sex: "NAM",
      nationality: "VIỆT NAM",
      address: "PHÚC TRẠCH, HƯƠNG KHÊ, HÀ TĨNH PHÚC TRẠCH, HƯƠNG KHÊ, HÀ TĨNH",
      expiredDate: "26/10/2027",
    };
    console.log(data);
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

      <Toast />
    </ImageBackground>
  );
}
