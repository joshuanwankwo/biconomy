import React from "react";
import styles from "./button.module.css";

function PrimaryButton({
  text,
  children,
  className,
  onClick,
  bgColor,
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      className={styles.primary__button}
      {...rest}
      style={{ backgroundColor: bgColor }}
    >
      {text || children}
    </button>
  );
}

export { PrimaryButton };
