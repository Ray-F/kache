/**
 * `Wallet` Value Object.
 */
interface Wallet {
  type: string,
  address: string,
}

/**
 * `User` Entity.
 */
interface User {
  id?: string,
  myobId?: string,
  email: string,
  name: string,
  wallets: Wallet[],

  myobRefreshToken?: string,
}

export {
  Wallet,
  User,
};
