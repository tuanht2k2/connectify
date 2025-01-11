import { ComponentIntefaces } from "@/constants/component";
import { ResponseInterfaces } from "@/data/interfaces/response";
import { createContext } from "react";

export interface IPublicLayoutContext {
  publicLayoutData: ComponentIntefaces.IPublicLayout | null;
  setPublicLayoutData: (data: ComponentIntefaces.IPublicLayout) => void;
}

const PublicLayoutContext = createContext<IPublicLayoutContext>({
  publicLayoutData: null,
  setPublicLayoutData: () => {},
});

export default PublicLayoutContext;
