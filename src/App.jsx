import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaCode, FaGithub, FaEnvelope, FaLinkedinIn, FaMapMarkerAlt, FaFilePdf, FaBookOpen, FaCalendarAlt } from 'react-icons/fa';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

// Utility for merging class names (cn)
const cn = (...cls) => cls.filter(Boolean).join(" ");

// Animation variants for smooth scrolling reveal
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// --- Utility: Typing Animation Hook (Robust Cycle with Erase) ---
const useTypingEffect = (texts, speed = 100, pause = 1500) => {
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const fullText = texts[textIndex];

    if (isDeleting) {
      // 1. ERASE: If deleting and not empty, remove one character quickly
      const eraseSpeed = speed / 3;
      timeout = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      }, eraseSpeed);
      
      // Check if erasing is complete
      if (currentText.length === 0) {
        setIsDeleting(false);
        // Move to the next phrase index in the list (cycles)
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      // 2. TYPE: If typing and not full, add one character slowly
      if (currentText.length < fullText.length) {
        timeout = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, speed);
      } 
      // 3. PAUSE: If typing is complete, pause then start deleting
      else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      }
    }

    // Cleanup function to clear the timeout when the component unmounts or state changes
    return () => clearTimeout(timeout);
    
  }, [texts, textIndex, currentText, isDeleting, speed, pause]);

  return currentText;
};

// --- Aesthetic Aurora Background (Subtle) ---
function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-white/95" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/70 to-white/70" />
      
      <div className="absolute -inset-[10%] blur-3xl opacity-15 mix-blend-multiply animate-[auroraMove_40s_linear_infinite]">
        <div className="aurora aurora-c" />
        <div className="aurora aurora-d" />
      </div>

      <style>{`
        .aurora{position:absolute;inset:0;background:conic-gradient(from 180deg at 50% 50%, rgba(59, 130, 246, 0.04), rgba(168, 85, 247, 0.06), rgba(236, 72, 153, 0.04));}
        .aurora-c{transform:scale(1.2); animation:auroraMove 30s linear infinite}
        .aurora-d{animation:auroraMove 40s linear infinite reverse; mix-blend-screen}
        @keyframes auroraMove{0%{transform:translate3d(-10%,-10%,0) rotate(0deg)}50%{transform:translate3d(10%,10%,0) rotate(180deg)}100%{transform:translate3d(-10%,-10%,0) rotate(360deg)}}
      `}</style>
    </div>
  );
}

// --- Navbar (Sleek Glassmorphism) ---
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useMemo(() => [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "blog", label: "Blog" }, 
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ], []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-4">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex items-center justify-between rounded-full border border-gray-200/50 bg-white/80 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md shadow-lg shadow-blue-100/40 transition-all duration-500">
          <a href="#home" className="inline-flex items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900 border-2 border-blue-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-50/50 transition-colors duration-300 hover:bg-blue-100/70">
              FB
            </span>
            <span className="text-gray-900 font-semibold hidden sm:inline">MERN Full-Stack Dev</span> 
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                className="relative inline-flex items-center px-3 py-2 rounded-full text-sm font-medium tracking-wide text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
              >
                {it.label}
              </a>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <IoCloseOutline className="w-6 h-6" /> : <IoMenuOutline className="w-6 h-6" />}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id="mobile-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-4 top-12 w-36 flex flex-col gap-1 p-2 rounded-xl border border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-xl"
                >
                  {items.map((it) => (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      onClick={() => setIsOpen(false)}
                      className="py-2 px-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
                    >
                      {it.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </header>
  );
}

// --- Interactive 3D Canvas (Particle Flow) ---
function Hero3D({ colorA = 0x3b82f6, colorB = 0x6366f1 }) {
  const mountRef = useRef();
  const requestRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      velocities[i * 3 + 2] = -0.005; 
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: colorA,
      size: 0.03,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true,
      opacity: 0.8
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    let last = Date.now();
    const animate = () => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;
      
      const pos = particles.attributes.position.array;
      const vel = particles.attributes.velocity.array;
      const boundary = 4;

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 2] += vel[i * 3 + 2] * dt * 60; 

        if (pos[i * 3 + 2] < -boundary) {
          pos[i * 3 + 2] = boundary;
        }

        particleSystem.rotation.y += 0.005 * dt * 60 * 0.08;
        particleSystem.rotation.x += 0.005 * dt * 60 * 0.08;
      }
      
      particles.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      const w2 = mount.clientWidth;
      const h2 = mount.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", onResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particles.dispose();
      particleMaterial.dispose();
    };
  }, [colorA, colorB]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full opacity-60" style={{ willChange: "transform" }} />;
}

// --- General Section Components ---
function PageContainer({ id, children, className }) {
  // Global class for consistent padding
  return (
    <section id={id} className={cn("relative mx-auto mt-16 sm:mt-20 max-w-7xl px-4 sm:px-6 py-8 sm:py-12", className)}>
      {children}
    </section>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <motion.div
      className="mb-10 sm:mb-12 text-center"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
    >
      <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 md:text-4xl">{title}</h2> 
      {desc && <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-sm sm:text-base text-gray-600">{desc}</p>}
      <div className="h-1 w-20 mx-auto mt-4 bg-blue-500 rounded-full" />
    </motion.div>
  );
}

// --- Home Section (Minimal and Adjusted Padding) ---
function HomeSection() {
  const titles = useMemo(() => [
    "robust MERN stack solutions.",
    "scalable full-stack applications.",
    "efficient, tested software.",
    "high-performance user interfaces.",
  ], []);

  const typedText = useTypingEffect(titles);

  return (
    <PageContainer 
      id="home" 
      className="pt-16 sm:pt-20 pb-0 flex flex-col items-center justify-center min-h-[75vh] sm:min-h-[70vh]"
    >
      
      {/* Profile Image with Glow */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative w-30 h-30 md:w-36 md:h-36 mx-auto mb-6 sm:mb-7 rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl shadow-blue-500/50 overflow-hidden"
      >
        <Hero3D />
        {/*  */}
        <div className="absolute inset-0.5 rounded-full overflow-hidden shadow-xl border-4 border-white">
          <img
            src="/images/Me.jpg"
            alt="Fatima Butt"
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]  hover:grayscale"
          />
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center max-w-4xl"
      >

        
        <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
          I build{' '}
          <motion.span 
            className="text-blue-600 font-black relative inline-block"
          >
            {/* Typing Effect Display */}
            {typedText}
            {/* Typing Cursor */}
            <motion.span
              className="w-0.5 bg-blue-600 h-full absolute -right-1 top-0 inline-block"
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 0 }}
            />
          </motion.span>
        </h1>
        
        <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-xs sm:text-base text-gray-600 font-medium px-2">
          A passionate Full-Stack MERN Developer with a strong foundation in DSA (250+ LeetCode problems). Proven skills in QA/Software Testing and delivering robust, performant applications.
        </p>
        
        {/* Buttons */}
        <div className="mt-5 sm:mt-7 flex justify-center items-center gap-3 flex-wrap sm:flex-nowrap">
  <motion.a
    href="#projects"
    className="rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition-all duration-300
               flex-1 min-w-0 sm:flex-none sm:max-w-none text-center"
    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px rgba(59, 130, 246, 0.4)" }}
    whileTap={{ scale: 0.98 }}
  >
    Explore Projects
  </motion.a>
  <motion.a
    href="/images/Fatima Butt.pdf"
    target="_blank"
    className="rounded-full border-2 border-blue-500 bg-white px-5 py-2.5 font-semibold text-blue-700 text-xs sm:text-sm transition-all duration-300
               flex-1 min-w-0 sm:flex-none sm:max-w-none text-center"
    whileHover={{ scale: 1.03, borderColor: "#155DFC", color: "#155DFC", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.98 }}
  >
    <FaFilePdf className="inline mr-2"/> Resume
  </motion.a>
</div>

      </motion.div>
    </PageContainer>
  );
}

// --- About Section (Scaled Down Text) ---
function AboutSection() {
  const timeline = useMemo(() => [
    { year: "2023–2027", title: "BSCS — Govt. University, Lahore", body: "Focusing on advanced CS fundamentals, algorithms, and applied mathematics." },
    { year: "Jul–Aug 2025", title: "QA Intern — eCare Solutions", body: "Contributed to API testing, detailed bug reporting, and initial Angular application exploration." },
    { year: "Jun–Sep 2025", title: "MERN Stack Developer (Bronze Certified)", body: "Completed a 3-month intensive MERN stack curriculum, solidifying full-stack development skills." },
    { year: "Aug–Sep 2025", title: "Frontend Intern — Elevvo Pathways", body: "Developed and maintained responsive web solutions using Wix, pure HTML/CSS, and JavaScript." },
  ], []);

  const TimelineItem = ({ t, index }) => (
    <motion.li 
      className="mb-6 sm:mb-8" 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute -left-4 w-6 h-6 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
      </div>
      <h4 className="text-base sm:text-lg font-semibold text-gray-900">{t.title}</h4> 
      <p className="text-xs uppercase tracking-widest text-blue-600 font-medium mt-1">{t.year}</p>
      <p className="mt-1 text-xs sm:text-sm text-gray-700">{t.body}</p> 
    </motion.li>
  );

  return (
    <PageContainer id="about">
      <SectionTitle title="My Journey & Philosophy" desc="I merge logical rigor with visual flair, ensuring every interface is performant, accessible, and engaging." />
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2"><FaCode className="text-blue-500"/> Education & Experience</h3> 
          <ol className="relative border-l-4 border-blue-200 pl-6">
            {timeline.map((t, index) => (
              <TimelineItem key={t.year} t={t} index={index} />
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={{...fadeIn, transition: { duration: 0.6, delay: 0.2 }}}
        >
          <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-lg sm:text-xl font-bold   text-gray-900 mb-5">Development Focus</h3>
            <ul className="space-y-4 text-gray-700 text-sm"> 
              <li className="flex items-start"><span className="text-blue-500 mr-3 text-xl">⚡</span>Performance: Writing clean, efficient, scalable code based on DSA principles.</li>
              <li className="flex items-start"><span className="text-blue-500 mr-3 text-xl">✨</span>UX/Animations: Utilizing Framer Motion for subtle, purposeful micro-interactions.</li>
              <li className="flex items-start"><span className="text-blue-500 mr-3 text-xl">🎨</span>Design Systems: Building interfaces with Tailwind, focusing on consistency and accessibility.</li>
              <li className="flex items-start"><span className="text-blue-500 mr-3 text-xl">🔗</span>Full-Stack: Dedicated to mastering the MERN stack for robust application architecture.</li>
            </ul>
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-center text-xs font-medium text-gray-800">
              {["Wix", "Tailwind", "React", "Node.js", "MongoDB", "Framer Motion"].map((skill) => (
                <motion.span 
                  key={skill} 
                  className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 transition-transform hover:bg-blue-100"
                  whileHover={{ scale: 1.05, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}

// --- Projects Section (Mobile Optimized Text) ---
// --- Projects Section (Compact & Mobile-Optimized) ---
function ProjectsSection() {
  const list = useMemo(() => [
    {
      title: "MERN Real‑Estate",
      desc: "A full-stack property listing platform with Firebase authentication and image storage.",
      tech: ["Mongo", "Express", "React", "Node", "Firebase"],
      code: "https://github.com/Fatimabutt786/Mern-Real-Estate",
      img: "/images/mern estate.jpg"
    },
    {
      title: "Prescripto — Doctor Booking",
      desc: "A booking app to streamline doctor appointments and schedule management.",
      tech: ["React", "Node", "Mongo", "Express", "Tailwind"],
      code: "https://github.com/Fatimabutt786/Prescripto",
      img: "/images/presc.png"
    },
    {
      title: "Random Joke Generator",
      desc: "Frontend utility to fetch and display jokes with playful animations.",
      tech: ["JavaScript", "HTML", "CSS", "API"],
      code: "https://github.com/Fatimabutt786/Random-joke-generator",
      img: "/images/joke.jpg"
    }
  ], []);

  const ProjectCard = ({ p, index }) => (
    <motion.article
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ ...fadeIn, transition: { duration: 0.5, delay: index * 0.1 } }}
    >
      <motion.div
        className="group flex flex-col h-full rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-blue-200/50"
        whileHover={{ y: -3, boxShadow: "0 6px 15px rgba(59, 130, 246, 0.15)" }}
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={p.img}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-gray-900 text-sm sm:text-base md:text-lg font-bold">{p.title}</h3>
          <p className="mt-1 text-gray-600 text-xs sm:text-sm md:text-base flex-grow">{p.desc}</p>
          <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
            {p.tech.map((t) => (
              <span
                key={t}
                className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-blue-600"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <a
              href={p.code}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gray-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <FaGithub /> Code
            </a>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );

  return (
    <PageContainer id="projects" className="pt-10 sm:pt-12 pb-8">
      <SectionTitle
        title="Featured Creations"
        desc="A selection of full-stack and frontend projects, showcasing modern design and solid code."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, index) => (
          <ProjectCard key={p.title} p={p} index={index} />
        ))}
      </div>
      <div className="mt-8 sm:mt-10 text-center">
        <a
          href="https://github.com/Fatimabutt786"
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full bg-blue-600 px-4 sm:px-6 py-2 sm:py-3 text-white font-semibold text-xs sm:text-sm shadow-md hover:bg-blue-700 transition duration-300"
        >
          More on GitHub <span className="ml-1 text-lg">🚀</span>
        </a>
      </div>
    </PageContainer>
  );
}



// --- Blog Modal Component (SIMPLIFIED - Scroll handled in parent) ---
function BlogModal({ post, onClose }) {
  if (!post) return null;

  // SCROLL FIX: The scroll management (overflow: hidden/unset) is now handled 
  // exclusively in the parent BlogSection's useEffect based on the 'post' state.

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm bg-gray-900/70"
        onClick={onClose} 
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors z-10 border border-gray-200"
            aria-label="Close Post"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>

          <div className="p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium border-b pb-4 mb-6">
              <FaCalendarAlt className="w-4 h-4"/>
              <span>{post.date}</span>
            </div>
            
            {/* Full Content loaded via dangerouslySetInnerHTML */}
            <div 
              className="prose max-w-none text-gray-700" 
              dangerouslySetInnerHTML={{ __html: post.fullContent }} 
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// --- Blog Section (Simplified to ONE Featured Post - FIX SCROLL HERE) ---
function BlogSection() {
  const [selectedPost, setSelectedPost] = useState(null); 

  // FIX: Control the body scroll based on the selectedPost state
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      // Use a timeout to ensure the Framer Motion exit animation completes (0.3s)
      // before re-enabling scroll. This is the robust solution.
      const timeoutId = setTimeout(() => {
        document.body.style.overflow = 'unset';
      }, 300); 

      return () => clearTimeout(timeoutId);
    }
  }, [selectedPost]);


  // Define the ONE featured post directly
  const featuredPost = { 
    id: 1, 
    title: "My Journey into Tech: From Curiosity to Full-Stack Development", 
    date: "Nov 24, 2025", 
    summary: "Every journey in tech is a story of curiosity, learning, and perseverance. For me, it started with a fascination for problem-solving and the excitement of turning ideas into code. Over time, this curiosity evolved into a passion for web development and creating meaningful digital experiences.",
    fullContent: `
      <p class="mb-4 text-base text-gray-700">Every journey in tech is a story of curiosity, learning, and perseverance. For me, it started with a fascination for problem-solving and the excitement of turning ideas into code. Over time, this curiosity evolved into a passion for web development and creating meaningful digital experiences.</p>
      
      <h4 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Tackling Complex Challenges</h4>
      <p class="mb-4 text-base text-gray-700">In my academic and tech experiences, I’ve tackled complex challenges, learned new technologies, and continuously pushed myself to improve. I enjoy taking on projects that test my skills, from building responsive websites with **React, Framer Motion, and Tailwind CSS**, to implementing clean and efficient code that not only works but also looks professional.</p>

      <h4 class="text-xl font-semibold text-gray-900 mt-6 mb-3">A Mindset of Continuous Growth</h4>
      <p class="mb-4 text-base text-gray-700">What defines me is not just my technical knowledge, but my approach: I **embrace challenges as opportunities**, stay committed to growth, and maintain a mindset of continuous learning. Each project I complete strengthens my problem-solving abilities and creativity, preparing me to contribute effectively in any professional environment.</p>

      <p class="text-base text-gray-700 font-bold mt-6">I am driven by the desire to create impactful solutions, learn from every experience, and deliver work that exceeds expectations. My goal is to join teams where I can make a tangible difference, grow alongside talented professionals, and continue building skills that drive innovation.</p>
    `,
    link: "#" 
  };

  const handleOpenModal = (e) => {
    e.preventDefault();
    setSelectedPost(featuredPost);
  };

  return (
    <PageContainer id="blog">
      <SectionTitle 
        title="Featured Article: My Tech Journey" 
        desc="A dive into my motivations, learning process, and philosophy as a MERN Full-Stack Developer." 
      />
      
      {/* Container for the single, centered card */}
      <div className="w-full px-4 sm:px-6 lg:px-8"> 
  <motion.article
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
      className="w-full min-h-[300px] max-w-6xl mx-auto" 
  >

           <div 
  onClick={handleOpenModal} 
  className="flex flex-col h-full rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-400 cursor-pointer"
>

              <div className="flex items-center gap-3 text-sm text-blue-600 font-semibold mb-2">
                <FaBookOpen className="w-4 h-4"/> Featured Post
              </div>
              <h3 className="text-gray-900 text-xl sm:text-2xl font-bold transition-colors">{featuredPost.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                <FaCalendarAlt className="w-3 h-3"/>
                <span>{featuredPost.date}</span>
              </div>
              
              <p className="mt-1 text-gray-700 text-sm sm:text-base flex-grow line-clamp-4">
                {featuredPost.summary}
              </p>
              
              <div className="mt-4 text-blue-600 text-sm font-semibold flex items-center gap-2">
                Read Full Article (Open Modal)
                <span className="ml-1 transition-transform">→</span>
              </div>
            </div>
        </motion.article>
      </div>
      
      {/* RENDER MODAL */}
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </PageContainer>
  );
}

// --- Skills Section (Scaled Down Text) ---
function SkillsSection() {
  const skills = useMemo(() => [
    { name: "HTML/CSS (Tailwind)", v: 95 },
    { name: "JavaScript (ES6+)", v: 88 },
    { name: "React / Next.js", v: 80 },
    { name: "C++ (OOP/DSA)", v: 92 },
    { name: "Node.js / Express", v: 75 },
    { name: "MongoDB / Mongoose", v: 70 },
  ], []);

  const SkillBar = ({ s, index }) => (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.5 }}
      variants={{...fadeIn, transition: { duration: 0.6, delay: index * 0.1 }}}
      className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-gray-900 font-bold text-sm sm:text-base">{s.name}</span> 
        <span className="text-blue-600 font-semibold text-xs sm:text-sm">{s.v}%</span> 
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${s.v}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.5, delay: index * 0.1, ease: "easeInOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-inner"
        />
      </div>
    </motion.div>
  );

  return (
    <PageContainer id="skills">
      <SectionTitle title="Core Technical Toolkit" desc="The languages, frameworks, and tools I use to build robust and beautiful applications." />
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((s, index) => <SkillBar key={s.name} s={s} index={index} />)}
      </div>
    </PageContainer>
  );
}

// --- Contact Section (Scaled Up Text, Mobile Friendly) ---
function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sentMsg, setSentMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill all fields.");
      return;
    }
    setError(""); setIsSending(true);

    // IMPORTANT: Replace with your actual EmailJS Service ID, Template ID, and Public Key
    emailjs.send("service_4gw5ozw", "template_dlk692o", formData, "MiBcVlx2PtuyWZ0L9")
      .then(() => {
        setSentMsg(`Thanks ${formData.name.split(" ")[0]}, your message has been sent successfully!`);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSentMsg(""), 7000);
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setIsSending(false));
  };

  const ContactLink = ({ href, icon: Icon, text, subText, target = "_blank" }) => (
    <motion.li 
      className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50 hover:bg-blue-100 transition-colors cursor-pointer" 
      whileHover={{ x: 5 }}
    >
      <Icon className="text-blue-600 text-2xl flex-shrink-0" /> 
      <div className="flex flex-col">
        {href ? (
          <a 
            href={href} 
            target={target} 
            rel="noreferrer" 
            className="text-gray-900 font-medium hover:text-blue-700 transition-colors text-base"
          >
            {text}
          </a>
        ) : (
          <span className="text-gray-900 font-medium text-base">{text}</span> 
        )}
        <span className="text-sm text-gray-500">{subText}</span>
      </div>
    </motion.li>
  );

  return (
    <PageContainer id="contact">
      <SectionTitle title="Let’s Connect" desc="Open to freelance opportunities, internships, and exciting collaborations. Send a message, and I'll respond swiftly." />
      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl" 
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5">Send Me a Message</h3> 
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-base" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-base" />
          <textarea rows={4} name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-base" />
          {error && <p className="mt-2 text-red-500 text-sm font-medium">{error}</p>}
          <motion.button
            type="submit" disabled={isSending}
            className={`mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold text-base shadow-md transition duration-300 ${isSending ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/40"}`}
            whileHover={{ scale: isSending ? 1 : 1.02 }}
            whileTap={{ scale: isSending ? 1 : 0.98 }}
          >
            {isSending ? "Sending..." : "Send Message"}
          </motion.button>
          {sentMsg && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-green-600 text-center font-medium text-sm">{sentMsg}</motion.p>}
        </motion.form>

        {/* Quick Contact Info */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={{...fadeIn, transition: { duration: 0.6, delay: 0.2 }}}
          className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xl" 
        >
          <h3 className="text-xl font-bold text-gray-900 mb-5">Find Me Online</h3> 
          <ul className="flex flex-col gap-3">
            <ContactLink icon={FaEnvelope} text="fatimabutt2k23@gmail.com" subText="Send an email" href="mailto:fatimabutt2k23@gmail.com" target="_self" />
            <ContactLink icon={FaMapMarkerAlt} text="Lahore, Pakistan" subText="Willing to work remotely" href={null} />
            <ContactLink icon={FaLinkedinIn} text="Fatima Butt on LinkedIn" subText="Connect professionally" href="https://www.linkedin.com/in/fatima-butt-bb31a529b/" />
            <ContactLink icon={FaGithub} text="Fatimabutt786" subText="View all repositories" href="https://github.com/Fatimabutt786" />
            <ContactLink icon={FaFilePdf} text="Download Resume (PDF)" subText="Detailed career history" href="/images/Fatima Butt.pdf" />
          </ul>
        </motion.div>
      </div>
    </PageContainer>
  );
}

// --- Footer (Minimalist) ---
function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8 text-center text-gray-600">
        <div className="mb-4 flex justify-center gap-5 text-xl">
          <motion.a href="mailto:fatimabutt2k23@gmail.com" className="hover:text-blue-600 transition-colors" whileHover={{ scale: 1.1 }}>
            <FaEnvelope />
          </motion.a>
          <motion.a href="https://www.linkedin.com/in/fatima-shahzad-bb31a529b/" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors" whileHover={{ scale: 1.1 }}>
            <FaLinkedinIn />
          </motion.a>
          <motion.a href="https://github.com/Fatimabutt786" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors" whileHover={{ scale: 1.1 }}>
            <FaGithub />
          </motion.a>
        </div>
        <p className="text-xs sm:text-sm">
          Built with <span className="text-red-500">❤️</span> by Fatima Butt. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

// --- Main App Component ---
export default function App() {
  return (
    <div className="min-h-screen text-gray-900 bg-gray-50/70 antialiased">
      <AuroraBackground />
      <Navbar />
      <main>
        <HomeSection />
        <AboutSection />
        <ProjectsSection />
        <BlogSection />   
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
      
      {/* Scroll Padding Fix (For fixed navbar clipping) */}
      <style global jsx>{`
        /* Default for mobile and small screens */
        html {
          scroll-padding-top: 80px; 
        }
        /* For larger screens where the header might be taller */
        @media (min-width: 768px) {
          html {
            scroll-padding-top: 90px; 
          }
        }
      `}</style>
    </div>
  );
}