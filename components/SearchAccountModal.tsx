import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import IconButtonComponent from "./IconButton";
import color from "@/assets/styles/color";
import { Controller } from "react-hook-form";
import { Icon, Input } from "@rneui/themed";
import { useDebouncedCallback } from "use-debounce";
import { RequestInterfaces } from "@/data/interfaces/request";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { Interfaces } from "@/data/interfaces/model";
import { useRouter } from "expo-router";
import accountService from "@/services/accountService";
import AvatarComponent from "./Avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface IProps {
  onOpen: () => void;
  onClose: () => void;
  visible?: boolean;
  // basePath: "/account" | "/messenger";
  onClick: (value: any) => void;
}

function SearchAccountModalComponent(props: IProps) {
  const router = useRouter();
  const currentAccount = useSelector((state: RootState) => state.auth.account);

  const [keyword, setKeyword] = useState<string>("");

  const [request, setRequest] =
    useState<RequestInterfaces.ICommonSearchRequest>({
      page: 0,
      pageSize: 20,
      keyword: "",
      sortBy: "",
      sortDir: "DESC",
    });

  const [accounts, setAccounts] = useState<Interfaces.IUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const debounced = useDebouncedCallback((keyword: string) => {
    if (!keyword) return;
    setRequest((prev) => ({ ...prev, keyword }));
  }, 1000);

  const handleSearch = async (
    request: RequestInterfaces.ICommonSearchRequest
  ) => {
    setLoading(true);
    const res = await accountService.search(request);
    if (!res) {
      setLoading(false);
      return;
    }
    const accounts: Interfaces.IUser[] | null = res?.data?.data;
    if (accounts) setAccounts(accounts);

    setLoading(false);
  };

  useEffect(() => {
    if (!request.keyword) return;
    handleSearch(request);

    return () => {};
  }, [request]);

  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    return () => {};
  }, [inputRef]);

  // const handleNavigation = (id: string | any) => {
  //   if (!id) return;
  //   props.onClose();
  //   router.push(`${props.basePath}/${id}`);
  // };

  return (
    <Modal visible={props.visible} animationType="fade" transparent={false}>
      <View style={{ padding: 10 }}>
        <Input
          ref={inputRef}
          inputStyle={{
            fontSize: 15,
            borderWidth: 0,
            height: 20,
          }}
          value={keyword}
          onChangeText={(value: string) => {
            setKeyword(value);
            debounced(value);
          }}
          placeholder="Tìm kiếm..."
          leftIcon={
            <Icon
              name="arrow-back"
              size={24}
              color={color.primary}
              style={{ marginRight: 10 }}
              onPress={props.onClose}
            />
          }
          rightIcon={
            <Icon
              name="search"
              size={24}
              color={color.primary}
              style={{ marginLeft: 10 }}
            />
          }
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            {accounts && accounts.length > 0 && (
              <View style={{ gap: 5 }}>
                {accounts.map((account, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      disabled={currentAccount?.id == account.id}
                      onPress={() => {
                        props.onClose();
                        props.onClick(account.id);
                      }}
                      style={{
                        padding: 10,
                        backgroundColor: color.lightGrey,
                        borderRadius: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 15,
                      }}
                    >
                      <AvatarComponent imageUrl={account.profileImage} />
                      <Text style={{ fontWeight: 500 }}>
                        {account.displayName}
                      </Text>
                      {currentAccount?.id == account.id && (
                        <Text style={{ fontWeight: 500, color: color.grey }}>
                          ( Bạn)
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {(!accounts || accounts.length == 0) && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="hourglass-disabled" color={color.darkGrey} />
                <Text style={{ color: color.darkGrey }}>
                  Không có kết quả phù hợp
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

export default SearchAccountModalComponent;
