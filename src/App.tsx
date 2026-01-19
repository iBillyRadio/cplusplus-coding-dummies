import { useState, useEffect } from 'react'
import './App.css'
import { lessons, MODULE_SKILLS } from './data/lessons'
import { Layout } from './components/Layout'
import { LessonView } from './components/LessonView'

function App() {
  // Load state from local storage or default to 0
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    const saved = localStorage.getItem('currentLessonIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [unlockedLessonIndex, setUnlockedLessonIndex] = useState(() => {
    const saved = localStorage.getItem('unlockedLessonIndex');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentLessonIndex', currentLessonIndex.toString());
  }, [currentLessonIndex]);

  useEffect(() => {
    localStorage.setItem('unlockedLessonIndex', unlockedLessonIndex.toString());
  }, [unlockedLessonIndex]);

  const handleLessonComplete = () => {
    const currentLesson = lessons[currentLessonIndex];

    // Only advance unlock if we finished the furthest unlocked lesson
    if (currentLessonIndex === unlockedLessonIndex) {
      setUnlockedLessonIndex(prev => Math.min(prev + 1, lessons.length - 1));

      // Check for module completion
      // If we are at the last lesson OR the next lesson is in a different module
      const isLastLesson = currentLessonIndex === lessons.length - 1;
      const nextLesson = lessons[currentLessonIndex + 1];

      if (isLastLesson || (nextLesson && nextLesson.module !== currentLesson.module)) {
        const skill = MODULE_SKILLS[currentLesson.module];
        // Small delay to let the UI update first potentially, or just alert immediately
        setTimeout(() => {
          alert(`🎉 Module Completed: ${currentLesson.module}\n\nSkill Unlocked: ${skill} 🏆`);
        }, 100);
      }
    }

    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    } else {
      // Course complete
      alert("Congratulations! You've finished the basic course!");
    }
  };

  return (
    <Layout
      currentLessonIndex={currentLessonIndex}
      totalLessons={lessons.length}
      lessons={lessons}
      unlockedLessonIndex={unlockedLessonIndex}
      onSelectLesson={setCurrentLessonIndex}
    >
      <LessonView
        lesson={lessons[currentLessonIndex]}
        onComplete={handleLessonComplete}
      />
    </Layout>
  )
}

export default App
