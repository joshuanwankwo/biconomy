import React from "react";
import { Button } from "..";
import { CloseIcon } from "../../assets";
import { PrimaryButton } from "../Button/primaryButton";
import styles from "./modal.module.scss";

function Modal() {
  return (
    <div className={styles.modal}>
      <div className={styles.inner__modal}>
        <CloseIcon className={styles.close__Btn} />
        <h1>Select tokens to pay gas fees</h1>
        <span className={styles.button__holder}>
          <PrimaryButton text="Ether" />
          <PrimaryButton text="Stable Coins" />
        </span>
        <div className={styles.inner__smaller__con}>
          <span>
            <input type="radio" name="USDC" id="USDC" />
            <label>USDC</label>
            <input type="radio" name="USDT" id="USDT" />
            <label>USDT</label>
            <input type="radio" name="DAI" id="DAI" />
            <label>DAI</label>
          </span>
          <h4>Estimated gas fee: 30 USDC</h4>
          <span className={styles.button__holder}>
            <PrimaryButton text="Cancel" bgColor="#000" />
            <PrimaryButton text="Continue" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Modal;
