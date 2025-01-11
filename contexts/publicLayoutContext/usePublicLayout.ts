import { useContext } from "react";
import PublicLayoutContext, {
  IPublicLayoutContext,
} from "./publicLayoutContext";

const usePublicLayout = (): IPublicLayoutContext => {
  return useContext(PublicLayoutContext);
};

export default usePublicLayout;
