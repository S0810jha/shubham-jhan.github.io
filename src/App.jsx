import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Phone, 
  ExternalLink, 
  Code2, 
  Database, 
  Server, 
  Cpu, 
  Menu, 
  X,
  ChevronDown,
  BarChart2, // Used for Codeforces
  Send,      // Used for Send Button
  CheckCircle // Used for Success Message
} from 'lucide-react';

import emailjs from "@emailjs/browser";



/**
 * CUSTOM HOOK: useOnScreen
 * Detects when an element enters the viewport for scroll animations.
 */

function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin, threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);

  return isIntersecting;
}



/**
 * COMPONENT: SectionReveal
 * Wraps content to animate it when it scrolls into view.
 */

const SectionReveal = ({ children, delay = 0 }) => {
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-50px");

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        onScreen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Form State
  const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'sending', 'success'

  const formRef = useRef(null);


  // Handle Navbar Background on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

const handleSendMessage = (e) => {
  e.preventDefault();
  setFormStatus("sending");

  emailjs
    .sendForm(
      import.meta.env.VITE_EMAIL_SERVICE,
      import.meta.env.VITE_EMAIL_TEMPLATE,
      formRef.current,
      import.meta.env.VITE_EMAIL_PUBLIC
    )
    .then(
      () => {
        setFormStatus("success");
        setTimeout(() => {
          setFormStatus("idle");
          e.target.reset();
        }, 3000);
      },
      (error) => {
        console.error(error);
        alert("❌ Failed to send message");
        setFormStatus("idle");
      }
    );
};



  // --- DATA FROM RESUME ---
  const skills = [
    {
      category: "Frontend",
      icon: <Code2 className="w-6 h-6 text-cyan-400" />,
      items: ["React.js", "Tailwind CSS", "HTML5/CSS3", "JavaScript (ES6+)", "Context API", "Axios"]
    },
    {
      category: "Backend",
      icon: <Server className="w-6 h-6 text-purple-400" />,
      items: ["Node.js", "Express.js", "RESTful APIs", "JWT Auth", "MVC Architecture", "Bcrypt"]
    },
    {
      category: "Languages & Tools",
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      items: ["C++", "DSA (Data Structures)", "MongoDB", "Mongoose", "Git & GitHub", "Postman", "VS Code"]
    }
  ];



  const projects = [
    {
      title: "Doctors Booking System",
      tech: ["MERN Stack", "Tailwind", "JWT"],
      description: "A full-stack platform with role-based access for patients and doctors. Features real-time slot availability, appointment booking/tracking, and secure authentication.",
      points: [
        "Secure user authentication & role-based access",
        "RESTful APIs for appointments & profiles",
        "Optimized database structure for fast querying"
      ],
      link: "https://apollacite.vercel.app/",
      git: "https://github.com/S0810jha/apollacite"
    },
    {
      title: "Task Manager Dashboard",
      tech: ["MERN Stack", "Chart.js", "Tailwind"],
      description: "An interactive dashboard for task management. Includes CRUD functionality and visual data representation using dynamic charts for task status.",
      points: [
        "Complete CRUD (Add, Update, Delete tasks)",
        "Dynamic circular pie chart for status visualization",
        "Real-time UI updates"
      ],
      link: "https://task-manager-brown-eight-57.vercel.app/",
      git: "https://github.com/S0810jha/Task-Manager"
    }
  ];



  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className={`px-[11%] fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 cursor-pointer" onClick={() => scrollToSection('hero')}>
            SJ.
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-cyan-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col space-y-4">
            {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-left text-slate-300 hover:text-cyan-400 py-2"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <SectionReveal>
          <div className="inline-block px-4 py-1.5 mb-6 border border-cyan-500/30 rounded-full bg-cyan-900/10 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            MERN Stack Developer
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
            Shubham <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Jhan</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Building scalable, user-friendly web applications with MongoDB, Express, React, and Node.js. 
            Passionate about clean code and modern UI design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-[0_0_20px_-5px_rgba(8,145,178,0.5)] hover:shadow-[0_0_30px_-5px_rgba(8,145,178,0.6)]"
            >
              View Projects
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3.5 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 transition-all"
            >
              Contact Me
            </button>
          </div>

          <div className="mt-12 flex gap-6 justify-center">
            <a href="https://github.com/S0810jha" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors hover:scale-110 transform duration-200" title="GitHub">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/shubhamjhan03" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors hover:scale-110 transform duration-200" title="LinkedIn">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://codeforces.com/profile/shubham0310" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors hover:scale-110 transform duration-200" title="Codeforces">
              <BarChart2 className="w-6 h-6" />
            </a>
            <a href="mailto:shubhamjha03102003@gmail.com" className="text-slate-400 hover:text-cyan-400 transition-colors hover:scale-110 transform duration-200" title="Email">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </SectionReveal>

        <div className="absolute bottom-10 animate-bounce text-slate-600">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>


      {/* --- ABOUT SECTION --- */}
      <section id="about" className="relative z-10 py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <SectionReveal>
            <div className="flex flex-col md:flex-row items-center gap-12 bg-slate-900/50 backdrop-blur-sm border border-white/5 p-8 md:p-12 rounded-3xl">
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">About <span className="text-purple-400">Me</span></h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  I am a self-driven <strong className="text-slate-200">MERN Stack Developer</strong> currently pursuing my BCA from Maharshi Dayanand University (2026).
                  I specialize in building responsive, user-friendly web applications using the modern JavaScript ecosystem.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  With a strong foundation in <strong className="text-slate-200">REST APIs, Authentication, and MVC architecture</strong>, 
                  I enjoy solving complex problems and optimizing code for performance. Whether it's designing a sleek UI with Tailwind 
                  or structuring a scalable backend with Node.js, I am passionate about every layer of development.
                </p>
              </div>

              
              {/* Abstract Profile Visual instead of image for privacy/aesthetic */}
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-48 h-65 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-70"></div>
                    <img src="shubham.jpg" className="absolute inset-0 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center  group-hover:-rotate-6 transition-transform duration-500 z-10" alt="" />
                  {/* <div className="absolute inset-0 bg-slate-800 border border-white/10 rounded-2xl flex items-center justify-center -rotate-3 group-hover:-rotate-6 transition-transform duration-500 z-10">
                     <Cpu className="w-16 h-16 text-slate-500 group-hover:text-cyan-400 transition-colors duration-500" /> 
                  </div> */}
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* --- SKILLS SECTION --- */}
      <section id="skills" className="relative z-10 py-24 px-6 bg-slate-900/30">
        <div className="container mx-auto max-w-6xl">
          <SectionReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
              Technical <span className="text-cyan-400">Arsenal</span>
            </h2>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <SectionReveal key={index} delay={index * 150}>
                <div className="h-full bg-slate-900/60 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-900/20 transition-all duration-300 group">
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-xl inline-block group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{skill.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span key={item} className="px-3 py-1 text-sm bg-slate-800 text-slate-300 rounded-full border border-white/5 hover:border-cyan-500/30 hover:text-cyan-300 transition-colors">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROJECTS SECTION --- */}
      <section id="projects" className="relative z-10 py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <SectionReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
              Featured <span className="text-purple-400">Projects</span>
            </h2>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <SectionReveal key={index} delay={index * 200}>
                <div className="group relative bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col">
                  {/* Decorative Header */}
                  <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                      <a href={project.link} target='_blank'>
                        <ExternalLink className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                      </a>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t) => (
                        <span key={t} className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-slate-400 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <ul className="space-y-2">
                      {project.points.map((point, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-500">
                          <span className="mr-2 text-cyan-500 mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <a href={project.git} target='_blank'>
                      <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-900/20 group-hover:text-cyan-300">
                          View Code <Github className="w-4 h-4" />
                      </button>
                    </a>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="relative z-10 py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="container mx-auto max-w-4xl">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Let's <span className="text-cyan-400">Connect</span></h2>
              <p className="text-slate-400 text-lg">Looking for a dedicated MERN Stack developer? I'm open to opportunities.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 bg-slate-950/50 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
              {/* Contact Info */}
              <div className="space-y-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 group">
                  <div className="p-4 rounded-full bg-slate-900 text-cyan-400 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-900/20">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-500 uppercase tracking-wider">Email</h4>
                    <a href="mailto:shubhamjha03102003@gmail.com" className="text-lg text-white hover:text-cyan-400 transition-colors break-all">
                      shubhamjha03102003@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <div className="p-4 rounded-full bg-slate-900 text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-500 uppercase tracking-wider">Phone</h4>
                    <p className="text-lg text-white">9027346760</p>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <a href="https://github.com/S0810jha" className="p-3 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
                    <Github />
                  </a>
                  <a href="https://linkedin.com/shubhamjhan03" className="p-3 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">
                    <Linkedin />
                  </a>
                </div>
              </div>

              {/* Functional Contact Form */}
              <form ref={formRef} className="space-y-4" onSubmit={handleSendMessage}>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Name</label>
                  <input required type="text" name='name' className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input required type="email" name='email' className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Message</label>
                  <textarea required name='message' className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors h-32 resize-none" placeholder="Hello, I'd like to discuss a project..."></textarea>
                </div>
                
                <button 
                  disabled={formStatus === 'sending' || formStatus === 'success'}
                  className={`w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                    formStatus === 'success' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:opacity-90'
                  }`}
                >
                  {formStatus === 'idle' && (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                  {formStatus === 'sending' && (
                    <>
                      Sending... 
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </>
                  )}
                  {formStatus === 'success' && (
                    <>
                      Message Sent! <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950">
        <p>© 2026 Shubham Jhan. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}



