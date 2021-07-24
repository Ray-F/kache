import { MongoAdapter } from '../infrastructure/MongoAdapter';
import Config from '../util/Config';
import { User } from './User';
import { UserRepository } from '../infrastructure/UserRepository';
import { TransactionRepository } from '../infrastructure/TransactionRepository';
import { UserTransaction } from './UserTransaction';
import { MyobService } from '../service/MyobService';
import { MyobInvoiceRepository } from '../infrastructure/MyobInvoiceRepository';

const mongoAdapter = MongoAdapter.build(Config.MONGODB_URI, 'kache-dev');

beforeEach(async () => {
  await mongoAdapter.isConnected();
});

test.skip('Create user and save', async () => {
  const userRepo = new UserRepository(mongoAdapter);

  const user: User = {
    email: 'rf.raymondfeng@gmail.com',
    name: 'Raymond Feng',
    wallets: [{
      type: 'ETHEREUM',
      address: Config.DEFAULT_WALLET_ADDRESS,
    }],
  };

  await userRepo.save(user);
});


test.skip('Create transaction and save', async () => {
  const transactionRepo = new TransactionRepository(mongoAdapter);
  const userRepo = new UserRepository(mongoAdapter);

  const user = (await userRepo.list())[0];

  const transaction: UserTransaction = {
    cryptoTransaction: {
      addressFrom: '0x78c115F1c8B7D0804FbDF3CF7995B030c512ee78',
      addressTo: '0xc4B7faE9ea8bEc3F1966Db6c89F404173D5398ea',
      amountNzd: 14322.495595,
      feeNzd: 0.00014322495595,
      timestamp: 1626861116000,
    },
    user: user,
  };
  const savedTransaction = await transactionRepo.save(transaction);

  console.log(savedTransaction);
});

test('Get all addresses', async () => {
  const userRepo = new UserRepository(mongoAdapter);

  console.log(await userRepo.listEthereumAddressesToMonitor());
});

test('Get all transactions from DB and print', async () => {
  const transactionRepo = new TransactionRepository(mongoAdapter);
  console.log(JSON.stringify(await transactionRepo.list(), null, '\t'));
});

test('Get company files', async () => {
  const myobService = new MyobService(Config.MYOB_PUBLIC_KEY, Config.MYOB_PRIVATE_KEY);

  const userRepo = new UserRepository(mongoAdapter);
  const user = (await userRepo.list())[0];

  const tokens = await myobService.refreshAccessToken(user.myobRefreshToken);
  user.myobRefreshToken = tokens.refresh_token;
  await userRepo.save(user);

  const myobInvoiceRepo = new MyobInvoiceRepository(myobService, 'ec8619d9-bb20-4aae-9bbf-1e0e508bb58a');
  console.log(await myobInvoiceRepo.list());
});
