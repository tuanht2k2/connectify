declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.jpeg" {
  const value: any;
  export default value;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "@zegocloud/zego-uikit-prebuilt-call-rn" {
  const ZegoUIKitPrebuiltCallRN: any;
  export default ZegoUIKitPrebuiltCallRN;
}

declare module "react-native-tesseract-ocr" {
  export interface OCRConfig {
    whitelist?: string; // Optional: Specify allowed characters
    blacklist?: string; // Optional: Specify disallowed characters
  }

  /**
   * Recognize text in an image.
   * @param imagePath - Path to the image file.
   * @param lang - Language code (e.g., 'eng', 'vie').
   * @param config - Optional configuration for OCR.
   * @returns A Promise that resolves to the recognized text.
   */
  export function recognize(
    imagePath: string,
    lang: string,
    config?: OCRConfig
  ): Promise<string>;
}

declare global {
  interface Window {
    RTCPeerConnection: typeof RTCPeerConnection;
    RTCSessionDescription: typeof RTCSessionDescription;
    RTCIceCandidate: typeof RTCIceCandidate;
  }
}

export {};
