import React, { useCallback, useEffect, useRef, useState } from "react";
import { RadioBox, Wizard, CloseButton, Button } from "../../components";
import { useAppContext } from "../../contexts/appContext";
import Emitter from "../../services/emitter";
import {
  approveTokenForSpending,
  checkIFApproved,
  findTokenGasPrice,
} from "../../services/web3Service";
import styles from "./minting-modal.module.scss";
import { toast } from "react-toastify";

function MintingModal({ isActive, setIsActive }) {
  const { approveToken } = useAppContext();
  const containerRef = useRef();
  const [containerClass, setContainerClass] = useState(
    `${styles["container"]}`
  );
  const [currentScreen, setCurrentScreen] = useState(1);
  const [transactionFee, setTransactionFee] = useState("0.00");
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [approvalState, setApprovalState] = useState("loading");

  const approveButtonText = (() => {
    if (approvalState === true) return "Continue";
    if (approvalState === false) return "Approve";
    if (approvalState === "loading") return "Loading";
  })();

  const approveToSpend = useCallback(() => {
    if (approvalState === false) {
      try {
        (async () => {
          const isApproved = await approveToken(selectedToken);
          console.log(isApproved);
          setApprovalState(true);
          Emitter.emit("CLOSE_LOADER");
        })();
      } catch (error) {
        Emitter.emit("CLOSE_LOADER");
        // console.log(error);
      }
    }
  }, [approvalState, approveToken, selectedToken]);

  const checkForApproval = useCallback(() => {
    if (approvalState === "loading") {
      try {
        (async () => {
          const isApproved = await checkIFApproved(selectedToken);
          setApprovalState(isApproved);
          if (isApproved)
            toast.success(`You have approved spending for ${selectedToken}`);
          if (isApproved)
            toast.error(`You have not been approved yet for ${selectedToken}`);
        })();
      } catch (error) {
        console.log(error);
      }
    }
  }, [approvalState, selectedToken]);

  const findGasPriceForToken = useCallback(async () => {
    const fee = await findTokenGasPrice(selectedToken);
    setTransactionFee(fee);
    toast.success("Gas Fee was fetched successfully");
  }, [selectedToken]);

  useEffect(() => {
    if (isActive) {
      checkForApproval();
    }
  }, [checkForApproval, isActive]);

  useState(() => {});
  const closeModal = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if (currentScreen === 2) {
      (async () => {
        Emitter.emit("OPEN_LOADER");
        await findGasPriceForToken(selectedToken);
        Emitter.emit("CLOSE_LOADER");
      })();
    }
  }, [currentScreen, findGasPriceForToken, selectedToken]);

  useEffect(() => {
    document.body.style.overflow = isActive ? "hidden" : "auto";
    if (isActive) {
      containerRef.current.style.display = "flex";
      setTimeout(() => {
        setContainerClass((value) => (value += ` ${styles["active"]}`));
      }, 50);
    }
    if (!isActive) {
      document.body.style.overflow = "auto";
      setContainerClass(`${styles["container"]}`);
      setTimeout(() => {
        containerRef.current.style.display = "none";
      }, 400);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isActive, setIsActive]);

  return (
    <div
      // onSubmit={() => alert("submitted")}
      ref={containerRef}
      className={containerClass}
      onClick={closeModal}
    >
      <div
        className={`${styles["modal-body"]} `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <div className="px-5 pt-5 pb-4 absolute top-0 right-0">
            <CloseButton />
          </div>
        </div>
        <p className="mb-3 mt-3 px-5 pt-4 text-xl font-extrabold text-center">
          Select tokens to pay gas fees
        </p>
        <div
          className={`flex gap-x-4 px-5 justify-center mt-7 mb-4 ${styles["token-btns"]}`}
        >
          <button className="flex-1">Ether</button>
          <button className="flex-1">Stable Coins</button>
        </div>
        <div className="p-5">
          <div className={`p-3 ${styles["screens"]}`}>
            {currentScreen === 1 && (
              <div className={`${styles["screen-1"]}`}>
                <div className="my-2 flex gap-x-10 justify-center">
                  <RadioBox
                    name="attending"
                    selectedInput={selectedToken}
                    setSelectedInput={setSelectedToken}
                    options={["USDC", "USDT", "DAI"]}
                  />
                </div>
                <div className="flex justify-center my-5">
                  <Button
                    className={styles[approvalState.toString()]}
                    disabled={!selectedToken}
                    onClick={
                      approvalState === false
                        ? () => {
                            Emitter.emit("OPEN_LOADER");
                            setTimeout(() => {
                              approveToSpend(selectedToken);
                            }, 3000);
                          }
                        : () => setCurrentScreen(2)
                    }
                  >
                    {approveButtonText}
                  </Button>
                </div>
                <p className="text-center">
                  Give approval to Biconomy ERC20 Forwarder so it can deduct
                  transaction fee in selected token.
                </p>
              </div>
            )}
            {currentScreen === 2 && (
              <div className={`${styles["screen-2"]}`}>
                <div className="my-2 flex gap-x-10 justify-center">
                  <RadioBox
                    name="attending"
                    selectedInput={selectedToken}
                    setSelectedInput={setSelectedToken}
                    options={["USDC", "USDT", "DAI"]}
                  />
                </div>
                <p className="text-center">
                  Estimated transaction fee: {transactionFee} {selectedToken}
                </p>
                <div
                  className={`flex gap-x-4 px-5 justify-center mt-7 mb-4 ${styles["token-btns"]}`}
                >
                  <button className="flex-1">Cancel</button>
                  <button
                    onClick={() => toast.success("This is the end of the demo")}
                    className="flex-1"
                  >
                    Proceed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { MintingModal };
