import React, { useState } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav, TabType } from './components/layout/BottomNav';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { CurriculumPath } from './components/learn/CurriculumPath';
import { LessonModal } from './components/learn/LessonModal';
import { KanaChart } from './components/chart/KanaChart';
import { WritingGym } from './components/writing/WritingGym';
import { ConfusingPairs } from './components/drills/ConfusingPairs';
import { SignsGallery } from './components/reader/SignsGallery';
import { GradedReader } from './components/reader/GradedReader';
import { SettingsModal } from './components/settings/SettingsModal';
import { useProgress } from './hooks/useProgress';
import { LESSONS } from './data/lessons';
import { Lesson } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('learn');
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <AppHeader
        streak={progress.streakDays}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Responsive Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Left Sidebar (Visible on screens md and up) */}
        <DesktopSidebar
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          completedLessonsCount={progress.completedLessons.length}
          totalLessonsCount={LESSONS.length}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-12 max-w-4xl mx-auto w-full">
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
            <ConfusingPairs />
          )}

          {currentTab === 'signs' && (
            <SignsGallery />
          )}

          {currentTab === 'reader' && (
            <GradedReader />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on screens below md) */}
      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

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
