import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, X, CheckCircle } from 'lucide-react';
import type { Lesson } from '../data/lessons';
import { Editor } from './Editor';
import { normalizeCode } from '../utils/validation';

interface LessonViewProps {
    lesson: Lesson;
    onComplete: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete }) => {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [code, setCode] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({ type: 'idle', message: '' });
    const [attempts, setAttempts] = useState(0);

    const stage = lesson.stages[currentStageIndex];

    // Reset when lesson changes
    useEffect(() => {
        setCurrentStageIndex(0);
        setCode(lesson.stages[0].codeTemplate);
        setFeedback({ type: 'idle', message: '' });
        setAttempts(0);
    }, [lesson]);

    // Reset when stage changes
    useEffect(() => {
        if (stage) {
            setCode(stage.codeTemplate);
            setFeedback({ type: 'idle', message: '' });
            setAttempts(0);
        }
    }, [stage]);

    const checkCode = () => {
        // Robust normalization using the utility
        const normalizedCode = normalizeCode(code);

        const solutions = Array.isArray(stage.solution) ? stage.solution : [stage.solution];
        const isCorrect = solutions.some(sol => {
            if (sol.startsWith('regex:')) {
                // Regex validation mode
                try {
                    const pattern = new RegExp(sol.substring(6));
                    // Check against raw code (maybe slightly trimmed) to allow pattern matching
                    return pattern.test(code.trim());
                } catch (e) {
                    console.error("Invalid regex in solution:", sol);
                    return false;
                }
            } else {
                // Standard normalized string match
                return normalizedCode.includes(normalizeCode(sol));
            }
        });

        // Check if the solution is contained within the code
        if (isCorrect) {
            setFeedback({ type: 'success', message: 'Correct! Great job.' });
        } else {
            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);

            // Progressive Hint Logic
            let message = "Check your syntax. Make sure you followed the instructions properly.";

            if (nextAttempts >= 2) {
                // Stronger hint on second attempt
                message = stage.hint;
            } else {
                // Attempt 1: Gentle nudges based on context (could be improved with specific hint fields later)
                const mainSolution = Array.isArray(stage.solution) ? stage.solution[0] : stage.solution;

                if (mainSolution.includes("std::cout")) {
                    message = "Tip: Focus on the 'std::cout' statement.";
                } else if (mainSolution.includes("int ") || mainSolution.includes("string ")) {
                    message = "Tip: Check your variable declaration.";
                } else if (mainSolution.includes("if") || mainSolution.includes("for")) {
                    message = "Tip: Review the structure of your logic block.";
                }
            }

            setFeedback({ type: 'error', message });
        }
    };

    const handleNext = () => {
        if (currentStageIndex < lesson.stages.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
        } else {
            onComplete(); // Lesson complete
        }
    };

    return (
        <div className="h-full flex flex-col p-6 gap-6" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px', gap: '24px', boxSizing: 'border-box' }}>

            {/* Header Area */}
            <div className="flex-none">
                <h2 className="text-3xl font-bold mb-2 text-white text-left"
                    style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#ffffff', textAlign: 'left' }}>
                    {lesson.title} <span className="text-lg text-zinc-500 font-normal">({lesson.concept})</span>
                </h2>
                {/* User requested Orange text for emphasis? Or just accent. Let's make description White for readability as requested "text can be white", but accent Orange. */}
                <p className="text-white font-medium max-w-2xl text-lg opacity-90">{lesson.description}</p>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex gap-6 min-h-0" style={{ flex: 1, display: 'flex', gap: '24px', minHeight: 0 }}>

                {/* Left: Instructions */}
                <div className="w-1/3 flex flex-col gap-4 relative z-0" style={{ width: '33%', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 0 }}>
                    {/* ... (Left content remains) ... */}

                    {/* Card 1: Step & Instructions -> Black Slide */}
                    <div className="p-6 rounded-2xl bg-black border border-zinc-600 shadow-xl"
                        style={{ padding: '24px', borderRadius: '16px', background: '#000000', border: '1px solid #52525b', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-700 text-white px-2 py-1 rounded">Step {stage.step}</span>
                        </div>
                        <p className="text-lg leading-relaxed text-white font-medium" style={{ color: '#ffffff' }}>{stage.instruction}</p>
                    </div>

                    {/* Card 2: Preview & Unlock Status (Black Slide) */}
                    {(stage.previewCode || (stage.step === 1 && lesson.previewCode)) && (
                        <div className={`p-4 rounded-xl border transition-all duration-500 ${attempts >= 3 ? 'bg-black border-red-500' : 'bg-black border-zinc-600'}`}
                            style={{ padding: '16px', borderRadius: '12px', background: '#000000', border: attempts >= 3 ? '1px solid #ef4444' : '1px solid #52525b' }}>

                            {/* Unlock Status Text */}
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-white uppercase font-semibold flex items-center gap-2">
                                    {attempts >= 3 ? <span className="text-red-500">Code Decrypted</span> : null}
                                </p>
                                {attempts < 3 && <span className="text-xs text-white">{3 - attempts} attempts to unlock</span>}
                            </div>

                            {/* Code Block */}
                            <div className="relative font-mono text-sm overflow-hidden rounded bg-black">
                                <pre
                                    className={`transition-all duration-700 ${attempts >= 3 ? 'text-red-400' : 'text-zinc-400 select-none'}`}
                                    style={{
                                        filter: attempts >= 3 ? 'blur(0)' : 'blur(8px)',
                                        opacity: attempts >= 3 ? 1 : 0.4,
                                        color: attempts >= 3 ? '#f87171' : '#a1a1aa'
                                    }}
                                >
                                    {stage.previewCode || lesson.previewCode}
                                </pre>
                                {attempts < 3 && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl tracking-[0.5em] select-none"
                                        style={{ position: 'absolute', inset: 0, zIndex: 10, color: '#ffffff' }}
                                    >
                                        LOCKED
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Feedback Area */}
                    {feedback.type !== 'idle' && (
                        <div className={`relative p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'bg-zinc-900 border-green-900 text-green-400' : 'bg-zinc-900 border-red-900 text-red-400'
                            }`} style={{
                                padding: '16px',
                                borderRadius: '12px',
                                border: feedback.type === 'success' ? '1px solid #14532d' : '1px solid #7f1d1d',
                                background: '#18181b', // Zinc 900
                                color: feedback.type === 'success' ? '#4ade80' : '#f87171',
                                display: 'flex',
                                gap: '12px',
                                position: 'relative'
                            }}>
                            {feedback.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
                            <div className="flex-1">
                                <p className="font-medium">{feedback.type === 'success' ? 'Success!' : 'Not quite right'}</p>
                                <p className="text-sm opacity-90">{feedback.message}</p>
                            </div>
                            {/* Close Button */}
                            {feedback.type === 'error' && (
                                <button
                                    onClick={() => setFeedback({ type: 'idle', message: '' })}
                                    className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-md transition-colors"
                                    style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'currentColor' }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Editor */}
                <div className="flex-1 flex flex-col gap-4 relative z-10" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 10 }}>
                    <Editor code={code} onChange={setCode} />

                    <div className="flex justify-end gap-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            onClick={() => setCode(stage.codeTemplate)}
                            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-2"
                            style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <RotateCcw size={16} /> Reset
                        </button>

                        {feedback.type === 'success' ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
                                style={{ padding: '8px 24px', borderRadius: '8px', background: '#ea580c', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Next Lesson <Check size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={checkCode}
                                className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                style={{ padding: '8px 24px', borderRadius: '8px', background: '#ea580c', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                Check Code <Play size={18} />
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
