import React from 'react';

interface EditorProps {
    code: string;
    onChange: (code: string) => void;
    readOnly?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ code, onChange, readOnly }) => {
    return (
        <div className="w-full h-full bg-black rounded-xl overflow-hidden border border-zinc-700 flex flex-col shadow-2xl"
            style={{ height: '100%', background: '#000000', borderRadius: '12px', border: '1px solid #3f3f46', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            {/* Editor Header */}
            <div className="flex items-center px-4 py-2 bg-black border-b border-zinc-800 gap-2" style={{ display: 'flex', padding: '8px 16px', background: '#000000', borderBottom: '1px solid #27272a', gap: '8px' }}>
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" style={{ width: 12, height: 12, borderRadius: '50%', background: '#Cf6679' }} />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffcc00' }} />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" style={{ width: 12, height: 12, borderRadius: '50%', background: '#33cc33' }} />
                <span className="ml-2 text-xs text-slate-500 font-mono" style={{ marginLeft: 8, fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>main.cpp</span>
            </div>

            {/* Editor Area */}
            <textarea
                className="flex-1 w-full bg-transparent p-4 font-mono text-sm text-slate-300 resize-none focus:outline-none"
                style={{
                    flex: 1,
                    width: '100%',
                    background: 'transparent',
                    padding: '16px',
                    fontFamily: "'Fira Code', monospace", // Fallback to monospace
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#e2e8f0',
                    resize: 'none',
                    marginBottom: 10,
                    border: 'none',
                    outline: 'none'
                }}
                value={code}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                disabled={readOnly}
            />
        </div>
    );
};
