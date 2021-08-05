interface CryptoTransaction {
  addressFrom: string,
  addressTo: string,
  amountEther: number,
  feeEther: number,
  amountNzd: number,
  feeNzd: number,
  timestamp: number,
}

export {
  CryptoTransaction,
};
