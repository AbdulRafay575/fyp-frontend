
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, User, Settings, GraduationCap, Home, LayoutDashboard, Film, HelpCircle } from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-card/95 backdrop-blur-sm shadow-sm py-4 sticky top-0 z-50 border-b border-border transition-colors duration-300">
      <div className="app-container">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold gradient-text">StudyGenius</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/dashboard') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/videos" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/videos') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <Film className="h-4 w-4" />
              <span>Videos</span>
            </Link>
            <Link 
              to="/questions" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/questions') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Exam Prep</span>
            </Link>
            <div className="flex items-center gap-3 ml-4">
              <ThemeToggle />
              <Link to="/profile">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Settings size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="default" className="flex items-center gap-2">
                  <User size={16} />
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Link to="/profile" className="mr-2">
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                <Settings size={16} />
              </Button>
            </Link>
            <button 
              className="text-foreground p-2 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 flex flex-col">
            <Link 
              to="/" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/videos" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/videos') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Film className="h-4 w-4" />
              <span>Videos</span>
            </Link>
            <Link 
              to="/questions" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/questions') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Exam Prep</span>
            </Link>
            <Link 
              to="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button variant="default" className="flex items-center gap-2 w-full justify-center mt-2">
                <User size={16} />
                <span>Sign In</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
