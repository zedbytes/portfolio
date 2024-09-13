import { QueryAllBalancesRequest, QueryAllBalancesResponse } from 'cosmjs-types/cosmos/bank/v1beta1/query';
import Long from 'long';

const maxBalances = 1500;
const limit = Long.fromNumber(200);
const key: Uint8Array = new Uint8Array(0);

export type AllBalances = (
  request: QueryAllBalancesRequest
) => Promise<QueryAllBalancesResponse>;

export async function getAllBalances(allBalances: AllBalances, owner: string) {
  const balances = [];
  let offset = Long.ZERO;
  let nextKey: Uint8Array | null = new Uint8Array(0);
  do {
    const res = await allBalances({
      address: owner,
      pagination: {
        countTotal: true,
        key,
        limit: BigInt(limit.toString()),
        offset: BigInt(offset.toString()),
        reverse: false,
      },
    });
    balances.push(...res.balances);
    nextKey = res.pagination?.nextKey as Uint8Array | null;
    offset = offset.add(limit);
    if (offset.greaterThanOrEqual(Long.fromString(res.pagination?.total?.toString() || '0'))) break;
  } while (nextKey !== null && offset.lt(Long.fromNumber(maxBalances)));
  return balances;
}
