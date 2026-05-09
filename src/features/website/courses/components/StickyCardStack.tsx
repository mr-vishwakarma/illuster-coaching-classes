import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  targetClass: string;
  badge?: string;
  icon: string;
  color: string;
  rating: number;
}

interface StickyCardStackProps {
  courses: Course[];
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
}

const StickyCardStack = ({
  courses,
  className,
  containerClassName,
  cardClassName,
}: StickyCardStackProps) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cardElements = cardRefs.current;
      const totalCards = cardElements.length;

      if (!cardElements[0]) return;

      // Set initial states
      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!cardElements[i]) continue;
        gsap.set(cardElements[i], { y: "120%", scale: 1, rotation: 0 }); // push down below the viewport
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 10%", // pin when the top of the container hits 10% from the top of the viewport
          end: () => `+=${window.innerHeight * (totalCards * 1.5)}`, // Scroll duration based on card count + massive delay
          pin: true,
          scrub: 1,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;
        
        if (!currentCard || !nextCard) continue;

        // Current card shrinks and rotates slightly back
        scrollTimeline.to(
          currentCard,
          {
            scale: 0.9, // Slightly less shrinkage
            opacity: 0.5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        // Next card slides up over it
        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className={cn("relative w-full h-[90vh] min-h-[600px] mb-32 z-10", className)} ref={container}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-4 lg:p-8">
        <div
          className={cn(
            "relative h-[550px] max-h-[80vh] w-full max-w-5xl",
            containerClassName,
          )}
        >
          {courses.map((course, i) => (
            <div
              key={course.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "absolute top-0 left-0 w-full h-full bg-[#1A1A1A] border border-[#333] shadow-2xl flex flex-col p-8 rounded-3xl will-change-transform",
                cardClassName
              )}
            >
              <div className="flex flex-col md:flex-row h-full w-full gap-8">
                {/* Left side: Image placeholder / Icon */}
                <div className="w-full md:w-1/2 h-48 md:h-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent z-10" />
                  <div 
                    className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-6xl shadow-inner relative z-20" 
                    style={{ color: course.color }}
                  >
                    {course.icon}
                  </div>
                </div>
                
                {/* Right side: Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center h-full text-left py-4">
                  <h3 className="text-3xl lg:text-4xl font-display font-medium text-white mb-4 leading-tight">{course.title}</h3>
                  <p className="text-[var(--text-muted)] text-lg mb-8 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                      <Star size={18} className="text-accent-orange" fill="currentColor" />
                      <span className="text-white font-bold">{course.rating} Rating</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-white font-bold">
                      {course.targetClass}
                    </div>
                    {course.badge && (
                      <div className="flex items-center gap-2 bg-accent-orange/20 text-accent-orange px-4 py-2 rounded-lg font-bold">
                        {course.badge}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 mt-auto">
                    <div>
                      <span className="text-sm text-[var(--text-muted)] block mb-1">Price</span>
                      <span className="text-3xl font-black text-white">₹{(course.price || 0).toLocaleString('en-IN')}</span>
                      <span className="text-sm text-[var(--text-light)] line-through ml-2">₹{(course.originalPrice || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <Link to={`/courses/${course.id}`} className="ml-auto px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
                      Check Course <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickyCardStack;
