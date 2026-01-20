import React from 'react';
import { ArrowRight, Zap, BookOpen, Terminal } from 'lucide-react';
import type { Lesson } from '../data/lessons';

interface LessonIntroProps {
    lesson: Lesson;
    onStart: () => void;
}

export const LessonIntro: React.FC<LessonIntroProps> = ({ lesson, onStart }) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-zinc-950 relative overflow-hidden animate-in fade-in duration-500">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600" />
            <div className="absolute top-20 right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl w-full flex flex-col gap-10 relative z-10">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        {lesson.module} Module
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight">
                        {lesson.title}
                    </h1>
                    <p className="text-2xl text-zinc-400 font-light">
                        {lesson.concept}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: The Story */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-orange-400 mb-2">
                            <BookOpen size={24} />
                            <h3 className="text-lg font-bold uppercase tracking-wider">The Concept</h3>
                        </div>
                        <p className="text-lg text-zinc-300 leading-relaxed">
                            {lesson.intro.story}
                        </p>
                    </div>

                    {/* Right: The Muscle Memory */}
                    <div className="bg-black border border-zinc-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-4 group hover:border-zinc-700 transition-colors">
                        <div className="flex items-center gap-3 text-green-400 mb-2">
                            <Terminal size={24} />
                            <h3 className="text-lg font-bold uppercase tracking-wider">Muscle Memory</h3>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                            <pre className="relative font-mono text-base text-zinc-100 whitespace-pre-wrap">
                                {lesson.intro.exampleCode}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Efficiency Tip (if exists) */}
                {lesson.intro.efficiencyTip && (
                    <div className="bg-blue-950/20 border border-blue-900/50 p-6 rounded-xl flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-blue-200 font-bold mb-1">Pro Tip</h4>
                            <p className="text-blue-300/80 text-sm leading-relaxed">
                                {lesson.intro.efficiencyTip}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <div className="flex justify-center pt-8">
                    <button
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-white text-black font-bold text-xl rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] flex items-center gap-3"
                    >
                        Start Coding
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
