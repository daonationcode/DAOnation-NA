import Card from '../../components/components/Card';
import NFTCard from '../../components/components/NFTCard';
import { NFT } from '../../data-model/nft';

const CollectiblesPanel = () => {
  const mockNFTs: NFT[] = [
    {
      id: '',
      url: 'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
      name: 'NFT LSP9',
      highestBid: { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' },
      bidHistory: [
        { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Bert Bono', walletAddress: 'wallet-address-1' },
        { date: '19 Nov 2022 01:15PM', bidAmount: 19, bidder: 'Barry Bono', walletAddress: 'wallet-address-2' },
        { date: '18 Nov 2022 01:15PM', bidAmount: 18, bidder: 'Bevin Bono', walletAddress: 'wallet-address-3' }
      ],
      description: 'A description about the token and why its worth bidding for.'
    },
    {
      id: '',
      url: 'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
      name: 'NFT LSP9',
      highestBid: { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' },
      bidHistory: [{ date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' }],
      description: 'A description about the token and why its worth bidding for.'
    },
    {
      id: '',
      url: 'https://marketplace.canva.com/EAFG5wKTkFk/1/0/1131w/canva-pastel-food-drive-a4-flyer-tBm19VC3AKU.jpg',
      name: 'NFT LSP9',
      highestBid: { date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' },
      bidHistory: [{ date: '20 Nov 2022 01:15PM', bidAmount: 20, bidder: 'Barry Bono', walletAddress: 'wallet-address' }],
      description: 'A description about the token and why its worth bidding for.'
    }
  ];

  return (
    <Card>
      <div className="w-full flex flex-wrap gap-6">{mockNFTs && mockNFTs.length > 0 ? mockNFTs.map((nft, i) => <NFTCard className="!w-2/4 !max-w-[364px] border-beerus border !shadow-none" item={nft} key={i} display={true} />) : <>You don't have activity yet</>}</div>
    </Card>
  );
};

export default CollectiblesPanel;
