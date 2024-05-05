import { ChatChat, ChatCommentText, GenericHeart, GenericIdea, GenericUser, GenericUsers, ShopWallet, SportDarts } from '@heathmont/moon-icons-tw';
import Badge from '../../components/components/Badge';
import { Badges } from '../../data-model/badges';
import Card from '../../components/components/Card';

const BadgesPanel = ({ badges }: { badges: Badges }) => (
  <Card>
    <div>
      <Badge icon={<GenericUser />} label="Basic" description="All essential community functions" granted />
      <Badge icon={<ChatChat />} label="First reply" description="Replied to a message" granted={badges.reply} />
      <Badge icon={<GenericUsers />} label="First join" description="Created a DAO community" granted={badges.dao} />
      <Badge icon={<GenericUsers />} label="First community" description="Joined a DAO community" granted={badges.joined} />
      <Badge icon={<GenericIdea />} label="First idea" description="Created an idea" granted={badges.ideas} />
      <Badge icon={<GenericHeart />} label="First vote" description="Voted on an idea" granted={badges.vote} />
      <Badge icon={<ShopWallet />} label="First donation" description="Donated to an idea" granted={badges.donation} />
      <Badge icon={<SportDarts />} label="First goal" description="Created a goal" granted={badges.goal} />
      <Badge icon={<ChatCommentText />} label="First comment" description="Commented on an idea" granted={badges.comment} />
    </div>
  </Card>
);
export default BadgesPanel;
