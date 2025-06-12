import React, { useState, useEffect } from "react";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const VideoCard = ({ title, description, duration, views }) => (
  <div className="glass-card group cursor-pointer">
    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">{title}</h3>
    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
    <div className="flex justify-between text-xs text-gray-400">
      <span>{duration}</span>
      <span>{views} views</span>
    </div>
  </div>
);

const Section = ({ id, title, subtitle, backgroundImage, videos, gradient }) => (
  <section 
    id={id}
    className="min-h-screen relative flex items-center justify-center px-6 py-20"
    style={{
      backgroundImage: `linear-gradient(${gradient}), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  >
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="glass-button">
          View All {title}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  </section>
);

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('masterclasses');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['masterclasses', 'careerpaths', 'crashcourses'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-nav flex space-x-1">
        {[
          { id: 'masterclasses', label: 'Masterclasses' },
          { id: 'careerpaths', label: 'Career Paths' },
          { id: 'crashcourses', label: 'Crash Courses' }
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeSection === id
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
};

function App() {
  const masterclassVideos = [
    {
      title: "Advanced React Patterns",
      description: "Deep dive into advanced React patterns including render props, compound components, and custom hooks.",
      duration: "2h 45m",
      views: "15.2K"
    },
    {
      title: "System Design Masterclass",
      description: "Learn how to design scalable systems from industry experts. Cover databases, caching, and microservices.",
      duration: "3h 20m",
      views: "28.5K"
    },
    {
      title: "AI/ML in Production",
      description: "Complete guide to deploying machine learning models in production environments with real-world examples.",
      duration: "2h 15m",
      views: "12.8K"
    }
  ];

  const careerPathVideos = [
    {
      title: "Full-Stack Developer Roadmap",
      description: "Complete roadmap from beginner to senior full-stack developer with hands-on projects and career advice.",
      duration: "1h 30m",
      views: "45.2K"
    },
    {
      title: "Product Manager Journey",
      description: "From technical background to product management: skills, interviews, and career transition strategies.",
      duration: "1h 45m",
      views: "23.1K"
    },
    {
      title: "DevOps Career Path",
      description: "Navigate your way into DevOps with practical skills, certifications, and industry insights.",
      duration: "2h 10m",
      views: "31.7K"
    }
  ];

  const crashCourseVideos = [
    {
      title: "JavaScript ES6+ Crash Course",
      description: "Master modern JavaScript features in just 2 hours. Arrow functions, promises, async/await, and more.",
      duration: "2h 00m",
      views: "89.3K"
    },
    {
      title: "Docker Fundamentals",
      description: "Get up and running with Docker containers. Perfect for students and developers new to containerization.",
      duration: "1h 20m",
      views: "56.4K"
    },
    {
      title: "Git & GitHub Essentials",
      description: "Version control fundamentals every developer needs to know. From basic commands to advanced workflows.",
      duration: "1h 15m",
      views: "72.9K"
    }
  ];

  return (
    <div className="App">
      <Navigation />
      
      <Section
        id="masterclasses"
        title="UIS Masterclasses"
        subtitle="Deep-dive into advanced topics with industry experts. Comprehensive courses designed for professionals looking to master complex skills and cutting-edge technologies."
        backgroundImage="https://images.pexels.com/photos/2330137/pexels-photo-2330137.jpeg"
        videos={masterclassVideos}
        gradient="135deg, rgba(79, 70, 229, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%"
      />

      <Section
        id="careerpaths"
        title="UIS Career Paths"
        subtitle="Structured learning journeys to advance your career. From entry-level to leadership roles, discover the skills and knowledge needed to achieve your professional goals."
        backgroundImage="https://images.unsplash.com/photo-1522211988038-6fcbb8c12c7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxsZWFybmluZ3xlbnwwfHx8YmxhY2t8MTc0OTc0MzU4NHww&ixlib=rb-4.1.0&q=85"
        videos={careerPathVideos}
        gradient="135deg, rgba(16, 185, 129, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%"
      />

      <Section
        id="crashcourses"
        title="UIS Student Crash Courses"
        subtitle="Quick, intensive courses for rapid skill acquisition. Perfect for students who need to learn essential concepts quickly and efficiently."
        backgroundImage="https://images.unsplash.com/photo-1494178270175-e96de2971df9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxsZWFybmluZ3xlbnwwfHx8YmxhY2t8MTc0OTc0MzU4NHww&ixlib=rb-4.1.0&q=85"
        videos={crashCourseVideos}
        gradient="135deg, rgba(245, 101, 101, 0.4) 0%, rgba(251, 191, 36, 0.4) 100%"
      />
    </div>
  );
}

export default App;