export default function Footer() {
  return (
    <footer className="mt-auto border-t border-transparent bg-white dark:bg-gray-900 py-6"
      style={{ borderImage: 'linear-gradient(90deg, #2563EB, #7C3AED) 1' }}
    >
      <div className="mx-auto max-w-5xl px-4 flex flex-col items-center gap-1.5">
        <span className="gradient-text text-base font-extrabold tracking-tight">SocialApp</span>
        <p className="text-xs text-gray-400 dark:text-gray-500 tracking-wide">
          A frontend learning project · React · Tailwind CSS · localStorage
        </p>
      </div>
    </footer>
  );
}
