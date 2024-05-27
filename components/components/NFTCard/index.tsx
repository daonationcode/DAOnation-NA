import Card from '../Card';
import Image from 'next/image';
import useEnvironment from '../../../services/useEnvironment';
import { NFT } from '../../../data-model/nft';
import { Button } from '@heathmont/moon-core-tw';
import { ControlsPlus, TimeClock } from '@heathmont/moon-icons-tw';
import { MouseEventHandler } from 'react';

const NFTCard = ({ item, className, onShowBidHistory, onShowPlaceHigherBid, display = false }: { item: NFT; className?: string; onShowBidHistory?: MouseEventHandler; onShowPlaceHigherBid?: MouseEventHandler; display?: boolean }) => {
  const { getCurrency } = useEnvironment();

  return (
    <Card className={`flex max-w-[388px] flex-col !p-6 gap-5 items-center ${className}`}>
      <div className="h-40 w-40 rounded-lg border border-beerus relative overflow-hidden">
        <Image unoptimized={true} src={item.url} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className="text-moon-20">
        <span className="font-bold">Token name </span>
        {item.name}
      </div>
      <div className="text-trunks text-center">{item.description}</div>
      {!display && (
        <>
          <div className="text-center">
            <p>
              Highest bid is{' '}
              <span className="font-bold">
                {getCurrency()} {Number(item.highest_amount) / 1e18}
              </span>
            </p>
            <p>
              by <span className="text-piccolo">{item.highest_bidder.substring(0,10)}...{item.highest_bidder.substring(item.highest_bidder.length - 10, item.highest_bidder.length)}</span>
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full items-center">
            <Button className="w-full max-w-[250px]" iconLeft={<ControlsPlus />} onClick={onShowPlaceHigherBid}>
              Place higher bid
            </Button>
            <Button className="w-full max-w-[250px]" variant="secondary" iconLeft={<TimeClock />} onClick={onShowBidHistory}>
              View bid history
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default NFTCard;
