interface CryptoTransaction {
  addressFrom: string,
  addressTo: string,
  amountNzd: number
  feeNzd: number,
  timestamp: number,
}

export {
  CryptoTransaction,
};
