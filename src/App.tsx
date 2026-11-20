import React, { useState } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { TabType } from './components/layout/BottomNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MainMenuHub } from './components/home/MainMenuHub';
import { CurriculumPath } from './components/learn/CurriculumPath';
import { LessonModal } from './components/learn/LessonModal';
import { KanaChart } from './components/chart/KanaChart';
import { WritingGym } from './components/writing/WritingGym';
import { QuizArena } from './components/quiz/QuizArena';
import { SignsGallery } from './components/reader/SignsGallery';
import { GradedReader } from './components/reader/GradedReader';
import { DuelistLab } from './components/cards/DuelistLab';
import { FlashcardStudio } from './components/flashcards/FlashcardStudio';
import { SettingsModal } from './components/settings/SettingsModal';
import { useProgress } from './hooks/useProgress';
import { LESSONS } from './data/lessons';
import { Lesson } from './types';

export function App() {
  // Mobile defaults directly to 'menu' (the 3-row Main Menu Hub!)
  const [currentTab, setCurrentTab] = useState<TabType>('menu');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    progress,
    completeLesson,
    toggleRomaji,
    setSpeechSpeed,
    exportProgress,
    importProgress,
    resetProgress,
  } = useProgress();

  const tabTitles: Record<TabType, string> = {
    menu: '日本語を読む',
    learn: 'Curriculum Path',
    chart: 'Kana Charts',
    write: 'Writing Gym (書道)',
    drills: 'Quiz Arena (試験)',
    signs: 'Street Signs (看板)',
    reader: 'Sentence Reader',
    cards: 'Duelist Lab (遊戯王)',
    flashcards: 'Flashcard Studio (単語帳)',
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Top Header Bar with dynamic [← Menu] back button on mobile when inside an activity */}
      <AppHeader
        streak={progress.streakDays}
        onOpenSettings={() => setIsSettingsOpen(true)}
        showBackButton={currentTab !== 'menu'}
        onBackToMenu={() => setCurrentTab('menu')}
        currentTabName={tabTitles[currentTab]}
      />

      {/* Main Responsive Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Left Sidebar */}
        <DesktopSidebar
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          completedLessonsCount={progress.completedLessons.length}
          totalLessonsCount={LESSONS.length}
        />

        {/* Content Area (Full screen on mobile when inside an activity, zero bottom bar clutter) */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 pb-12 max-w-4xl mx-auto w-full">
          {currentTab === 'menu' && (
            <MainMenuHub
              onSelectTab={(tab) => setCurrentTab(tab)}
              completedLessonsCount={progress.completedLessons.length}
              totalLessonsCount={LESSONS.length}
              streakDays={progress.streakDays}
            />
          )}

          {currentTab === 'learn' && (
            <CurriculumPath
              completedLessons={progress.completedLessons}
              onSelectLesson={(lesson) => setActiveLesson(lesson)}
            />
          )}

          {currentTab === 'chart' && (
            <KanaChart romajiVisible={progress.romajiVisible} />
          )}

          {currentTab === 'write' && (
            <WritingGym />
          )}

          {currentTab === 'drills' && (
            <QuizArena />
          )}

          {currentTab === 'signs' && (
            <SignsGallery />
          )}

          {currentTab === 'reader' && (
            <GradedReader />
          )}

          {currentTab === 'cards' && (
            <DuelistLab />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardStudio onBackToMenu={() => setCurrentTab('menu')} />
          )}
        </main>
      </div>

      {/* Active Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          speed={progress.speechSpeed}
          onClose={() => setActiveLesson(null)}
          onComplete={(lessonId) => {
            completeLesson(lessonId);
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onToggleRomaji={toggleRomaji}
        onSetSpeed={setSpeechSpeed}
        onExport={exportProgress}
        onImport={importProgress}
        onReset={resetProgress}
      />
    </div>
  );
}

export default App;
