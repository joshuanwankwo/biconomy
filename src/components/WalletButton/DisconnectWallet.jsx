import React, { useState } from "react";
import styles from "./wallet-button.module.css";
import { ArrowDown } from "../../assets";
import { useShortAddress } from "../../hooks/useShortAddress";
import { useAppContext } from "../../contexts/appContext";

function DisconnectWalletButton() {
  const { user, handleWalletDisconnect } = useAppContext();

  const shortAddress = useShortAddress(user);

  const [arrowDown, setArrowDown] = useState(true);
  let containerClasses = `${styles["container"]} `;
  if (!arrowDown) containerClasses += `${styles["active"]}`;

  const handleDisconnect = () => {
    handleWalletDisconnect();
  };

  return (
    <div
      onClick={() => setArrowDown(!arrowDown)}
      className={`${containerClasses}`}
    >
      <div className={`${styles["wallet-address-box"]} `}>
        <span className={`${styles["address"]} mr-5`}>{shortAddress}</span>
        <ArrowDown className={`${styles["arrow-down-icon"]}`} />
      </div>
      <button
        onClick={handleDisconnect}
        className={`${styles["disconnect-btn"]} btn`}
      >
        <span>Disconnect</span>
      </button>
    </div>
  );
}

export { DisconnectWalletButton };
