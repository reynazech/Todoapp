import { useState } from 'react';
import BossBattle from './components/BossBattle.jsx';
import { BottomNav, Header } from './components/Layout.jsx';
import LevelUpModal from './components/LevelUpModal.jsx';
import MoodPanel from './components/MoodPanel.jsx';
import PlayerCard from './components/PlayerCard.jsx';
import QuestBoard from './components/quests/QuestBoard.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import StorageNotice from './components/StorageNotice.jsx';
import Toasts from './components/Toasts.jsx';

export default function App() {
  const [tab, setTab] = useState('quests');

  // On phones only the chosen tab is shown; on large screens (lg) everything is.
  const showOn = (name) => `${tab === name ? 'block' : 'hidden'} lg:block`;

  const changeTab = (next) => {
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-dvh">
      <Header />
      <StorageNotice />

      <main className="mx-auto grid max-w-7xl gap-4 px-4 pb-28 lg:grid-cols-[300px_minmax(0,1fr)_340px] lg:items-start lg:gap-5 lg:pb-12">
        <div className="space-y-4 lg:sticky lg:top-6 lg:space-y-5">
          <PlayerCard />
          <div className={showOn('quests')}>
            <MoodPanel />
          </div>
        </div>

        <div className={showOn('quests')}>
          <QuestBoard />
        </div>

        <div className="space-y-4 empty:hidden lg:space-y-5">
          <div className={showOn('boss')}>
            <BossBattle />
          </div>
          <div className={showOn('stats')}>
            <StatsPanel />
          </div>
        </div>
      </main>

      <BottomNav tab={tab} onChange={changeTab} />
      <Toasts />
      <LevelUpModal />
    </div>
  );
}
