import { User } from '../model/User';
import { UserRepository } from '../infrastructure/UserRepository';

async function onboardNewUser(userRepo: UserRepository,
                              user: User) {
  // Create new user
  await userRepo.save(user);

  // TODO: Create asset and income accounts on MYOB
}


export {
  onboardNewUser,
}
