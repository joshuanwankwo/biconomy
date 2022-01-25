import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";
import { parseEther } from "ethers/lib/utils";
import { helperAttributes } from "../helpers/erc20ForwarderHelpers";

const tokenAddresses = {
  usdt: "0x8e1084f3599ba90991C3b2f9e25D920738C1496D",
  usdc: "0x6043fD7126e4229d6FcaC388c9E1C8d333CCb8fA",
  dai: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
};

export const connectToMetaMask = async (setError) => {
  try {
    if (!hasEthereum()) return false;

    await window.ethereum.request({ method: "eth_requestAccounts" });

    return true;
  } catch (error) {
    console.log(error);
    if (setError) setError(error.message ?? error.toString());
    return { error };
  }
};

export function getActiveWallet() {
  if (!hasEthereum()) return false;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = signer.provider.provider.selectedAddress;
  return address;
}

export function hasEthereum() {
  return window.ethereum ? true : false;
}

export async function getCurrentNetwork() {
  if (!hasEthereum()) return false;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const network = (await signer.provider._networkPromise).name;
  return network;
}

export function listenToAccountChanges(handler) {
  if (!hasEthereum()) return false;

  window.ethereum.on("accountsChanged", async (accounts) => {
    handler(accounts[0]);
  });
}

export async function unmountEthListeners() {
  window.ethereum.removeListener("accountsChanged", () => {});
  window.ethereum.removeListener("message", () => {});
}

export async function getTokenContract(signer, address) {
  const USDTAbi = await fetch(
    "https://api.etherscan.io/api?module=contract&action=getabi&address=0xdac17f958d2ee523a2206206994597c13d831ec7"
  ).then((r) => r.json());
  try {
    if (!hasEthereum()) return false;
    return new ethers.Contract(address, USDTAbi.result, signer);
  } catch (err) {
    console.log("failed to load contract", err);
  }
}

const getGasPrice = async (networkId) => {
  const apiInfo = `${helperAttributes.baseURL}/api/v1/gas-price?networkId=${networkId}`;
  const response = await fetch(apiInfo);
  const responseJson = await response.json();
  console.log("Response JSON " + JSON.stringify(responseJson));
  return ethers.utils
    .parseUnits(responseJson.gasPrice.value.toString(), "gwei")
    .toString();
};

let daiTokenAddressMap = {},
  biconomyForwarderAddressMap = {},
  oracleAggregatorAddressMap = {},
  erc20ForwarderAddressMap = {};

daiTokenAddressMap[42] = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
biconomyForwarderAddressMap[42] = "0xE8Df44bcaedD41586cE73eB85e409bcaa834497B";
erc20ForwarderAddressMap[42] = "0xbc4de0Fa9734af8DB0fA70A24908Ab48F7c8D75d";
oracleAggregatorAddressMap[42] = "0x6c0F8e37e953e6101168717Ab80CFB5A8D2A2F3E";

export async function findTokenGasPrice(tokenAddress) {
  tokenAddress = tokenAddresses[tokenAddress.toLowerCase()];
  const ethersProvider = ethers.getDefaultProvider(42);
  const gasPrice = ethers.BigNumber.from(await getGasPrice(42));
  const oracleAggregatorAddress = oracleAggregatorAddressMap[42];
  const oracleAggregator = new ethers.Contract(
    oracleAggregatorAddress,
    helperAttributes.oracleAggregatorAbi,
    ethersProvider
  );
  const tokenPrice = await oracleAggregator.getTokenPrice(tokenAddress);
  const tokenOracleDecimals = await oracleAggregator.getTokenOracleDecimals(
    tokenAddress
  );
  return gasPrice
    .mul(ethers.BigNumber.from(10).pow(tokenOracleDecimals))
    .div(tokenPrice)
    .toString();
}

export async function checkIFApproved(tokenAddress) {
  tokenAddress = tokenAddresses[tokenAddress.toLowerCase()];
  if (!hasEthereum()) return false;
  const network = await getCurrentNetwork();
  if (network && !network.includes("kovan")) return false;
  const biconomy = new Biconomy(window.ethereum, {
    apiKey: process.env.REACT_APP_BICONOMY_API_KEY,
    debug: true,
  });
  let ethersProvider = new ethers.providers.Web3Provider(biconomy);
  const signer = ethersProvider.getSigner();
  const address = await getActiveWallet();

  const tokenContract = await getTokenContract(signer, tokenAddress);

  const testContract = "0xbc4de0Fa9734af8DB0fA70A24908Ab48F7c8D75d";
  const approvedAmount = await tokenContract.allowed(testContract, address);
  console.log({ approvedAmount: approvedAmount.toString() });
  return parseInt(approvedAmount.toString()) > 0;
}

export async function approveTokenForSpending(tokenAddress) {
  console.log("approving...");
  tokenAddress = tokenAddresses[tokenAddress.toLowerCase()];
  console.log(tokenAddress);

  if (!hasEthereum()) return false;
  const network = await getCurrentNetwork();
  if (network && !network.includes("kovan")) return false;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const tokenContract = await getTokenContract(signer, tokenAddress);
  const tx = await tokenContract.approve(
    "0xbc4de0Fa9734af8DB0fA70A24908Ab48F7c8D75d",
    parseEther("1").toString()
  );

  const a = await tx.wait();
  console.log(a);
}
