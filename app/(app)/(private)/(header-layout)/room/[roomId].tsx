import color from "@/assets/styles/color";

import IconButtonComponent from "@/components/IconButton";
import { Interfaces } from "@/data/interfaces/model";
import { RootState } from "@/redux/store";

import getSocketClient from "@/utils/getSocketClient";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ImageBackground, Modal, Text } from "react-native";
import { View } from "react-native";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";
import { useSelector } from "react-redux";
import Stomp from "stompjs";

// @ts-ignore
import disconnectIcon from "@/assets/images/icons/disconnect.png";
// @ts-ignore
import noDataFoundImage from "@/assets/images/no_data_found.png";
import Button from "@/components/Button";
import roomService from "@/services/roomService";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function RoomScreen() {
  const { roomId } = useLocalSearchParams();
  const account = useSelector((state: RootState) => state.auth.account);

  const [localStream, setLocalStream] = useState<any | null>(null);
  const [remoteStream, setRemoteStream] = useState<any | null>(null);
  const localPCRef = useRef<RTCPeerConnection | null>(null);
  const socketClientRef = useRef<Stomp.Client | null>(null);

  useEffect(() => {
    startLocalStream();
  }, []);

  const startLocalStream = async () => {
    try {
      const isFront = true;
      const devices: MediaDeviceInfo[] =
        (await mediaDevices.enumerateDevices()) as MediaDeviceInfo[];

      const facing = isFront ? "front" : "environment";
      const videoSourceId = devices.find(
        (device) =>
          device.kind === "videoinput" &&
          device.label.toLowerCase().includes(facing.toLowerCase())
      );
      const facingMode = isFront ? "user" : "environment";
      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500,
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode,
          optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
        },
      };
      const newStream = await mediaDevices.getUserMedia(constraints);
      setLocalStream(newStream);
    } catch (error) {
      console.error("Lỗi khi khởi tạo local stream:", error);
    }
  };

  const handleAnswer = async (data: Interfaces.IWebRTC) => {
    if (
      !data.sdp ||
      !localPCRef.current ||
      localPCRef.current.signalingState !== "have-local-offer"
    ) {
      return;
    }

    try {
      const rtcSessionDescription = new RTCSessionDescription({
        type: "answer",
        sdp: data.sdp,
      });
      await localPCRef.current.setRemoteDescription(rtcSessionDescription);
    } catch (error) {
      console.error("Lỗi khi xử lý answer:", error);
    }
  };

  const handleOffer = async (data: Interfaces.IWebRTC) => {
    if (!socketClientRef.current) {
      return;
    }
    if (!data.sdp || !localPCRef.current) {
      return;
    }
    if (localPCRef.current.signalingState === "have-local-offer") return;
    try {
      const rtcSessionDescription = new RTCSessionDescription({
        type: "offer",
        sdp: data.sdp,
      });
      await localPCRef.current.setRemoteDescription(rtcSessionDescription);
      const answer = await localPCRef.current.createAnswer();
      await localPCRef.current.setLocalDescription(answer);

      const answerData: Interfaces.IWebRTC = {
        roomId: data.roomId,
        type: "answer",
        sdp: localPCRef.current.localDescription?.sdp,
      };

      roomService.sendWebRTCData(answerData, socketClientRef.current);
    } catch (error) {
      console.error("Lỗi xử lý offer:", error);
    }
  };

  const handleCandidate = (data: Interfaces.IWebRTC) => {
    if (data.sdpMLineIndex === null && data.sdpMid === null) return;

    if (!localPCRef.current?.remoteDescription) {
      return;
    }
    try {
      const rtcIceCandidate = new RTCIceCandidate({
        candidate: data.candidate,
        sdpMid: data.sdpMid,
        sdpMLineIndex: data.sdpMLineIndex,
      });
      localPCRef.current?.addIceCandidate(rtcIceCandidate);
    } catch (error) {
      console.error("Lỗi khi xử lý candidate:", error);
    }
  };

  const handleWebRTCData = (data: Interfaces.IWebRTC) => {
    switch (data.type) {
      case "answer":
        handleAnswer(data);
        break;
      case "offer":
        handleOffer(data);
        break;
      case "candidate":
        handleCandidate(data);
        break;
      default:
        return;
    }
  };

  const setUpPeerConnection = async () => {
    try {
      const localPC = new RTCPeerConnection(configuration);

      localStream?.getTracks().forEach((track: any) => {
        localPC.addTrack(track, localStream);
      });

      localPC.addEventListener("track", (e: any) => {
        const newStream = new MediaStream();
        e.streams[0]?.getTracks().forEach((track: any) => {
          newStream.addTrack(track);
        });
        setRemoteStream(newStream);
      });

      localPC.addEventListener("icecandidate", (e) => {
        if (e.candidate) {
          const candidateData: Interfaces.IWebRTC = {
            roomId: roomId as string,
            type: "candidate",
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid || "",
            sdpMLineIndex: e.candidate.sdpMLineIndex || 0,
          };
          if (!socketClientRef.current) return;
          roomService.sendWebRTCData(candidateData, socketClientRef.current);
        }
      });
      localPC.addEventListener("iceconnectionstatechange", () => {
        console.log("ICE Connection State:", localPC.iceConnectionState);
        if (localPC.iceConnectionState === "connected") {
          console.log("P2P connection successful!");
        } else if (localPC.iceConnectionState === "failed") {
          console.error("P2P connection failed.");
        }
      });

      localPCRef.current = localPC;
    } catch (error) {
      console.error("Lỗi khi tạo peer connection:", error);
    }
  };

  const startCall = async () => {
    if (!socketClientRef.current) return;
    if (!localPCRef.current) {
      console.error("Khong co local ref");
      return;
    }

    try {
      const offer = await localPCRef.current.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      });
      await localPCRef.current.setLocalDescription(offer);

      const offerData: Interfaces.IWebRTC = {
        roomId: roomId as string,
        type: "offer",
        sdp: offer.sdp,
      };

      roomService.sendWebRTCData(offerData, socketClientRef.current);
    } catch (error) {
      console.error("Lỗi khi tạo peer connection:", error);
    }
  };

  useEffect(() => {
    if (!socketClientRef.current) return;
    setUpPeerConnection();
  }, [socketClientRef.current]);

  useEffect(() => {
    const socketClient = getSocketClient();
    const topic = `/topic/rooms/${roomId}/video-call`;
    socketClient.connect(
      {},
      () => {
        socketClient.subscribe(topic, (message) => {
          const data = JSON.parse(message.body);
          handleWebRTCData(data);
        });
      },
      (error) => {
        console.error("Error connecting to WebSocket", error);
      }
    );
    socketClientRef.current = socketClient;

    return () => {
      if (socketClient.connected)
        socketClient.disconnect(() => {
          console.log("Web socket disconnected");
        });
    };
  }, []);

  // video call action view
  const [videoCallActionVisible, setVideoCallActionVisible] =
    useState<boolean>(false);

  const toggleVideoCallActionVisible = () => {
    setVideoCallActionVisible((prev) => !prev);
  };

  const VideoCallActionView = () => {
    return (
      <Modal
        visible={videoCallActionVisible}
        animationType="slide"
        transparent
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 10,
              width: "100%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: color.yellow1,
              paddingVertical: 40,
              paddingHorizontal: 15,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* <IconButtonComponent color={color.blue1} image={disconnectIcon} /> */}
              <IconButtonComponent
                icon="switch-camera"
                iconColor={color.white1}
                color={color.blue1}
              />
              <IconButtonComponent
                icon="brush"
                iconColor={color.white1}
                color={color.blue1}
              />
              <IconButtonComponent
                icon="wifi-calling"
                onPress={startCall}
                iconColor={color.blue1}
              />
            </View>
            <IconButtonComponent
              icon="close"
              onPress={toggleVideoCallActionVisible}
              iconColor={color.blue1}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ImageBackground
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: "100%",
        width: "100%",
      }}
      source={noDataFoundImage}
    >
      {remoteStream && (
        <View
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            // backgroundColor: color.,
          }}
        >
          <RTCView
            streamURL={remoteStream.toURL()}
            objectFit="cover"
            style={{ height: "100%", width: "100%" }}
          />
          <View
            style={{
              position: "absolute",
              height: 110,
              width: 100,
              top: 10,
              right: 10,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <RTCView
              streamURL={localStream.toURL()}
              objectFit="cover"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 15,
              }}
            />
          </View>
          <View style={{ position: "absolute", bottom: 30, right: 10 }}>
            <IconButtonComponent
              icon="add"
              color={color.primary}
              iconColor={color.warning}
              onPress={toggleVideoCallActionVisible}
            />
            <VideoCallActionView />
          </View>
        </View>
      )}
      {!remoteStream && (
        <View style={{ gap: 10 }}>
          <Text style={{ color: color.primary, fontSize: 17 }}>
            Bắt đầu cuộc trò chuyện ngay
          </Text>
          <Button title="Bắt đầu" onClick={startCall} />
        </View>
      )}
      {/* <View style={{ gap: 10 }}>
        <Text style={{ color: color.blue1, fontSize: 17 }}>
          Bắt đầu cuộc trò chuyện ngay
        </Text>
        <Button title="Bắt đầu" onClick={startCall} />
      </View> */}
    </ImageBackground>
  );
}

export default RoomScreen;
