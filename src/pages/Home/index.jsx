import React, { useState } from "react";
import { Button, Header, MintingModal } from "../../components";
import { useAppContext } from "../../contexts/appContext";
import styles from "./home.module.scss";

function Home() {
  // const { USDTData, transactions } = useAppContext();
  const { isConnected } = useAppContext();
  const [isDisplayingModal, setIsDisplayingModal] = useState(false);

  return (
    <div className="">
      <MintingModal
        isActive={isDisplayingModal}
        setIsActive={setIsDisplayingModal}
      />
      <Header />
      <div className={`${styles["container"]} `}>
        <main className={`h-12/12`}>
          <section className="container ">
            <div className="">
              <h1 className="">
                <span>BICO</span>
                <span>APES</span>
              </h1>
              <h2 className="pb-5">
                Please connect your wallet to estimate the gas fees required to
                get yourself a BICO Ape!
              </h2>
              <div className={`${styles["get-started"]}`}>
                <Button onClick={() => setIsDisplayingModal(true)}>
                  Get Started!
                </Button>
              </div>
            </div>
            <div></div>
          </section>
        </main>
      </div>
    </div>
  );
}

export { Home };
