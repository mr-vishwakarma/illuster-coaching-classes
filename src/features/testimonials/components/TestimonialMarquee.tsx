import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: "Mukti Prasad Dash",
    role: "Full Stack Developer",
    rating: 4.3,
    text: "Illuster Coaching Classes is an excellent institute for learning coding. The teachers explain concepts in a very detailed and structured way, ensuring complete mastery.",
    avatar: "https://ui-avatars.com/api/?name=Mukti+Prasad&background=random"
  },
  {
    name: "Pradum K",
    role: "MERN Stack Developer",
    rating: 4.8,
    text: "Illuster Coaching is an amazing place to learn coding! The mentors are highly skilled, explain every topic thoroughly, and are always ready to help clear doubts.",
    avatar: "https://ui-avatars.com/api/?name=Pradum+K&background=random"
  },
  {
    name: "Samarth Jain",
    role: "Software Engineer",
    rating: 4.8,
    text: "Really very amazing place to learn new technologies. Calling all aspiring coders and tech enthusiasts to join here and build scalable applications.",
    avatar: "https://ui-avatars.com/api/?name=Samarth+Jain&background=random"
  },
  {
    name: "Akshat Sahu",
    role: "Software Developer",
    rating: 4.7,
    text: "The best institute around. I have learnt a lot by coming here. After joining, I instantly started coding with confidence and cracked multiple interviews.",
    avatar: "https://ui-avatars.com/api/?name=Akshat+Sahu&background=random"
  },
  {
    name: "Om Singhal",
    role: "Backend Developer",
    rating: 4.4,
    text: "Best place to learn coding online! I am currently learning advanced backend architecture here and the curriculum is simply outstanding.",
    avatar: "https://ui-avatars.com/api/?name=Om+Singhal&background=random"
  }
];

const TestimonialMarquee = () => {
  return (
    <section className="py-24 bg-black overflow-hidden relative border-y border-white/10">
      <div className="container mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-4 leading-tight tracking-tight">
          We Help Learners Become Industry-<br className="hidden md:block"/>Ready Developers.
        </h2>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Gradient overlays for smooth fading edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex gap-6 whitespace-nowrap items-center py-4 px-3"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {/* Duplicate the array twice for seamless looping */}
          {[...reviews, ...reviews, ...reviews].map((review, idx) => (
            <div 
              key={idx} 
              className="w-[400px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111111] transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-14 h-14 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-lg font-medium text-white">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-4 text-accent-orange">
                <span className="text-sm font-bold text-gray-400 mr-2">{review.rating}</span>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(review.rating) ? "currentColor" : "none"} 
                    className={i < Math.floor(review.rating) ? "text-accent-orange" : "text-gray-700"}
                  />
                ))}
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed whitespace-normal line-clamp-4">
                {review.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Reverse Marquee */}
      <div className="relative w-full flex overflow-x-hidden mt-6">
        <motion.div
          className="flex gap-6 whitespace-nowrap items-center py-4 px-3"
          animate={{ x: [-1000, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 35,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {[...reviews, ...reviews, ...reviews].reverse().map((review, idx) => (
            <div 
              key={`rev-${idx}`} 
              className="w-[400px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 hover:bg-[#111111] transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-14 h-14 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="text-lg font-medium text-white">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-4 text-accent-orange">
                <span className="text-sm font-bold text-gray-400 mr-2">{review.rating}</span>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(review.rating) ? "currentColor" : "none"} 
                    className={i < Math.floor(review.rating) ? "text-accent-orange" : "text-gray-700"}
                  />
                ))}
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed whitespace-normal line-clamp-4">
                {review.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialMarquee;
