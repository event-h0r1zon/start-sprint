import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendedVideosProps {
  selectedSport: string;
  onBack: () => void;
}

const RecommendedVideos: React.FC<RecommendedVideosProps> = ({
  selectedSport,
  onBack,
}) => {
  const recommendedVideos = {
    boxing: [
      { 
        title: 'Perfect Jab Technique', 
        url: 'https://example.com/video1', 
        thumbnail: '🥊', 
        duration: '5:30',
        description: 'Learn the proper form for throwing a jab while maintaining chin protection'
      },
      { 
        title: 'Common Jab Mistakes to Avoid', 
        url: 'https://example.com/video2', 
        thumbnail: '⚠️', 
        duration: '4:15',
        description: 'Fix these common mistakes in your jab technique and guard position'
      },
      { 
        title: 'Chin Protection Drills', 
        url: 'https://example.com/video3', 
        thumbnail: '🛡️', 
        duration: '7:15',
        description: 'Essential drills to maintain proper guard while throwing jabs'
      },
      { 
        title: 'Shadow Boxing: Jab Focus', 
        url: 'https://example.com/video4', 
        thumbnail: '👊', 
        duration: '6:45',
        description: 'Practice your jab technique with these shadow boxing exercises'
      }
    ],
    yoga: [
      { title: 'Basic Yoga Poses', url: 'https://example.com/yoga1', thumbnail: '🧘‍♀️', duration: '10:00' },
      { title: 'Morning Yoga Flow', url: 'https://example.com/yoga2', thumbnail: '🌅', duration: '15:00' },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Recommended Technique Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedVideos[selectedSport as keyof typeof recommendedVideos]?.map((video, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{video.thumbnail}</span>
                <span className="text-white">{video.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-2">{video.description}</p>
              <p className="text-gray-400">Duration: {video.duration}</p>
              <a 
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition-all"
              >
                Watch Now
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      <button
        onClick={onBack}
        className="mt-8 mx-auto block bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-all"
      >
        Back to Sports Selection
      </button>
    </div>
  );
};

export default RecommendedVideos;