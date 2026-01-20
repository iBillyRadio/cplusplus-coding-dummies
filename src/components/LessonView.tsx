import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, X, CheckCircle } from 'lucide-react';
import type { Lesson } from '../data/lessons';
import { Editor } from './Editor';
import { LessonIntro } from './LessonIntro';
import { normalizeCode, checkAndCapture, interpolateSolution } from '../utils/validation';

interface LessonViewProps {
    lesson: Lesson;
    onComplete: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete }) => {
    if (!lesson) {
        return <div className="p-8 text-white">Loading lesson... (or lesson data is missing)</div>;
    }
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [showIntro, setShowIntro] = useState(false);
    // code state moved to lazy init below
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({ type: 'idle', message: '' });
    const [attempts, setAttempts] = useState(0);

    // Flexible Validation State - Initialize lazily to ensure it's available on first render
    const [activeVariants, setActiveVariants] = useState<Record<string, string>>(() => {
        // Try to load from localStorage first
        const saved = localStorage.getItem(`lesson_variants_${lesson.id}`);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved variants", e);
            }
        }

        if (lesson.variants) {
            const variants: Record<string, string> = {};
            for (const key in lesson.variants) {
                const options = lesson.variants[key];
                variants[key] = options[Math.floor(Math.random() * options.length)];
            }
            return variants;
        }
        return {};
    });

    // Initialize context with variants immediately, restoring from storage if available
    const [validationContext, setValidationContext] = useState<Record<string, string>>(() => {
        const saved = localStorage.getItem(`lesson_context_${lesson.id}`);
        if (saved) {
            try {
                return { ...activeVariants, ...JSON.parse(saved) }; // Merge activeVariants just in case
            } catch (e) {
                console.error("Failed to parse saved context", e);
            }
        }
        return activeVariants;
    });

    // Effect to persist variants
    useEffect(() => {
        if (Object.keys(activeVariants).length > 0) {
            localStorage.setItem(`lesson_variants_${lesson.id}`, JSON.stringify(activeVariants));
        }
    }, [activeVariants, lesson.id]);

    // Effect to persist context
    useEffect(() => {
        if (Object.keys(validationContext).length > 0) {
            localStorage.setItem(`lesson_context_${lesson.id}`, JSON.stringify(validationContext));
        }
    }, [validationContext, lesson.id]);


    const stage = lesson.stages[currentStageIndex];

    // Initialize code with interpolated variants immediately
    const [code, setCode] = useState(() => {
        const rawTemplate = lesson.stages[0].codeTemplate;
        return interpolateSolution(rawTemplate, activeVariants);
    });

    // Reset or Restore when lesson changes (only for localStorage restoration now, init is handled by key remount)
    useEffect(() => {
        const savedStage = localStorage.getItem(`lesson_stage_${lesson.id}`);
        if (savedStage) {
            const parsed = parseInt(savedStage, 10);
            if (!isNaN(parsed) && parsed >= 0 && parsed < lesson.stages.length) {
                setCurrentStageIndex(parsed);
                // If we restored a stage > 0, we might need to update code to that stage's template?
                // For now, simple behavior: start at 0 or saved stage.
                // If saved stage is found, we should probably update 'code' to match that stage's template?
                // But user might have had custom code. LocalStorage persistence for CODE is not yet implemented, only stage index.
                // So resetting to template is correct behavior for now.
            }
        }

        // Show intro if we are at the beginning and the lesson has one
        setShowIntro(currentStageIndex === 0 && !!lesson.intro);

        // Code is already init by useState lazy init for stage 0. 
        // If we restored to stage > 0, we might want to update code effectively?
        // Let's rely on the user to write code or 'Reset Code' if they are midway.
        // Actually, if we restore stage, we should probably restore the template for THAT stage if code is empty?
        // But 'code' state is already init to stage 0 template.

    }, [lesson]);

    // Save progress
    useEffect(() => {
        localStorage.setItem(`lesson_stage_${lesson.id}`, currentStageIndex.toString());
    }, [currentStageIndex, lesson.id]);

    // Reset when stage changes
    // Reset or update template when stage changes
    useEffect(() => {
        if (stage) {
            // Resolve template with current context/variants
            const resolvedTemplate = interpolateSolution(stage.codeTemplate, { ...activeVariants, ...validationContext });
            // Only update code if it matches the previous stage's template (user hasn't typed custom stuff they want to keep?)
            // OR if we want to force the new template. 
            // For this app, each stage usually builds on the previous, but the template includes the previous code + new comments.
            // So we should overwrite 'code' with the new template which effectively includes the previous answer + new todo.
            setCode(resolvedTemplate);
            setFeedback({ type: 'idle', message: '' });
            setAttempts(0);
        }
        // CRITICAL FIX: Do NOT include validationContext here. 
        // Updating context (on success) should NOT trigger a stage reset.
        // Only reset when the STAGE (index) changes.
    }, [currentStageIndex, activeVariants]);

    if (showIntro && lesson.intro) {
        return <LessonIntro lesson={lesson} onStart={() => setShowIntro(false)} />;
    }

    const checkCode = () => {
        // Robust normalization using the utility
        const normalizedCode = normalizeCode(code);

        const solutions = Array.isArray(stage.solution) ? stage.solution : [stage.solution];

        let capturedInThisCheck: Record<string, string> = {};

        const isCorrect = solutions.some(sol => {
            // 1. Interpolate the solution template with current Context + Variants
            // e.g. "context:{{targetType}} {{myVar}} = 50;" -> "int xp = 50;"
            const resolvedSol = interpolateSolution(sol, { ...activeVariants, ...validationContext });

            if (resolvedSol.startsWith('regex:')) {
                // Regex validation mode
                // Remove 'regex:' prefix
                const regexPattern = resolvedSol.substring(6);
                const { isMatch, captured } = checkAndCapture(code, regexPattern);

                if (isMatch && captured) {
                    // Temporarily store captured vars from this successful match
                    capturedInThisCheck = { ...capturedInThisCheck, ...captured };
                }
                return isMatch;
            } else if (resolvedSol.startsWith('context:')) {
                // Context mode (deprecated prefix? no, keeping it for clarity in data, but logic is same as normal check after interpolation)
                // Remove 'context:' prefix
                const cleanSol = resolvedSol.substring(8);
                return normalizedCode.includes(normalizeCode(cleanSol));
            } else {
                // Standard normalized string match
                return normalizedCode.includes(normalizeCode(resolvedSol));
            }
        });

        // Check if the solution is contained within the code
        if (isCorrect) {
            // Commit captured variables to state
            if (Object.keys(capturedInThisCheck).length > 0) {
                setValidationContext(prev => ({ ...prev, ...capturedInThisCheck }));
            }
            setFeedback({ type: 'success', message: 'Correct! Great job.' });
        } else {
            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);

            // Progressive Hint Logic
            let message = "Check your syntax. Make sure you followed the instructions properly.";

            if (nextAttempts >= 2) {
                // Stronger hint on second attempt
                message = interpolateSolution(stage.hint, { ...activeVariants, ...validationContext });
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
                        {/* Dynamic Instruction Rendering */}
                        <p className="text-lg leading-relaxed text-white font-medium" style={{ color: '#ffffff' }}>
                            {interpolateSolution(stage.instruction, { ...activeVariants, ...validationContext })}
                        </p>
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
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    if (window.confirm("Restart module? This will reset your progress.")) {
                                        setCurrentStageIndex(0);
                                        setShowIntro(!!lesson.intro);
                                        setFeedback({ type: 'idle', message: '' });
                                        setAttempts(0);
                                        setValidationContext({});
                                        localStorage.removeItem(`lesson_stage_${lesson.id}`);
                                        localStorage.removeItem(`lesson_variants_${lesson.id}`);
                                        localStorage.removeItem(`lesson_context_${lesson.id}`);
                                        // Re-roll variants?
                                        if (lesson.variants) {
                                            const newVariants: Record<string, string> = {};
                                            for (const key in lesson.variants) {
                                                const options = lesson.variants[key];
                                                newVariants[key] = options[Math.floor(Math.random() * options.length)];
                                            }
                                            setActiveVariants(newVariants);
                                            setValidationContext(newVariants);
                                            // Update initial code too? The useEffect depends on 'lesson' which didn't change...
                                            // We manually update code here based on stage 0 and new variants
                                            setCode(interpolateSolution(lesson.stages[0].codeTemplate, newVariants));
                                        }
                                    }
                                }}
                                className="px-4 py-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-2"
                                title="Restart Lesson"
                            >
                                <RotateCcw size={16} /> <span className="hidden md:inline">Restart Module</span>
                            </button>

                            <button
                                onClick={() => setCode(interpolateSolution(stage.codeTemplate, { ...activeVariants, ...validationContext }))}
                                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center gap-2"
                            >
                                <RotateCcw size={16} /> Reset Code
                            </button>
                        </div>

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
