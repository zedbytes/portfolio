import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import {
  checkIfAccountParser,
  ParserType,
  SolanaFMParser,
} from '@solanafm/explorer-kit';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { getProgramAccounts } from './getProgramAccounts';
import { ParsedAccount } from './types';

export async function getAutoParsedProgramAccounts<T>(
  connection: Connection,
  idlItem: IdlItem,
  filters: GetProgramAccountsFilter[] | undefined = undefined,
  maxAccounts = -1
) {
  const parser = new SolanaFMParser(idlItem, idlItem.programId.toString());
  const eventParser = parser.createParser(ParserType.ACCOUNT);

  if (!eventParser || !checkIfAccountParser(eventParser)) return [];

  const accountsRes = await getProgramAccounts(
    connection,
    new PublicKey(idlItem.programId),
    filters,
    maxAccounts
  );
  return accountsRes
    .map((accountRes) => {
      const parsedAccount = eventParser.parseAccount(
        accountRes.account.data.toString('base64')
      );
      if (!parsedAccount) return null;
      return {
        pubkey: accountRes.pubkey,
        lamports: accountRes.account.lamports,
        ...(parsedAccount.data as T),
      };
    })
    .filter((acc): acc is ParsedAccount<T> => acc !== null);
}
