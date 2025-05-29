import React, { PropsWithChildren, ReactNode, Ref } from "react";
import ReactDOM from "react-dom";

interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export const Button = React.forwardRef(
  (
    {
      className,
      style,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active?: boolean;
        reversed?: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>
  ) => {
    const buttonStyle: React.CSSProperties = {
      cursor: "pointer",
      padding: "0 5px",
      color: reversed ? (active ? "white" : "#aaa") : active ? "black" : "#ccc",
      ...style,
    };

    return (
      <span {...props} ref={ref} className={className} style={buttonStyle} />
    );
  }
);

export const Icon = React.forwardRef(
  (
    { className, style, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLSpanElement>
  ) => {
    const iconStyle: React.CSSProperties = {
      fontSize: "24px",
      verticalAlign: "text-bottom",
      ...style,
    };

    return (
      <span
        {...props}
        ref={ref}
        className={className ? `material-icons ${className}` : "material-icons"}
        style={iconStyle}
      />
    );
  }
);

export const Instruction = React.forwardRef(
  (
    { className, style, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => {
    const instructionStyle: React.CSSProperties = {
      whiteSpace: "pre-wrap",
      margin: "0 -20px 10px",
      padding: "10px 20px",
      fontSize: "14px",
      background: "#f8f8e8",
      ...style,
    };

    return (
      <div
        {...props}
        ref={ref}
        className={className}
        style={instructionStyle}
      />
    );
  }
);

export const Menu = React.forwardRef(
  (
    { className, style, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => {
    const menuStyle: React.CSSProperties = {
      ...style,
    };

    const menuChildStyle = `
      .menu-child {
        display: inline-block;
      }
      .menu-child + .menu-child {
        margin-left: 15px;
      }
    `;

    return (
      <>
        <style>{menuChildStyle}</style>
        <div
          {...props}
          data-test-id="menu"
          ref={ref}
          className={className ? `menu ${className}` : "menu"}
          style={menuStyle}
        />
      </>
    );
  }
);

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};

export const Toolbar = React.forwardRef(
  (
    { className, style, ...props }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLDivElement>
  ) => {
    const toolbarStyle: React.CSSProperties = {
      position: "relative",
      padding: "1px 18px 17px",
      margin: "0 -20px",
      borderBottom: "2px solid #eee",
      marginBottom: "20px",
      ...style,
    };

    return (
      <Menu {...props} ref={ref} className={className} style={toolbarStyle} />
    );
  }
);
