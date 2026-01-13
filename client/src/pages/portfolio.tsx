import { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Github, Linkedin, Mail, Download, ExternalLink, 
  Code2, Database, Cloud, Terminal, ChevronDown,
  Briefcase, GraduationCap, Award, Send
} from 'lucide-react';
import { Scene3D } from '../components/Scene3D';

function ParticleField() {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      color: ['#00ffff', '#a855f7', '#ec4899'][Math.floor(Math.random() * 3)]
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function FloatingShape({ 
  className, 
  style, 
  delay = 0 
}: { 
  className: string; 
  style?: React.CSSProperties; 
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={style}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 360],
      }}
      transition={{
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: 20, repeat: Infinity, ease: 'linear', delay },
      }}
    />
  );
}

function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#0a0a0f]">
      <ParticleField />
      
      <motion.div 
        className="absolute inset-0"
        style={{ x: springX, y: springY }}
      >
        <FloatingShape 
          className="w-32 h-32 border-2 border-cyan-400/30 rounded-full"
          style={{ left: '10%', top: '20%', boxShadow: '0 0 40px rgba(0,255,255,0.2)' }}
          delay={0}
        />
        <FloatingShape 
          className="w-24 h-24 border-2 border-purple-500/30"
          style={{ right: '15%', top: '30%', transform: 'rotate(45deg)', boxShadow: '0 0 40px rgba(168,85,247,0.2)' }}
          delay={1}
        />
        <FloatingShape 
          className="w-20 h-20 border-2 border-pink-500/30"
          style={{ left: '20%', bottom: '25%', clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', boxShadow: '0 0 40px rgba(236,72,153,0.2)' }}
          delay={2}
        />
        <FloatingShape 
          className="w-16 h-16 border-2 border-cyan-400/20 rounded-lg"
          style={{ right: '25%', bottom: '35%', boxShadow: '0 0 30px rgba(0,255,255,0.15)' }}
          delay={1.5}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0a0f]/80" />
      
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-move 20s linear infinite'
        }}
      />
    </div>
  );
}

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const skills = {
  'Languages': ['Java', 'Python', 'C++', 'C'],
  'Frameworks': ['Spring Boot', 'Apache Camel', 'Hibernate', 'Angular'],
  'Databases': ['MySQL', 'Couchbase', 'PostgreSQL'],
  'DevOps & Cloud': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Git'],
  'Tools': ['REST API', 'Maven', 'Kafka', 'Linux']
};

const experiences = [
  {
    company: 'AMDOCS',
    role: 'Software Engineer',
    period: '07/2023 – 07/2025',
    location: 'Pune, Maharashtra',
    projects: [
      {
        name: 'XL Axiata',
        highlights: [
          'Implemented third-party service integrations, improving system communication',
          'Designed testing and Camunda workflows, increasing test execution speed by 5%',
          'Collaborated on database optimization, reducing query response time by 10%'
        ]
      },
      {
        name: 'Vodafone Germany',
        highlights: [
          'Developed applications using Java, Spring Boot, Angular, and REST APIs',
          'Optimized database queries, cutting report generation time by over 10%',
          'Automated testing using TestNG, raising coverage from 60% to 90%'
        ]
      },
      {
        name: 'OPTIMA Philippines',
        highlights: [
          'Built Camel microservices handling 1M+ daily transactions',
          'Implemented Jenkins-based CI/CD pipelines reducing deployment efforts by 20%',
          'Contributed to Agile Scrum ceremonies and cross-functional code reviews'
        ]
      }
    ]
  }
];

const projects = [
  {
    title: 'MS-BUILDER',
    description: 'Developed a microservice builder that generates Spring Boot services from OpenAPI specifications with auto-generated REST APIs, Docker setup, and Jenkins pipelines.',
    tech: ['Spring Boot', 'OpenAPI', 'Docker', 'Jenkins']
  },
  {
    title: 'NIT Warangal Summer School',
    description: 'Implemented robust algorithm utilizing STR-DFT using Python libraries achieving accuracy rates exceeding 95%.',
    tech: ['Python', 'NumPy', 'Pandas', 'Mathematical Modeling']
  }
];

const achievements = [
  'AWS Cloud Practitioner Certified',
  'Kubernetes for Beginners Certified',
  'AIR 177 in NIMCET',
  '4th place in NITW Hackathon',
  'Amdocs India Coding Champion'
];

export default function Portfolio() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-50" />
      
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="section-hero">
        <Scene3D />
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <h1 className="font-display text-6xl md:text-8xl text-glow-cyan mb-4" data-testid="text-name">
              Vishal Thakur
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            data-testid="text-role"
          >
            <span className="gradient-text font-semibold">Software Engineer</span> · Microservices · Cloud Architecture
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#projects"
              className="glass px-8 py-3 rounded-full text-primary hover:box-glow-cyan transition-all duration-300 flex items-center gap-2 group"
              data-testid="button-view-projects"
            >
              View Projects
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/attached_assets/VishalThakur_Resume_1768243561894.pdf"
              target="_blank"
              className="glass-strong px-8 py-3 rounded-full text-secondary hover:box-glow-purple transition-all duration-300 flex items-center gap-2 group"
              data-testid="button-download-resume"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              Download Resume
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
              <ChevronDown className="w-8 h-8 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      <section id="about" className="relative py-32 px-4" data-testid="section-about">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl text-glow-purple mb-12 text-center">About Me</h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="glass-strong rounded-2xl p-8 md:p-12 noise-overlay relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed relative z-10" data-testid="text-about">
                Software Engineer with <span className="text-primary font-semibold">2+ years</span> of experience in 
                <span className="text-secondary font-semibold"> Java, Spring Boot, Apache Camel</span>, and microservices 
                architecture within the telecom domain. Experienced in building 
                <span className="text-accent font-semibold"> high-throughput REST APIs</span>, CI/CD automation using Jenkins, 
                containerization with Docker, and deployment on Kubernetes/OpenShift. Strong focus on 
                performance optimization, scalability, and Agile-driven delivery.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-8 relative z-10">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                   className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:box-glow-cyan transition-all" data-testid="link-github">
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                   className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:box-glow-purple transition-all" data-testid="link-linkedin">
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
                <a href="mailto:vishalth115@gmail.com"
                   className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:box-glow-cyan transition-all" data-testid="link-email">
                  <Mail className="w-5 h-5" />
                  vishalth115@gmail.com
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="skills" className="relative py-32 px-4" data-testid="section-skills">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl text-glow-cyan mb-16 text-center">Skills</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <AnimatedSection key={category} delay={idx * 0.1}>
                <div className="glass-strong rounded-2xl p-6 h-full hover:box-glow-purple transition-all duration-500 group">
                  <div className="flex items-center gap-3 mb-4">
                    {category === 'Languages' && <Code2 className="w-6 h-6 text-primary" />}
                    {category === 'Frameworks' && <Terminal className="w-6 h-6 text-secondary" />}
                    {category === 'Databases' && <Database className="w-6 h-6 text-accent" />}
                    {category === 'DevOps & Cloud' && <Cloud className="w-6 h-6 text-primary" />}
                    {category === 'Tools' && <Briefcase className="w-6 h-6 text-secondary" />}
                    <h3 className="text-xl font-semibold">{category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full text-sm glass transition-all duration-300 cursor-default
                          ${hoveredSkill === skill ? 'box-glow-cyan text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        data-testid={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="relative py-32 px-4" data-testid="section-experience">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl text-glow-magenta mb-16 text-center">Experience</h2>
          </AnimatedSection>
          
          {experiences.map((exp, expIdx) => (
            <AnimatedSection key={exp.company} delay={0.2}>
              <div className="glass-strong rounded-2xl p-8 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold gradient-text">{exp.company}</h3>
                    <p className="text-lg text-muted-foreground">{exp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-mono">{exp.period}</p>
                    <p className="text-muted-foreground text-sm">{exp.location}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {exp.projects.map((project, projIdx) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: projIdx * 0.1 }}
                      viewport={{ once: true }}
                      className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                      <h4 className="text-lg font-semibold text-secondary mb-2">{project.name}</h4>
                      <ul className="space-y-1">
                        {project.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-primary mt-1.5">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section id="projects" className="relative py-32 px-4" data-testid="section-projects">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl text-glow-cyan mb-16 text-center">Projects</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <AnimatedSection key={project.title} delay={idx * 0.15}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="glass-strong rounded-2xl p-8 h-full group cursor-pointer"
                  data-testid={`card-project-${idx}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors relative z-10">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 relative z-10">{project.description}</p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="education" className="relative py-32 px-4" data-testid="section-education">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl text-glow-purple mb-16 text-center">Education & Achievements</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="glass-strong rounded-2xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-bold">Education</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold gradient-text">Master of Computer Applications</h4>
                    <p className="text-muted-foreground">National Institute of Technology, Warangal</p>
                    <p className="text-sm text-primary font-mono">2020 – 2023</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="glass-strong rounded-2xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8 text-accent" />
                  <h3 className="text-xl font-bold">Achievements</h3>
                </div>
                <ul className="space-y-3">
                  {achievements.map((achievement, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="text-accent mt-1">✦</span>
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-32 px-4" data-testid="section-contact">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl text-glow-cyan mb-8">Get In Touch</h2>
            <p className="text-muted-foreground text-lg mb-12">
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="mailto:vishalth115@gmail.com"
                className="glass-strong px-8 py-4 rounded-full flex items-center gap-3 hover:box-glow-cyan transition-all group"
                data-testid="button-send-email"
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span className="gradient-text font-semibold">vishalth115@gmail.com</span>
              </a>
              <a
                href="tel:+918982762718"
                className="glass px-8 py-4 rounded-full text-muted-foreground hover:text-foreground transition-all"
                data-testid="button-call"
              >
                +91 8982762718
              </a>
            </div>
            
            <div className="flex justify-center gap-6 mt-12">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 glass rounded-full flex items-center justify-center hover:box-glow-cyan transition-all"
                 data-testid="social-github">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="w-12 h-12 glass rounded-full flex items-center justify-center hover:box-glow-purple transition-all"
                 data-testid="social-linkedin">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="mailto:vishalth115@gmail.com"
                 className="w-12 h-12 glass rounded-full flex items-center justify-center hover:box-glow-cyan transition-all"
                 data-testid="social-email">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <footer className="relative py-8 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 Vishal Thakur. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with <span className="text-primary">React</span> & <span className="text-secondary">Three.js</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
