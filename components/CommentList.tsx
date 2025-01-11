import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { Icon } from "@rneui/themed";
import color from "@/assets/styles/color";
import { Controller, useForm } from "react-hook-form";
import AvatarComponent from "./Avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Toast from "react-native-toast-message";
import { RequestInterfaces } from "@/data/interfaces/request";
import commentService from "@/services/commentService";
import { useRouter } from "expo-router";
import CommentComponent from "./Comment";
import { ResponseInterfaces } from "@/data/interfaces/response";
import useSocket from "@/utils/useSocket";

interface ICommentListComponentProps {
  postId: string;
}

const CommentListComponent = (props: ICommentListComponentProps) => {
  const account = useSelector((state: RootState) => state.auth.account);
  const router = useRouter();

  const [searchRequest, setSearchRequest] =
    useState<RequestInterfaces.ISearchCommentRequest>({
      keyword: "",
      page: 0,
      pageSize: 30,
      sortBy: "created_at",
      sortDir: "ASC",
      postId: props.postId,
    });

  const { control, getValues, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      content: "",
    },
  });
  const content = watch("content");

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [comments, setComments] = useState<any[] | null>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

  const onSubmit = async () => {
    setLoading(true);

    const request: RequestInterfaces.IEditCommentRequest = {
      postId: props.postId,
      ...getValues(),
    };

    commentService
      .create(request)
      .then(() => {
        setValue("content", "");
      })
      .catch((e) => {
        showToast("error", "Thất bại", "Đã xảy ra lỗi!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // toast
  const showToast = (
    type: "success" | "error" | "info",
    text1: string = "",
    text2: string = ""
  ) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
    });
  };

  const handleSocketData = (
    newComment: ResponseInterfaces.ICommentResponse | null
  ) => {
    if (!newComment) return;
    setComments((prev) => (prev ? [...prev, newComment] : [newComment]));
  };

  useSocket(`/topic/posts/${props.postId}/comments`, handleSocketData);

  const getComments = (request: RequestInterfaces.ICommonSearchRequest) => {
    commentService
      .search(request)
      .then((res) => {
        if (res?.data?.data) setComments(res?.data?.data);
      })
      .catch(() => {})
      .finally(() => {
        setCommentsLoading(false);
      });
  };

  useEffect(() => {
    getComments(searchRequest);
  }, [props]);

  return (
    <View style={styles.wrapper}>
      {commentsLoading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size={50} />
        </View>
      ) : (
        <View style={{ height: "100%" }}>
          <ScrollView
            style={{
              paddingTop: 10,
              flex: 1,
              maxHeight: Dimensions.get("window").height - 100,
            }}
            scrollEnabled
          >
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => {
                return (
                  <View key={index} style={{ paddingBottom: 10 }}>
                    <CommentComponent {...comment} />
                  </View>
                );
              })
            ) : (
              <View style={{ marginTop: 40 }}>
                <Text>Chưa có bình luận nào</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.formWrapper}>
            <View style={styles.formComponent}>
              <AvatarComponent
                accountUrl={account?.id}
                imageUrl={account?.profileImage}
                size={40}
              />
              <Controller
                control={control}
                name="content"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Bình luận..."
                    placeholderTextColor="#666"
                    style={[styles.contentInput]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                  />
                )}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
                disabled={(!content.trim() && images.length == 0) || loading}
              >
                {loading ? (
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
        </View>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { height: "100%" },
  formWrapper: {
    paddingVertical: 10,
  },
  formComponent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  contentInput: {
    flex: 1,
    backgroundColor: color.extraLightGrey,
    paddingHorizontal: 20,
    fontSize: 16,
    height: "100%",
    borderRadius: 10,
  },
  button: {
    borderRadius: 20,
  },
  formImageWrapper: {
    position: "relative",
    backgroundColor: color.black,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.black,
    overflow: "hidden",
  },
  formImageRemove: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: color.black,
    borderRadius: 100,
  },
  formImage: {
    height: 100,
    width: 100,
    objectFit: "contain",
  },
});

export default CommentListComponent;
