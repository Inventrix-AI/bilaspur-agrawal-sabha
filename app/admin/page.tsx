import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Users, Calendar, FileText, Camera, Heart, CheckCircle, Building } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getDashboardStats() {
  try {
    const [
      totalMembers,
      totalEvents,
      totalNews,
      totalGalleryAlbums,
      pendingMatrimonialProfiles,
      upcomingEvents
    ] = await Promise.all([
      prisma.member.count({ where: { isActive: true } }),
      prisma.event.count(),
      prisma.newsArticle.count({ where: { publishedAt: { not: null } } }),
      prisma.galleryAlbum.count(),
      prisma.matrimonialProfile.count({ where: { isApproved: false } }),
      prisma.event.findMany({
        where: { startDatetime: { gte: new Date() } },
        take: 5,
        orderBy: { startDatetime: 'asc' },
        select: {
          id: true,
          title: true,
          startDatetime: true,
          venue: true
        }
      })
    ])

    return {
      totalMembers,
      totalEvents,
      totalNews,
      totalGalleryAlbums,
      pendingMatrimonialProfiles,
      upcomingEvents
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalMembers: 0,
      totalEvents: 0,
      totalNews: 0,
      totalGalleryAlbums: 0,
      pendingMatrimonialProfiles: 0,
      upcomingEvents: []
    }
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || (session.user.role !== 'Super Admin' && session.user.role !== 'Committee Admin')) {
    redirect('/login')
  }

  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session.user.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              Active community members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Total events organized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNews}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Albums</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGalleryAlbums}</div>
            <p className="text-xs text-muted-foreground">
              Photo collections
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-500" />
              Pending Matrimonial Approvals
            </CardTitle>
            <CardDescription>
              Matrimonial profiles awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.pendingMatrimonialProfiles === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-500">All profiles approved!</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.pendingMatrimonialProfiles}
                </div>
                <p className="text-sm text-gray-500">
                  Profiles need your attention
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Next 5 scheduled events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingEvents.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-12 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                          day: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                          month: 'short'
                        })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {event.venue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/members"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Manage Members</span>
            </a>
            
            <a
              href="/admin/committees"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm font-medium">Manage Committees</span>
            </a>
            
            <a
              href="/admin/events"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-sm font-medium">Manage Events</span>
            </a>
            
            <a
              href="/admin/news"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Manage News</span>
            </a>
            
            <a
              href="/admin/gallery"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Camera className="h-8 w-8 text-pink-500 mb-2" />
              <span className="text-sm font-medium">Manage Gallery</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}