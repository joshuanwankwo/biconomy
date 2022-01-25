import React from "react";
import { WalletButton } from "../index";
import Logo from "../../assets/images/logo.png";

import styles from "./header.module.scss";

function Header(props) {
  return (
    <header className={`${styles.container} container py-4`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={Logo} alt="" className={`pr-3 ${styles.logo}`} />
          <span className={styles.name}>$BICO</span>
        </div>
        <div className="flex justify-between">
          <div className="">
            <WalletButton />
          </div>
          
        </div>
      </div>
    </header>
  );
}

export { Header };
