import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const phrases = [
  { text: "Your Bridge to India’s Top Colleges.", color: "text-accent-orange" },
  { text: "Master Your Boards. Crack Your Dream College.", color: "text-primary" },
  { text: "Top Scores Today. Top Colleges Tomorrow.", color: "text-secondary" },
  { text: "Expert Guidance for the Ranks That Matter.", color: "text-accent-purple" },
];

const Typewriter = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex].text;
    
    // Determine typing speed
    const typingSpeed = isDeleting ? 30 : 70;
    const delay = isDeleting && charIndex === 0 ? 500 : (charIndex === currentPhrase.length && !isDeleting ? 2000 : typingSpeed);

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  const currentPhrase = phrases[phraseIndex];
  const displayedText = currentPhrase.text.substring(0, charIndex);

  return (
    <div className="flex items-center gap-1 min-h-[4rem] justify-center mb-4">
      <p className={`text-2xl sm:text-3xl md:text-5xl lg:text-[4rem] font-medium tracking-tight ${currentPhrase.color}`}>
        {displayedText}
      </p>
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className={`w-1 md:w-1.5 h-8 md:h-12 lg:h-[4rem] ${currentPhrase.color}`}
        style={{ backgroundColor: 'currentColor' }}
      />
    </div>
  );
};

export default Typewriter;
