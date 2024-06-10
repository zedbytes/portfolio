import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import {
  checkIfAccountParser,
  Parser,
  ParserType,
  SolanaFMParser,
} from '@solanafm/explorer-kit';
import { IdlItem } from '@solanafm/explorer-kit-idls';
import { getProgramAccounts } from './getProgramAccounts';
import { ParsedAccount } from './types';

const parseAccount = (eventParser: Parser, accountData: string) => {
  if (eventParser && checkIfAccountParser(eventParser)) {
    return eventParser.parseAccount(accountData);
  }
  return null;
};

export async function getAutoParsedProgramAccounts<T>(
  connection: Connection,
  idlItem: IdlItem,
  filters: GetProgramAccountsFilter[] | undefined = undefined,
  maxAccounts = -1
) {
  const parser = new SolanaFMParser(idlItem, idlItem.programId.toString());
  const eventParser = parser.createParser(ParserType.ACCOUNT);

  const accountsRes = await getProgramAccounts(
    connection,
    new PublicKey(idlItem.programId),
    filters,
    maxAccounts
  );
  return accountsRes.map((accountRes) => {
    const parsedAccount = parseAccount(
      eventParser,
      accountRes.account.data.toString('base64')
    );

    return {
      pubkey: accountRes.pubkey,
      lamports: accountRes.account.lamports,
      ...parsedAccount?.data,
    } as ParsedAccount<T>;
  });
}
