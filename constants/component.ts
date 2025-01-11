export namespace ComponentIntefaces {
  export interface IActionDialog {
    isVisible?: boolean;
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }

  export interface IDropdownOption<T> {
    name: string;
    code: T;
    icon?: string;
  }

  export interface IPublicLayout {
    verifyPhoneNumber?: string;
  }
}
