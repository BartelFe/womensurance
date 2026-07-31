export default function ScrollHint({ label = 'Scrollen' }) {
  return (
    <div className="flex flex-col items-center gap-3 eyebrow text-paper/55">
      <span>{label}</span>
      <span className="relative h-12 w-px bg-paper/20 overflow-hidden">
        <span className="absolute top-0 left-0 right-0 h-3 bg-pink animate-[scrollHint_1.8s_ease-in-out_infinite]" />
      </span>
      <style>{`
        @keyframes scrollHint {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
    </div>
  );
}
