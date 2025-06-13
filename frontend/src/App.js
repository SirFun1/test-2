import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Course data
const courseData = {
  masterclasses: [
    {
      id: 1,
      title: "Advanced React Patterns",
      description: "Deep dive into advanced React patterns including render props, compound components, and custom hooks for building scalable applications.",
      duration: "2h 45m",
      views: "15.2K",
      instructor: "Sarah Chen",
      level: "Advanced",
      tags: ["React", "JavaScript", "Frontend", "Patterns"]
    },
    {
      id: 2,
      title: "System Design Masterclass",
      description: "Learn how to design scalable systems from industry experts. Cover databases, caching, load balancing, and microservices architecture.",
      duration: "3h 20m",
      views: "28.5K",
      instructor: "Michael Rodriguez",
      level: "Expert",
      tags: ["System Design", "Architecture", "Scalability", "Backend"]
    },
    {
      id: 3,
      title: "AI/ML in Production",
      description: "Complete guide to deploying machine learning models in production environments with real-world examples and best practices.",
      duration: "2h 15m",
      views: "12.8K",
      instructor: "Dr. Anna Kowalski",
      level: "Advanced",
      tags: ["AI", "Machine Learning", "Production", "MLOps"]
    },
    {
      id: 4,
      title: "Cloud Architecture Mastery",
      description: "Master cloud architecture patterns, serverless computing, and multi-cloud strategies for enterprise applications.",
      duration: "4h 10m",
      views: "19.3K",
      instructor: "James Wilson",
      level: "Expert",
      tags: ["Cloud", "AWS", "Architecture", "Serverless"]
    },
    {
      id: 5,
      title: "Advanced Database Design",
      description: "Deep dive into database optimization, indexing strategies, and NoSQL vs SQL decision making for high-performance applications.",
      duration: "3h 30m",
      views: "14.7K",
      instructor: "Lisa Zhang",
      level: "Advanced",
      tags: ["Database", "SQL", "NoSQL", "Performance"]
    },
    {
      id: 6,
      title: "Microservices Architecture",
      description: "Complete guide to designing, building, and deploying microservices with service mesh, API gateways, and distributed systems.",
      duration: "3h 45m",
      views: "22.1K",
      instructor: "David Kumar",
      level: "Expert",
      tags: ["Microservices", "Architecture", "API", "Distributed Systems"]
    }
  ],
  careerpaths: [
    {
      id: 1,
      title: "Full-Stack Developer Roadmap",
      description: "Complete roadmap from beginner to senior full-stack developer with hands-on projects, portfolio building, and career advice.",
      duration: "1h 30m",
      views: "45.2K",
      instructor: "Alex Thompson",
      level: "All Levels",
      tags: ["Full-Stack", "Career", "Portfolio", "Development"]
    },
    {
      id: 2,
      title: "Product Manager Journey",
      description: "From technical background to product management: skills development, stakeholder management, and career transition strategies.",
      duration: "1h 45m",
      views: "23.1K",
      instructor: "Maria Garcia",
      level: "Intermediate",
      tags: ["Product Management", "Career Transition", "Strategy", "Leadership"]
    },
    {
      id: 3,
      title: "DevOps Career Path",
      description: "Navigate your way into DevOps with practical skills, industry certifications, tools mastery, and salary negotiation.",
      duration: "2h 10m",
      views: "31.7K",
      instructor: "Robert Kim",
      level: "Intermediate",
      tags: ["DevOps", "Career", "Certification", "Tools"]
    },
    {
      id: 4,
      title: "Data Science Career Guide",
      description: "Comprehensive guide to becoming a data scientist: skills, projects, interview preparation, and industry insights.",
      duration: "2h 25m",
      views: "38.9K",
      instructor: "Dr. Emily Davis",
      level: "All Levels",
      tags: ["Data Science", "Analytics", "Career", "Python"]
    },
    {
      id: 5,
      title: "UX/UI Designer Path",
      description: "From design fundamentals to senior designer role: portfolio development, user research, and design thinking methodologies.",
      duration: "1h 55m",
      views: "27.4K",
      instructor: "Sophie Laurent",
      level: "Beginner",
      tags: ["UX", "UI", "Design", "Portfolio"]
    },
    {
      id: 6,
      title: "Tech Leadership Journey",
      description: "Transition from individual contributor to tech leader: team management, technical strategy, and executive communication.",
      duration: "2h 35m",
      views: "18.6K",
      instructor: "Mark Anderson",
      level: "Advanced",
      tags: ["Leadership", "Management", "Strategy", "Communication"]
    }
  ],
  crashcourses: [
    {
      id: 1,
      title: "JavaScript ES6+ Crash Course",
      description: "Master modern JavaScript features in just 2 hours. Arrow functions, promises, async/await, destructuring, and more.",
      duration: "2h 00m",
      views: "89.3K",
      instructor: "Ryan Miller",
      level: "Beginner",
      tags: ["JavaScript", "ES6", "Programming", "Fundamentals"]
    },
    {
      id: 2,
      title: "Docker Fundamentals",
      description: "Get up and running with Docker containers. Perfect for students and developers new to containerization technology.",
      duration: "1h 20m",
      views: "56.4K",
      instructor: "Carlos Mendez",
      level: "Beginner",
      tags: ["Docker", "Containers", "DevOps", "Tools"]
    },
    {
      id: 3,
      title: "Git & GitHub Essentials",
      description: "Version control fundamentals every developer needs to know. From basic commands to advanced workflows and collaboration.",
      duration: "1h 15m",
      views: "72.9K",
      instructor: "Jennifer Lee",
      level: "Beginner",
      tags: ["Git", "GitHub", "Version Control", "Collaboration"]
    },
    {
      id: 4,
      title: "Python Crash Course",
      description: "Learn Python programming from scratch in 90 minutes. Variables, functions, loops, and basic data structures.",
      duration: "1h 30m",
      views: "94.7K",
      instructor: "Ahmed Hassan",
      level: "Beginner",
      tags: ["Python", "Programming", "Basics", "Syntax"]
    },
    {
      id: 5,
      title: "SQL Quick Start",
      description: "Database querying essentials for beginners. SELECT, JOIN, GROUP BY, and database design fundamentals.",
      duration: "1h 45m",
      views: "67.2K",
      instructor: "Patricia Wong",
      level: "Beginner",
      tags: ["SQL", "Database", "Queries", "Data"]
    },
    {
      id: 6,
      title: "React Basics Crash Course",
      description: "Build your first React application in under 2 hours. Components, state, props, and event handling.",
      duration: "1h 50m",
      views: "83.1K",
      instructor: "Tom Bradley",
      level: "Beginner",
      tags: ["React", "JavaScript", "Components", "Frontend"]
    }
  ]
};

const VideoCard = ({ title, description, duration, views, instructor, level, tags }) => (
  <div className="glass-card group cursor-pointer">
    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-3 right-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          level === 'Expert' ? 'bg-red-500/80 text-white' :
          level === 'Advanced' ? 'bg-orange-500/80 text-white' :
          level === 'Intermediate' ? 'bg-yellow-500/80 text-black' :
          'bg-green-500/80 text-white'
        }`}>
          {level}
        </span>
      </div>
    </div>
    <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">{title}</h3>
    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{description}</p>
    <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
      <span>{duration}</span>
      <span>{views} views</span>
    </div>
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm text-gray-300">by {instructor}</span>
    </div>
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, 3).map((tag, index) => (
        <span key={index} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const SearchBar = ({ searchTerm, setSearchTerm, placeholder }) => (
  <div className="relative mb-8">
    <div className="glass-card p-0 overflow-hidden">
      <div className="flex items-center">
        <svg className="w-6 h-6 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-4 focus:outline-none text-lg"
        />
      </div>
    </div>
  </div>
);

const FilterBar = ({ selectedLevel, setSelectedLevel, selectedTags, setSelectedTags, allTags }) => (
  <div className="glass-card mb-8 p-4">
    <div className="flex flex-wrap gap-4 items-center">
      <h3 className="text-white font-semibold">Filters:</h3>
      
      <div className="flex items-center gap-2">
        <span className="text-gray-300 text-sm">Level:</span>
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-white/40"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
          <option value="All Levels">All Levels</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-gray-300 text-sm">Tags:</span>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => {
              setSelectedTags(prev => 
                prev.includes(tag) 
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
            className={`text-xs px-2 py-1 rounded-full transition-all ${
              selectedTags.includes(tag)
                ? 'bg-blue-500/80 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const CoursePage = ({ type, title, subtitle, backgroundImage, gradient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  const courses = courseData[type] || [];
  const allTags = [...new Set(courses.flatMap(course => course.tags))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => course.tags.includes(tag));

    return matchesSearch && matchesLevel && matchesTags;
  });

  return (
    <div 
      className="min-h-screen relative px-6 py-20"
      style={{
        backgroundImage: `linear-gradient(${gradient}), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="glass-button mb-8 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-8">
            {subtitle}
          </p>
          <div className="text-gray-300">
            <span className="text-2xl font-bold">{filteredCourses.length}</span> courses available
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={`Search ${title.toLowerCase()}...`}
        />

        <FilterBar
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allTags}
        />

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <VideoCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass-card inline-block p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-white text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-gray-300">Try adjusting your search or filters to find more courses.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ id, title, subtitle, backgroundImage, videos, gradient }) => {
  const navigate = useNavigate();

  return (
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
          <button 
            onClick={() => navigate(`/${id}`)}
            className="glass-button"
          >
            View All {title}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('masterclasses');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
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
    }
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (location.pathname !== '/') {
    return null;
  }

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

const HomePage = () => {
  const masterclassVideos = courseData.masterclasses.slice(0, 3);
  const careerPathVideos = courseData.careerpaths.slice(0, 3);
  const crashCourseVideos = courseData.crashcourses.slice(0, 3);

  return (
    <>
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
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/masterclasses" element={
            <CoursePage
              type="masterclasses"
              title="UIS Masterclasses"
              subtitle="Deep-dive into advanced topics with industry experts. Comprehensive courses designed for professionals looking to master complex skills and cutting-edge technologies."
              backgroundImage="https://images.pexels.com/photos/2330137/pexels-photo-2330137.jpeg"
              gradient="135deg, rgba(79, 70, 229, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%"
            />
          } />
          <Route path="/careerpaths" element={
            <CoursePage
              type="careerpaths"
              title="UIS Career Paths"
              subtitle="Structured learning journeys to advance your career. From entry-level to leadership roles, discover the skills and knowledge needed to achieve your professional goals."
              backgroundImage="https://images.unsplash.com/photo-1522211988038-6fcbb8c12c7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxsZWFybmluZ3xlbnwwfHx8YmxhY2t8MTc0OTc0MzU4NHww&ixlib=rb-4.1.0&q=85"
              gradient="135deg, rgba(16, 185, 129, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%"
            />
          } />
          <Route path="/crashcourses" element={
            <CoursePage
              type="crashcourses"
              title="UIS Student Crash Courses"
              subtitle="Quick, intensive courses for rapid skill acquisition. Perfect for students who need to learn essential concepts quickly and efficiently."
              backgroundImage="https://images.unsplash.com/photo-1494178270175-e96de2971df9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxsZWFybmluZ3xlbnwwfHx8YmxhY2t8MTc0OTc0MzU4NHww&ixlib=rb-4.1.0&q=85"
              gradient="135deg, rgba(245, 101, 101, 0.4) 0%, rgba(251, 191, 36, 0.4) 100%"
            />
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;