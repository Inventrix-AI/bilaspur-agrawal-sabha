import Link from "next/link"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getUpcomingEvents() {
  try {
    return await prisma.event.findMany({
      where: { startDatetime: { gte: new Date() } },
      orderBy: { startDatetime: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }
}

async function getPastEvents() {
  try {
    return await prisma.event.findMany({
      where: { startDatetime: { lt: new Date() } },
      orderBy: { startDatetime: 'desc' },
      take: 20
    })
  } catch (error) {
    console.error('Error fetching past events:', error)
    return []
  }
}

function EventCard({ event, isPast = false }: { event: any, isPast?: boolean }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {event.imageUrl && (
          <div className="mb-4">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            <Link 
              href={`/events/${event.id}`}
              className="hover:text-orange-600 transition-colors"
            >
              {event.title}
            </Link>
          </h3>
          
          <p className="text-gray-600 line-clamp-3">
            {event.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {new Date(event.startDatetime).toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              {new Date(event.startDatetime).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
              {event.endDatetime && (
                <> - {new Date(event.endDatetime).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {event.venue}
            </div>
          </div>
          
          <div className="pt-4">
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
            >
              {isPast ? 'View Details' : 'Learn More'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function EventsPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents()
  ])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Community Events
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Stay updated with our cultural celebrations, community gatherings, and special programs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming events</h3>
                <p className="mt-1 text-gray-500">
                  Check back later for new events and announcements.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No past events</h3>
                <p className="mt-1 text-gray-500">
                  Past events will appear here once they are completed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}