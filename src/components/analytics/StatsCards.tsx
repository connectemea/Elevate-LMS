'use client'

import { useQuery } from '@tanstack/react-query'

async function fetchAnalytics() {
  const response = await fetch('/api/analytics')
  return response.json()
}

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics
  })

  if (isLoading) return <div>Loading stats...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Participants</h3>
        <p className="text-2xl">{data?.totalParticipants}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Courses</h3>
        <p className="text-2xl">{data?.totalCourses}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Completion Rate</h3>
        <p className="text-2xl">{data?.overallProgress?.completionRate?.toFixed(1)}%</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Average Year</h3>
        <p className="text-2xl">{data?.averageYear?.toFixed(1)}</p>
      </div>
    </div>
  )
}