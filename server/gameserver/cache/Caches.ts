import AccountCache from './AccountCache';
import UserCache from './UserCache';
import MatchCache from './match/MatchCache';
import FightCache from './fight/FightCache';

export default class Caches {
    public static account: AccountCache = new AccountCache();
    public static user: UserCache = new UserCache();
    public static match: MatchCache = new MatchCache();
    public static fight: FightCache = new FightCache();
}
