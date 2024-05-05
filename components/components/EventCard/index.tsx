import Image from 'next/legacy/image';
import Card from '../Card';
import { ArrowsRightShort, ShopWallet, SportDarts } from '@heathmont/moon-icons-tw';
import { MouseEventHandler, useState } from 'react';
import useEnvironment from '../../../services/useEnvironment';
import { CharityEvent } from '../../../data-model/event';
import Link from 'next/link';
import { Button } from '@heathmont/moon-core-tw';

const EventCard = ({ item, className = '', onClickDonate }: { item: CharityEvent; className?: string; onClickDonate?: MouseEventHandler }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const { getCurrency } = useEnvironment();

  return (
    <Card className={`max-w-[720px] ${className}`}>
      <div className="flex w-full">
        <div className="rounded-moon-s-md overflow-hidden flex justify-center items-center border border-beerus" style={{ position: 'relative', width: '188px', minWidth: '188px', height: '188px' }}>
          {<Image unoptimized={true} layout="fill" objectFit="cover" src={item.imageUrl} onError={() => setShowPlaceholder(true)} alt="" />}
          {showPlaceholder && <SportDarts className="text-moon-48 text-trunks" />}
        </div>
        <div className="flex flex-1 flex-col gap-2 relative px-5 text-moon-16">
          <p className="font-semibold text-moon-18">{item.title}</p>
          <div>
            <p className="font-semibold text-moon-20 text-hit">
              {getCurrency()} {item?.raised?.toString()}
            </p>
            <p>
              reached of {getCurrency()} {item.target} goal
            </p>
          </div>
          <div>
            <p className="font-semibold text-moon-20 text-hit">{item?.amountOfNFTs}</p>
            <p>NFTs</p>
          </div>
          <div className="absolute bottom-0 right-0 flex gap-2">
            <Button variant="secondary" iconLeft={<ShopWallet />} onClick={onClickDonate}>
              Donate
            </Button>
            <Link href={`${location.pathname}/event/${item.id}`}>
              <Button iconLeft={<ArrowsRightShort />}>Go to event</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;