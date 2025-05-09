import { useState } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector } from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';


export default function CollapsibleEmotionTable() {
  // Sample data with multiple entries
  const sampleData = [
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

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
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
      
      <div className="overflow-x-auto">
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
      </div>
    </div>
  );
}