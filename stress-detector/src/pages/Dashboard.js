import { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Menu, X, Bell, Search, ChevronDown, Filter, Clock, Calendar, Download, Mic } from 'lucide-react';

// Sample data from the provided audio analysis
const audioData = [
  {
    id: 1,
    source: "s3://your-bucket/audio1.wav",
    results: {
      audio_emotion: {
        anger: 0.02,
        disgust: 0.01,
        fear: 0.03,
        happiness: 0.85,
        sadness: 0.02,
        surprise: 0.06,
        neutral: 0.01
      },
      text_sentiment: {
        label: "POSITIVE",
        score: 0.989
      },
      transcription: "I'm absolutely thrilled with this amazing result!"
    },
    date_created: '2025-03-09T11:42:15.708Z',
  },
  {
    id: 2,
    source: "s3://your-bucket/audio2.wav",
    results: {
      audio_emotion: {
        anger: 0.12,
        disgust: 0.08,
        fear: 0.15,
        happiness: 0.20,
        sadness: 0.25,
        surprise: 0.10,
        neutral: 0.10
      },
      text_sentiment: {
        label: "NEGATIVE",
        score: 0.756
      },
      transcription: "I'm really disappointed with how things turned out today."
    },
    date_created: '2025-05-09T11:42:15.708Z',
  },
  {
    id: 3,
    source: "s3://your-bucket/audio3.wav",
    results: {
      audio_emotion: {
        anger: 0.01,
        disgust: 0.01,
        fear: 0.02,
        happiness: 0.05,
        sadness: 0.01,
        surprise: 0.05,
        neutral: 0.85
      },
      text_sentiment: {
        label: "NEUTRAL",
        score: 0.892
      },
      transcription: "Today I'll be explaining the technical specifications of the new model."
    },
    date_created: '2025-02-09T11:42:15.708Z',
  }
];

// Colors for emotion visualization
const EMOTION_COLORS = {
  anger: '#FF5252',
  disgust: '#8BC34A',
  fear: '#9C27B0',
  happiness: '#FFD700',
  sadness: '#2196F3',
  surprise: '#FF9800',
  neutral: '#9E9E9E'
};

// Colors for sentiment visualization
const SENTIMENT_COLORS = {
  POSITIVE: '#4CAF50',
  NEGATIVE: '#F44336',
  NEUTRAL: '#9E9E9E'
};

// Main dashboard component
export default function AudioDashboard() {
  const [selectedAudio, setSelectedAudio] = useState(audioData[0]);

  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Prepare emotion data for charts
  const prepareEmotionData = (audioEmotion) => {
    return Object.entries(audioEmotion).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value
    }));
  };
  
  // Calculate overall stats
  const calculateStats = () => {
    let totalPositive = 0;
    let totalNegative = 0;
    let totalNeutral = 0;
    
    audioData.forEach(item => {
      const sentiment = item.results.text_sentiment.label;
      if (sentiment === 'POSITIVE') totalPositive++;
      else if (sentiment === 'NEGATIVE') totalNegative++;
      else totalNeutral++;
    });
    
    return {
      totalRecordings: audioData.length,
      positiveCount: totalPositive,
      negativeCount: totalNegative,
      neutralCount: totalNeutral,
      positivePercentage: Math.round((totalPositive / audioData.length) * 100),
      negativePercentage: Math.round((totalNegative / audioData.length) * 100),
      neutralPercentage: Math.round((totalNeutral / audioData.length) * 100),
    };
  };
  
  const stats = calculateStats();
  
  // Prepare sentiment distribution data
  const sentimentData = [
    { name: 'Positive', value: stats.positiveCount },
    { name: 'Negative', value: stats.negativeCount },
    { name: 'Neutral', value: stats.neutralCount }
  ];
  
  // Prepare emotion trend data across all recordings
  const emotionTrendData = audioData.map(item => {
    const emotions = item.results.audio_emotion;
    return {
      id: item.id,
      date: new Date(item.date_created).toLocaleDateString(),
      ...emotions
    };
  });
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Recordings" value={stats.totalRecordings} color="bg-blue-500" />
            <StatCard 
              title="Positive Sentiment" 
              value={`${stats.positivePercentage}%`} 
              color="bg-green-500" 
              subtitle={`${stats.positiveCount} recordings`}
            />
            <StatCard 
              title="Negative Sentiment" 
              value={`${stats.negativePercentage}%`} 
              color="bg-red-500" 
              subtitle={`${stats.negativeCount} recordings`}
            />
            <StatCard 
              title="Neutral Sentiment" 
              value={`${stats.neutralPercentage}%`} 
              color="bg-gray-500" 
              subtitle={`${stats.neutralCount} recordings`}
            />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sentiment Distribution Chart */}
            <ContentCard title="Sentiment Distribution">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name.toUpperCase()]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ContentCard>
            
            {/* Emotion Trends Chart */}
            <ContentCard title="Emotion Trends Across Recordings">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={emotionTrendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="happiness" stroke="#FFD700" />
                    <Line type="monotone" dataKey="sadness" stroke="#2196F3" />
                    <Line type="monotone" dataKey="neutral" stroke="#9E9E9E" />
                    <Line type="monotone" dataKey="anger" stroke="#FF5252" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ContentCard>
          </div>
          
          {/* Audio List and Selected Audio Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audio List */}
            <div className="lg:col-span-1">
              <ContentCard title="Recent Recordings">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {audioData.map(audio => (
                    <div 
                      key={audio.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedAudio.id === audio.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-gray-100'}`}
                      onClick={() => setSelectedAudio(audio)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium truncate" title={audio.source.split('/').pop()}>
                            {audio.source.split('/').pop()}
                          </h4>
                          <p className="text-xs text-gray-500">{formatDate(audio.date_created)}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          audio.results.text_sentiment.label === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                          audio.results.text_sentiment.label === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {audio.results.text_sentiment.label}
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-gray-600 truncate" title={audio.results.transcription}>
                        {audio.results.transcription}
                      </p>
                    </div>
                  ))}
                </div>
              </ContentCard>
            </div>
            
            {/* Selected Audio Analysis */}
            <div className="lg:col-span-2">
              <ContentCard title={`Analysis: ${selectedAudio.source.split('/').pop()}`}>
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Transcription:</h4>
                  <p className="p-3 bg-gray-50 rounded-lg">{selectedAudio.results.transcription}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Emotion Chart */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Audio Emotion Analysis:</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareEmotionData(selectedAudio.results.audio_emotion)}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value">
                            {prepareEmotionData(selectedAudio.results.audio_emotion).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name.toLowerCase()]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Text Sentiment */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Text Sentiment Analysis:</h4>
                    <div className="h-64 flex flex-col justify-center items-center">
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                        selectedAudio.results.text_sentiment.label === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                        selectedAudio.results.text_sentiment.label === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {(selectedAudio.results.text_sentiment.score * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm">
                            {selectedAudio.results.text_sentiment.label}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                          Confidence score: {selectedAudio.results.text_sentiment.score.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Stats card component
function StatCard({ title, value, color, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="flex items-center mt-2">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white mr-4`}>
          <span className="text-xl font-bold">+</span>
        </div>
        <div>
          <span className="text-2xl font-bold">{value}</span>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// Content card component
function ContentCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 p-4">
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}