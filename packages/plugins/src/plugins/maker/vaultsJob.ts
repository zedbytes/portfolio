import { NetworkId } from '@sonarwatch/portfolio-core';
import { ilkRegAddress, ilksPrefix, platformId, vatAddress } from './constants';
import { Cache } from '../../Cache';
import { Job, JobExecutor } from '../../Job';
import { getEvmClient } from '../../utils/clients';
import { ilkRegAbi, vatAbi } from './abis';
import { IlkData } from './type';

const executor: JobExecutor = async (cache: Cache) => {
  const client = getEvmClient(NetworkId.ethereum);
  const ilkList = await client.readContract({
    abi: ilkRegAbi,
    address: ilkRegAddress,
    functionName: 'list',
  });

  const ilkDataResults = await client.multicall({
    contracts: ilkList.map((ilk) => ({
      abi: ilkRegAbi,
      address: ilkRegAddress as `0x${string}`,

      functionName: 'ilkData',
      args: [ilk],
    })),
  });

  const vatIlkDataResults = await client.multicall({
    contracts: ilkList.map((ilk) => ({
      abi: vatAbi,
      address: vatAddress as `0x${string}`,

      functionName: 'ilks',
      args: [ilk],
    })),
  });

  const ilks = ilkDataResults.reduce((acc: IlkData[], ilkDataResult, index) => {
    const vatIlkDataResult = vatIlkDataResults[index];
    if (
      ilkDataResult.status === 'failure' ||
      !vatIlkDataResult ||
      vatIlkDataResult.status === 'failure'
    )
      return acc;

    const result = ilkDataResult.result as [string, string, string, string, string, string, string, string, string];
    acc.push({
      id: ilkList[index],
      pos: Number(BigInt((ilkDataResult.result as readonly string[])[0])),
      join: (ilkDataResult.result as readonly string[])[1],
      gem: result[2],
      dec: Number(result[3]),
      class: Number(result[4]),
      pip: result[5],
      xlip: result[6],
      name: result[7],
      symbol: result[8],
      art: (vatIlkDataResult.result as unknown as [bigint, bigint, bigint, bigint, bigint])[0].toString(),
      rate: (vatIlkDataResult.result as unknown as [bigint, bigint, bigint, bigint, bigint])[1].toString(),
      spot: (vatIlkDataResult.result as unknown as [bigint, bigint, bigint, bigint, bigint])[2].toString(),
      line: (vatIlkDataResult.result as unknown as [bigint, bigint, bigint, bigint, bigint])[3].toString(),
      dust: (vatIlkDataResult.result as unknown as [bigint, bigint, bigint, bigint, bigint])[4].toString(),
    });
    return acc;
  }, []);

  const gemTokenPrices = await cache.getTokenPrices(
    ilks.map((ilk) => ilk.gem),
    NetworkId.ethereum
  );
  gemTokenPrices.forEach((gemTokenPrice, i) => {
    ilks[i].gemTokenPrice = gemTokenPrice;
  });
  await cache.setItem(ilksPrefix, ilks, {
    prefix: ilksPrefix,
    networkId: NetworkId.ethereum,
  });
};

const job: Job = {
  id: `${platformId}-vaults`,
  executor,
  label: 'normal',
};
export default job;
