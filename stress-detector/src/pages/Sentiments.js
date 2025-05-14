// eslint-disable-next-line no-unused-vars
import { useState, useEffect  } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Sector } from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';


export default function CollapsibleEmotionTable() {
  // Sample data with multiple entries
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

	const [sampleData, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  // State to track which rows are expanded
  const [expandedRows, setExpandedRows] = useState({});

  // Function to toggle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

	useEffect(() => {
		// setData(mockdata)
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
					}

					a.push(obj);

					return a;
				}, [])
        setData(mapped);
        setLoading(false);
      })
      .catch(error => {
				console.log(error);
				setData(mockData);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
          {(value * 100).toFixed(1)}%
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  // Function to prepare emotion data for pie chart
  const prepareEmotionData = (emotions) => {
    const emotionColors = {
      happiness: '#4CAF50',
      surprise: '#FF9800',
      fear: '#9C27B0',
      anger: '#F44336',
      sadness: '#2196F3',
      disgust: '#795548',
      neutral: '#9E9E9E'
    };

    return Object.entries(emotions).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: emotionColors[name]
    }));
  };

  // Function to get sentiment badge style
  const getSentimentBadgeStyle = (label) => {
    switch(label) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800';
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get dominant emotion
  const getDominantEmotion = (emotions) => {
    return Object.entries(emotions).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">Audio Emotion Analysis Results</h2>
      
				{loading ? 
					(<div class="h-80 flex justify-center items-center"><svg class="w-12 h-12 text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none"
					xmlns="http://www.w3.org/2000/svg" width="24" height="24">
					<path
						d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
						stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
					<path
						d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
						stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900">
					</path>
				</svg></div>) :
				(<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-200">
						<thead>
							<tr className="bg-gray-100">
								<th className="w-12 py-2 px-3 border-b"></th>
								<th className="py-2 px-3 border-b text-left">Source</th>
								<th className="w-40 py-2 px-3 border-b text-left">Emotion Distribution</th>
								<th className="py-2 px-3 border-b text-left">Dominant Emotion</th>
								<th className="py-2 px-3 border-b text-left">Text Sentiment</th>
							</tr>
						</thead>
						<tbody>
							{sampleData.map((entry) => {
								const emotionData = prepareEmotionData(entry.results.audio_emotion);
								const dominantEmotion = getDominantEmotion(entry.results.audio_emotion);
								const sentiment = entry.results.text_sentiment;
								const isExpanded = expandedRows[entry.id] || false;
								
								return (
									<>
										<tr className="hover:bg-gray-50">
											<td className="py-2 px-3 border-b">
												<button 
													onClick={() => toggleRowExpansion(entry.id)}
													className="p-1 rounded hover:bg-gray-200"
												>
													{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
												</button>
											</td>
											<td className="py-2 px-3 border-b font-medium">
												{entry.source.split('/').pop()}
											</td>
											<td className="py-2 px-3 border-b">
												<div className="h-16 w-full">
													<ResponsiveContainer width="100%" height="100%">
														<PieChart>
															<Pie
																data={emotionData}
																cx="50%"
																cy="50%"
																innerRadius={15}
																outerRadius={30}
																dataKey="value"
																paddingAngle={2}
															>
																{emotionData.map((entry, index) => (
																	<Cell key={`cell-${index}`} fill={entry.color} />
																))}
															</Pie>
															<Tooltip 
																formatter={(value) => `${(value * 100).toFixed(1)}%`}
																labelFormatter={(name) => `${name}`}
															/>
														</PieChart>
													</ResponsiveContainer>
												</div>
											</td>
											<td className="py-2 px-3 border-b capitalize">
												{dominantEmotion} ({(entry.results.audio_emotion[dominantEmotion] * 100).toFixed(0)}%)
											</td>
											<td className="py-2 px-3 border-b">
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadgeStyle(sentiment.label)}`}>
													{sentiment.label} ({(sentiment.score * 100).toFixed(0)}%)
												</span>
											</td>
										</tr>
										{isExpanded && (
											<tr className="bg-gray-50">
												<td colSpan="5" className="py-3 px-4 border-b">
													<div className="pl-6">
														<div className="mb-2">
															<span className="font-medium">Transcription:</span>
														</div>
														<div className="bg-white p-3 rounded border border-gray-200 italic">
															"{entry.results.transcription}"
														</div>
														<div className="mt-4 py-4 h-78">
															{/* {emotionData.map((emotion) => (
																<div key={emotion.name} className="flex items-center">
																	<div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: emotion.color }}></div>
																	<span className="text-xs">{emotion.name}: {(emotion.value * 100).toFixed(1)}%</span>
																</div>
															))} */}

																<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
																	<div className="h-64">
																		<h3 className="text-lg font-medium mb-2 text-center">Audio Emotion Distribution</h3>
																		<ResponsiveContainer width="100%" height="100%">
																			<PieChart>
																			<Pie
																					activeIndex={activeIndex}
																					activeShape={renderActiveShape}
																					data={emotionData}
																					cx="50%"
																					cy="50%"
																					innerRadius={60}
																					outerRadius={80}
																					dataKey="value"
																					onMouseEnter={onPieEnter}
																			>
																					{emotionData.map((entry, index) => (
																					<Cell key={`cell-${index}`} fill={entry.color} />
																					))}
																			</Pie>
																				<Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
																				</PieChart>
																		</ResponsiveContainer>
																	</div>
																	
																	<div className="h-64">
																		<h3 className="text-lg font-medium mb-2 text-center">Audio Emotion Breakdown</h3>
																		<ResponsiveContainer width="100%" height="100%">
																			<BarChart
																				data={emotionData}
																				layout="vertical"
																				margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
																			>
																				<CartesianGrid strokeDasharray="3 3" />
																				<XAxis type="number" domain={[0, 1]} tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`} />
																				<YAxis dataKey="name" type="category" width={80} />
																				<Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
																				<Bar dataKey="value" background={{ fill: '#eee' }}>
																						{emotionData.map((entry, index) => (
																						<Cell key={`cell-${index}`} fill={entry.color} />
																						))}
																				</Bar>
																			</BarChart>
																		</ResponsiveContainer>
																	</div>
																</div>
															</div>
													</div>
												</td>
											</tr>
										)}
									</>
								);
							})}
						</tbody>
					</table>
				</div>)}
    </div>
  );
}