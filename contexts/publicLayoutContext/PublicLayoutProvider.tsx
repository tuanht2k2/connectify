import React, { useEffect, useState } from "react";
import PublicLayoutContext, {
  IPublicLayoutContext,
} from "./publicLayoutContext";
import { ComponentIntefaces } from "@/constants/component";

interface IProps {
  children: React.ReactNode;
}

function PublicLayoutProvider(props: IProps) {
  const [publicLayoutData, setPublicLayoutData] =
    useState<ComponentIntefaces.IPublicLayout>({
      verifyPhoneNumber: "",
    });

  return (
    <PublicLayoutContext.Provider
      value={{ publicLayoutData, setPublicLayoutData }}
    >
      {props.children}
    </PublicLayoutContext.Provider>
  );
}

export default PublicLayoutProvider;
