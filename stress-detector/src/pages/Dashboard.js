// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import { FileMusic } from 'lucide-react';

// Main dashboard component
export default function AudioDashboard() {
	// Sample data from the provided audio analysis
	const mockData = [
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

	const [loading, setLoading] = useState(false);
  
  const [selectedAudio, setSelectedAudio] = useState(null);

	const [audioData, setData] = useState([]);

	useEffect(() => {
		setLoading(true);
		fetch('https://nemesis.wavecell.dev/sentiments')
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(response => {
				const { data } = response;
				const mapped = data.reduce((a,b) => {
				const audioEmotion = JSON.parse(b.AudioEmotion)
				const textSentiment = JSON.parse(b.TextSentiment);

				const obj =  {
					id: b.Id,
					source: b.Source,
					results: {
						audio_emotion: {
								...audioEmotion
						},
						text_sentiment: {
								...textSentiment
						},
						transcription: b.Transcription,
					},
					date_created: a.CreatedAt,
					date_updated: a.UpdatedAt
				};

					a.push(obj);

						return a;
				}, [])

				setData(mapped);
				if (mapped.length) {
					setSelectedAudio(mapped[0]);
				}
				setLoading(false);
			})
			.catch(error => {
				alert('alert')
				console.log(error);
				setData(mockData)
				setSelectedAudio(mockData[0]);
				setLoading(false);
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}	, []);
  
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
  
  const DashboardUI = () => (<div className="flex h-screen">
			<div className="flex-1 flex flex-col overflow-hidden">					
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
									{audioData.length && audioData.map(audio => (
										<div 
											key={audio.id}
											className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedAudio.id === audio.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-gray-100'}`}
											onClick={() => setSelectedAudio(audio)}
										>
											<div className="flex justify-between items-start">
												<div>
													<h4 className="font-medium truncate" title={(audio.source || '').split('/').pop()}>
														{(audio.source || '').split('/').pop()}
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

	const LoadingUI = () => (<div class="h-80 flex justify-center items-center"><svg class="w-12 h-12 text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none"
			xmlns="http://www.w3.org/2000/svg" width="24" height="24">
			<path
				d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
				stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
			<path
				d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
				stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
			</path>
		</svg></div>);

	return loading  ? <LoadingUI /> : selectedAudio ? <DashboardUI /> : null
}

// Stats card component
function StatCard({ title, value, color, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="flex items-center mt-2">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white mr-4`}>
          <span className="text-xl font-bold"><FileMusic /></span>
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