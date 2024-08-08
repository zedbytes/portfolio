import { Platform } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { mineIdl } from './mineIdl';

export const platformId = 'quarry';
export const platform: Platform = {
  id: platformId,
  name: 'Quarry',
  image: 'https://sonar.watch/img/platforms/quarry.webp',
  website: 'https://app.quarry.so/',
  // twitter: 'https://x.com/QuarryProtocol',
  defiLlamaId: 'quarry', // from https://defillama.com/docs/api
};
export const rewardersCacheKey = `rewarders`;
export const rewardersUrl = `https://cdn.jsdelivr.net/gh/QuarryProtocol/rewarder-list-build@master/mainnet-beta/all-rewarders-with-info.json`;
export const mergeMineProgramId = new PublicKey(
  'QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto'
);
export const mineProgramId = new PublicKey(
  'QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB'
);

export const mineIdlItem = {
  programId: mineProgramId.toString(),
  idl: mineIdl,
  idlType: 'anchor',
} as IdlItem;
