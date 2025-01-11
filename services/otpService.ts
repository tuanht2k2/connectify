import { RequestInterfaces } from "@/data/interfaces/request";
import { ApiInstance, getApiConfig } from "./axios";
import { AUTH_URL } from "./url";

const otpService = {
  async getOtp(request: RequestInterfaces.IGetOtpRequest) {
    try {
      return ApiInstance.post(AUTH_URL.GET_OTP, request);
    } catch (error) {
      throw error;
    }
  },
  async verifyOtp(request: RequestInterfaces.IVerifyOtpRequest) {
    try {
      return ApiInstance.post(`${AUTH_URL.VERIFY_OTP}`, request);
    } catch (error) {
      throw error;
    }
  },
};

export default otpService;
