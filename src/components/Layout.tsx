import React from 'react';
import { BookOpen, Terminal, CheckCircle, Lock as LucideLock } from 'lucide-react';
import type { Lesson } from '../data/lessons';

interface LayoutProps {
    currentLessonIndex: number;
    totalLessons: number;
    lessons: Lesson[];
    unlockedLessonIndex: number;
    onSelectLesson: (index: number) => void;
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
    currentLessonIndex,
    lessons,
    unlockedLessonIndex,
    onSelectLesson,
    children
}) => {
    return (
        <div className="flex h-screen bg-zinc-700 text-white overflow-hidden" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-800/50 border-r border-zinc-600 p-6 overflow-y-auto" style={{ width: '260px', borderRight: '1px solid #52525b', padding: '1.5rem', background: 'rgba(39, 39, 42, 0.5)', overflowY: 'auto' }}>
                <div className="flex items-center gap-3 mb-8" style={{ display: 'flex', gap: '12px', marginBottom: '2rem', alignItems: 'center' }}>
                    <div className="p-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-500/20" style={{ padding: '8px', background: '#f97316', borderRadius: '8px' }}>
                        <Terminal size={24} className="text-white" color="#ffffff" />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight text-white" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>CplusplusCodingDummies</h1>
                </div>

                <nav className="px-2 space-y-6">
                    {(['PG1', 'PG2', 'SYSTEMS', 'DSA', 'SE', 'INTERVIEW'] as const).map(moduleName => {
                        const moduleLessons = lessons.map((l, i) => ({ ...l, index: i })).filter(l => l.module === moduleName);

                        if (moduleLessons.length === 0) return null;

                        return (
                            <div key={moduleName} className="space-y-2">
                                <h3 className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                    {moduleName}
                                </h3>
                                <div className="space-y-1">
                                    {moduleLessons.map(({ index, ...lesson }) => {
                                        const isActive = index === currentLessonIndex;
                                        const isLocked = index > unlockedLessonIndex;

                                        return (
                                            <button
                                                key={lesson.id}
                                                onClick={() => !isLocked && onSelectLesson(index)}
                                                disabled={isLocked}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left text-sm ${isActive
                                                    ? 'bg-orange-600 text-white shadow-md'
                                                    : isLocked
                                                        ? 'text-zinc-600 cursor-not-allowed'
                                                        : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                                                    }`}
                                            >
                                                {isLocked ? <LucideLock size={14} /> : (isActive ? <BookOpen size={14} /> : <div style={{ width: 14 }} />)}
                                                <span className="font-medium truncate">{lesson.concept}</span>
                                                {index < unlockedLessonIndex && <CheckCircle size={12} className="ml-auto text-orange-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="mt-6 pt-6 border-t border-zinc-600" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #52525b' }}>
                    <p className="text-xs text-zinc-400 text-center">v0.1.0 Beta</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden bg-zinc-700" style={{ flex: 1, position: 'relative', background: '#3f3f46' }}>
                {children}
            </main>
        </div>
    );
};
