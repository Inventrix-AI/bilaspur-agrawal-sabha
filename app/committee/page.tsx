import Link from "next/link"
import { Users, Calendar, ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getCommittees() {
  try {
    return await prisma.committee.findMany({
      include: {
        _count: {
          select: {
            committeeMembers: true
          }
        }
      },
      orderBy: {
        sessionYear: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching committees:', error)
    return []
  }
}

export default async function CommitteePage() {
  const committees = await getCommittees()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Committee Structure
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals who serve our community through various committees
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {committees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No committees found</h3>
            <p className="mt-1 text-gray-500">
              Committee information will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committees.map((committee) => (
              <div
                key={committee.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {committee.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {committee.sessionYear}
                    </div>
                  </div>
                </div>
                
                {committee.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {committee.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {committee._count.committeeMembers} members
                  </span>
                  
                  <Link
                    href={`/committee/${committee.id}`}
                    className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium text-sm"
                  >
                    View Members
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Committee Information */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">About Our Committees</h2>
            <p className="mt-4 text-gray-600">
              Our committees work tirelessly to serve the community and organize various activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Committee</h3>
              <p className="text-gray-600">
                The main governing body responsible for overall administration, policy decisions, 
                and strategic planning for the Sabha. They oversee all major activities and 
                coordinate with other committees.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Committee</h3>
              <p className="text-gray-600">
                Organizes cultural events, festivals, and programs that celebrate our heritage. 
                They plan traditional celebrations, cultural shows, and community gatherings 
                throughout the year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}