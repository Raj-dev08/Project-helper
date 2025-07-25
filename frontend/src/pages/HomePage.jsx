import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["COLLABORATE.", "BUILD.", "LEARN.", "SHARE."];

const HackerType = () => {
  const [displayText, setDisplayText] = useState("");
  const [cursor,setCursor]=useState("|")
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let anotherTimeOut;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if(charIndex<currentWord.length){
            if(charIndex%4===0){
                setCursor("|")
            }else{
                setCursor("|")
            }
            setDisplayText(currentWord.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
        }else{           
            anotherTimeOut=setTimeout(()=>{
                setDeleting(true);
            },400);         
        }
      } else {
         if (charIndex === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          
        }else{

            if(charIndex%2===0){
                setCursor("")
            }else{
                setCursor("|")
            }
            setDisplayText(currentWord.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
        }      
      }
    }, deleting ? 60 : 150);

    return () => {
        clearTimeout(timeout)
        clearTimeout(anotherTimeOut)
    };
  }, [charIndex, deleting, wordIndex]);

  return (
    <h1 className="text-4xl sm:text-6xl font-bold text-primary font-mono tracking-widest">
      {displayText}
      <span className="text-white">{cursor}</span>
    </h1>
  );
};

const ScrollReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const Section = ({ title, text, image, count }) => {
    const bar=25*count
    return (
        <ScrollReveal>
        <motion.div
            className={`flex flex-col ${count%2==0 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 max-w-6xl mx-auto px-6 py-20`}
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.2 }}
            viewport={{ once: true }}
            variants={{
            hidden: {},
            visible: {}
            }}
        >
            <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
            >
            <Link to="/explore">
            <img
                src={image}
                alt={title}
                className="rounded-xl shadow-xl border-hidden hover:scale-110 transition-transform duration-300 ease-in-out w-full cursor-pointer"
            />
            </Link>
            </motion.div>

            <motion.div
            variants={{ hidden: { opacity: 0, x: count%2==0 ? -50 : 50 }, visible: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-4"
            >
            <h2 className="text-4xl font-bold text-base-content leading-snug">{title}</h2>
            <p className="text-lg text-base-content/80 max-w-xl leading-relaxed">{text}</p>
            <motion.div 
                className={`h-1  bg-gradient-to-r from-primary/60 via-primary/45 to-primary/15 rounded-full`}
                style={{ width: `${bar}%` }}
                initial={{width:0}}
                animate={{ width: `${bar}%` }}
                viewport={{ once: true }}
                transition={{ duration: 2*count, ease: "easeInOut" }}
            ></motion.div>
            </motion.div>
        </motion.div>
        </ScrollReveal>
    );
};


const Homepage = () => {
  return (
    <div className="bg-base-100 text-base-content overflow-x-hidden">
      <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-20 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-primary text-center mb-4"
        >
          Build. Collaborate. Ship.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-center max-w-xl text-gray-400"
        >
          Join forces with developers to build the next big thing. Real-time chat,
          live tasks, and issue tracking.
        </motion.p>
        <div className="mt-4">
          <HackerType />
        </div>
        <div className="mt-8 flex gap-6 justify-center w-full">
          <Link to="/signup" className="btn rounded-full bg-primary hover:bg-primary/30 min-w-[10%]
              shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
              hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
              transition duration-300 border-hidden text-primary-content hover:scale-110">Get Started</Link>

          <Link to="/explore" className="btn rounded-full bg-secondary hover:bg-secondary/30 min-w-[10%]
              shadow-[0_0_5px_theme(colors.primary),0_0_10px_theme(colors.secondary)] 
              hover:shadow-[0_0_10px_theme(colors.primary),0_0_20px_theme(colors.secondary)] 
              transition duration-300 border-hidden text-secondary-content hover:scale-110">Explore</Link>
        </div>
      </section>
      <section className="min-h-screen bg-gradient-to-b from-primary/5 via-base-200 to-base-300">
      <Section
        title="Organized Collaboration"
        text="Create and join projects, assign tasks, and communicate—all in one unified platform."
        image="/collab.webp"
        count={1}
      />

      <Section
        title="Real-time Group Chat"
        text="Discuss ideas, share progress, or just vibe with your team using the group chat feature."
        image="/videocall.webp"
        count={2}
      />

      <Section
        title="Raise & Resolve Issues"
        text="Smooth issue tracking to make sure your project never hits a roadblock."
        image="/issues.jpg"
        count={3}
      />

      <Section
        title="Showcase & Contribute"
        text="Public feed of projects lets you discover what others are building and contribute."
        image="/contribute.webp"
        count={4}
      />
      </section>

      <footer className="text-center py-10 text-sm text-gray-500 bg-base-100">
        Built with ❤️ by Raj | © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Homepage;
