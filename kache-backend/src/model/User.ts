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
  name: string,
  wallets: Wallet[]
}

export {
  Wallet,
  User,
};
