import { PortfolioAsset, PortfolioAssetType } from '../Portfolio';
import { TokenInfo } from '../TokenList';

export function getLabelFromAsset(
  asset: PortfolioAsset,
  tokenInfo?: TokenInfo
): string | undefined {
  switch (asset.type) {
    case PortfolioAssetType.collectible:
      return asset.data.name;
    case PortfolioAssetType.token:
      return asset.name || tokenInfo?.symbol || 'UNK';
    case PortfolioAssetType.generic:
      return asset.name || asset.data.name;
    default:
      return undefined;
  }
}
