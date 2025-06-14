
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Github } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Brain className="h-8 w-8 text-black" />
            <span className="text-xl font-bold text-black">ClassGPT</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <a href="https://github.com/byteakp" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-black hover:bg-gray-100"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
