import { User } from '../model/User';
import { UserRepository } from '../infrastructure/UserRepository';
import { MyobLedgerRepository } from '../infrastructure/MyobLedgerRepository';

/**
 * Onboards a new user by creating an asset account on MYOB and in the future, sending them a welcome email.
 */
async function onboardNewUser(userRepo: UserRepository,
                              myobLedgerRepo: MyobLedgerRepository,
                              user: User) {
  await userRepo.save(user);

  // Save the asset account UID to the user object in the DB
  user.kacheAssetAccountMyobId = await myobLedgerRepo.createCryptoAccount();

  // TODO: Send user a welcome email

  // Save the user twice, as its possible for the MYOB service gateway to timeout.
  await userRepo.save(user);
}


export {
  onboardNewUser,
}
