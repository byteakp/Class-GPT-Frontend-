
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Trash2, Eye, Download, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchTopics, deleteTopic } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface Topic {
  id: string;
  topic: string;
  type: string;
  created_at: string;
}

const Dashboard = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const data = await fetchTopics();
      setTopics(data);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
      toast({
        title: "Error",
        description: "Failed to load topics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTopic(id);
      setTopics(topics.filter(topic => topic.id !== id));
      toast({
        title: "Success",
        description: "Topic deleted successfully.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      all: 'bg-purple-500',
      overview: 'bg-blue-500',
      notes: 'bg-green-500',
      slides: 'bg-orange-500',
      mcqs: 'bg-pink-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Study Materials Dashboard
            </h1>
            <p className="text-lg text-slate-400">
              Manage and access your generated study materials
            </p>
          </div>
          <Link to="/generate">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <FileText className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </Link>
        </div>

        {topics.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No Study Materials Yet
              </h3>
              <p className="text-slate-500 max-w-md mb-6">
                You haven't generated any study materials yet. Create your first set of materials to get started.
              </p>
              <Link to="/generate">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Your First Materials
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2 line-clamp-2">
                        {topic.topic}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`${getTypeColor(topic.type)} text-white text-xs`}>
                          {topic.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-slate-400 flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(topic.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center space-x-2">
                    <div className="flex space-x-2">
                      <Link to={`/topic/${topic.id}`}>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/topic/${topic.id}?tab=export`}>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                          <Download className="mr-1 h-3 w-3" />
                          Export
                        </Button>
                      </Link>
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          disabled={deletingId === topic.id}
                        >
                          {deletingId === topic.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-800 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Study Material</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete "{topic.topic}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(topic.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
