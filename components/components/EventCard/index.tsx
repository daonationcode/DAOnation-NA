import Image from 'next/legacy/image';
import Card from '../Card';
import { ArrowsRightShort, GenericLoyalty, ShopWallet, SportDarts } from '@heathmont/moon-icons-tw';
import { MouseEventHandler, useState } from 'react';
import useEnvironment from '../../../services/useEnvironment';
import { CharityEvent } from '../../../data-model/event';
import Link from 'next/link';
import { Button } from '@heathmont/moon-core-tw';
import { useRouter } from 'next/router';

const EventCard = ({ item, className = '', openDonateCoinModal, openDonateNFTModal }: { item: CharityEvent; className?: string; openDonateCoinModal?: (eventid, eventName, eventWallet) => {}; openDonateNFTModal?: (eventid, eventName, eventWallet) => {} }) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const router = useRouter();
  const { getCurrency } = useEnvironment();

  return (
    <Card className={`max-w-[720px] ${className}`}>
      <div className="flex w-full">
        <div className="rounded-moon-s-md overflow-hidden flex justify-center items-center border border-beerus" style={{ position: 'relative', width: '188px', minWidth: '188px', height: '188px' }}>
          {<Image unoptimized={true} layout="fill" objectFit="cover" src={item.logo} onError={() => setShowPlaceholder(true)} alt="" />}
          {showPlaceholder && <SportDarts className="text-moon-48 text-trunks" />}
        </div>
        <div className="flex flex-1 flex-col gap-2 relative px-5 text-moon-16">
          <p className="font-semibold text-moon-18">{item.Title}</p>
          <div>
            <p className="font-semibold text-moon-20 text-hit">
              {getCurrency()} {item?.reached?.toString()}
            </p>
            <p>
              reached of {getCurrency()} {item.Budget} goal
            </p>
          </div>
          <div>
            <p className="font-semibold text-moon-20 text-hit">{item?.amountOfNFTs}</p>
            <p>NFTs</p>
          </div>
          <div className="absolute bottom-0 right-0 flex gap-2">
            {item.status != "ended" ? <>
              <Button variant="secondary" iconLeft={<GenericLoyalty />} onClick={() => { openDonateNFTModal(item.eventId, item.Title, item.wallet) }}>
                Donate NFT
              </Button>
              <Button variant="secondary" iconLeft={<ShopWallet />} onClick={() => { openDonateCoinModal(item.eventId, item.Title, item.wallet) }}>
                Donate Coin
              </Button>
            </> : <></>}

            <Link href={`${location.pathname}/event/${item.eventId}`}>
              <Button iconLeft={<ArrowsRightShort />}>Go to event</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
