export default function LoadingScreen() {
    return (
        <>
            <style>{`
        @keyframes spin-slow    { to { transform: rotate(360deg); } }
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        @keyframes pulse-dot    { 0%, 100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes fade-label   { 0%, 100% { opacity: .4; } 50% { opacity: .9; } }
        @keyframes grow-line    { 0%, 100% { transform: scaleY(.4); opacity: .3; } 50% { transform: scaleY(1); opacity: .7; } }

        .spin-slow    { animation: spin-slow    1.1s cubic-bezier(.55,.15,.45,.85) infinite; }
        .spin-reverse { animation: spin-reverse 1.6s cubic-bezier(.55,.15,.45,.85) infinite; }
        .pulse-dot    { animation: pulse-dot    1.1s ease-in-out infinite; }
        .fade-label   { animation: fade-label   1.4s ease-in-out infinite; }
        .grow-line    { animation: grow-line    1.4s ease-in-out infinite; transform-origin: top; }
      `}</style>

            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 gap-7">

                <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="spin-slow absolute inset-0 rounded-full border border-gray-300 border-t-gray-500" />
                    <div className="spin-reverse absolute inset-[10px] rounded-full border border-gray-300 border-b-gray-500" />
                    <div className="pulse-dot w-1.5 h-1.5 rounded-full bg-gray-400" />
                </div>

                <div className="grow-line w-px h-6 bg-gray-400" />

                <span className="fade-label text-[11px] font-light tracking-[0.2em] uppercase text-gray-500">
                    Loading
                </span>

            </div>
        </>
    );
}