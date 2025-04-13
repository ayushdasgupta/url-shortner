import { useState, useEffect } from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { getLinkAnalytics } from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = ({ linkId, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getLinkAnalytics(linkId);
        setAnalytics(data);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    if (linkId) fetchAnalytics();
  }, [linkId]);

  return (
    <div
      className="fixed inset-0 bg-white/20 backdrop-blur-sm z-50 flex items-center justify-center overflow-auto"
      role="dialog"
      aria-modal="true">
      {/* Modal container: flex-col so header and body stack */}
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 my-8 flex flex-col max-h-[90vh]">

        {/* Sticky header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">
            {loading
              ? 'Loading Analytics...'
              : error
                ? 'Error'
                : 'Link Analytics'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="large" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && analytics && (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Original URL */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-2">Original URL</h3>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-600 truncate">
                      {analytics.link.originalUrl}
                    </p>
                    <a
                      href={analytics.link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
                {/* Short Link */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-2">Short Link</h3>
                  <p className="text-sm text-gray-600">
                    {window.location.origin}/{analytics.link.shortCode}
                  </p>
                </div>
                {/* Total Clicks */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium mb-2">Total Clicks</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {analytics.totalClicks || 0}
                  </p>
                </div>
              </div>

              {/* Clicks Over Time */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">
                  Clicks Over Time (Last 7 Days)
                </h3>
                <div className="bg-white p-4 rounded-lg shadow h-64">
                  <Line
                    data={{
                      labels: Array.from({ length: 7 }, (_, i) =>
                        format(subDays(new Date(), 6 - i), 'MMM d')
                      ),
                      datasets: [
                        {
                          label: 'Clicks',
                          data: Array.from({ length: 7 }, (_, i) => {
                            const day = format(
                              subDays(new Date(), 6 - i),
                              'yyyy-MM-dd'
                            );
                            return (
                              analytics.clicksByDay.find((c) => c.date === day)
                                ?.count || 0
                            );
                          }),
                          borderColor: 'rgb(53, 162, 235)',
                          backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Pie & Bar Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[
                  { title: 'Devices', data: analytics.deviceStats, key: 'device' },
                  { title: 'Operating Systems', data: analytics.osStats, key: 'os' },
                  { title: 'Browsers', data: analytics.browserStats, key: 'browser' },
                ].map(({ title, data, key }) => (
                  <div key={key}>
                    <h3 className="text-lg font-medium mb-4">{title}</h3>
                    <div className="bg-white p-4 rounded-lg shadow h-64 flex items-center justify-center">
                      <Pie
                        data={{
                          labels: data.map((item) => item[key]),
                          datasets: [
                            {
                              data: data.map((item) => item.count),
                              backgroundColor: [
                                '#FF6384',
                                '#36A2EB',
                                '#FFCE56',
                                '#4BC0C0',
                                '#9966FF',
                                '#FF9F40',
                              ],
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Locations</h3>
                  <div className="bg-white p-4 rounded-lg shadow h-64">
                    <Bar
                      data={{
                        labels: analytics.locationStats.map((l) => l.country),
                        datasets: [
                          {
                            label: 'Clicks',
                            data: analytics.locationStats.map((l) => l.count),
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true, ticks: { precision: 0 } },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Clicks Table */}
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Clicks</h3>
                <div className="overflow-auto bg-white rounded-lg shadow">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2">Time</th>
                        <th className="px-4 py-2">Device</th>
                        <th className="px-4 py-2">Browser</th>
                        <th className="px-4 py-2">OS</th>
                        <th className="px-4 py-2">Country</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentClicks.map((click, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">
                            {format(new Date(click.timestamp), 'PPpp')}
                          </td>
                          <td className="px-4 py-2">{click.device}</td>
                          <td className="px-4 py-2">{click.browser}</td>
                          <td className="px-4 py-2">{click.os}</td>
                          <td className="px-4 py-2">
                            {click.location?.country || 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
