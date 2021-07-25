import { User } from '../model/User';
import { UserRepository } from '../infrastructure/UserRepository';
import { MyobLedgerRepository } from '../infrastructure/MyobLedgerRepository';

/**
 * Onboards a new user by creating an asset account on MYOB and in the future, sending them a welcome email.
 */
async function onboardNewUser(userRepo: UserRepository,
                              myobLedgerRepo: MyobLedgerRepository,
                              user: User) {
  // Save the asset account UID to the user object in the DB
  user.kacheAssetAccountMyobId = await myobLedgerRepo.createCryptoAccount();
  await userRepo.save(user);

  // TODO: Send user a welcome email
}


export {
  onboardNewUser,
}
