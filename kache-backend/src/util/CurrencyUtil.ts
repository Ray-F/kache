import { utils } from 'ethers';

function weiToEther(wei): number {
  return parseFloat(utils.formatEther(wei));
}

export {
  weiToEther,
};
