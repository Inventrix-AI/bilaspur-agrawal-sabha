import { User, MapPin, Briefcase } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getLifetimeMembers() {
  try {
    return await prisma.member.findMany({
      where: {
        isActive: true,
        membershipType: {
          name: 'Lifetime'
        }
      },
      include: {
        membershipType: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    })
  } catch (error) {
    console.error('Error fetching lifetime members:', error)
    return []
  }
}

function MemberCard({ member }: { member: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {member.profileImageUrl ? (
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={member.profileImageUrl}
              alt={`${member.firstName} ${member.lastName}`}
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="h-8 w-8 text-orange-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {member.firstName} {member.lastName}
          </h3>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              {member.city}
            </div>
            
            {member.businessName && (
              <div className="flex items-center text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                {member.businessName}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function LifetimeMembersPage() {
  const members = await getLifetimeMembers()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Lifetime Members
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Our dedicated lifetime members who have made a long-term commitment to our community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Member Count */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600">
            {members.length} Lifetime Members
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No lifetime members found</h3>
            <p className="mt-1 text-gray-500">
              Lifetime member information will appear here when available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* About Lifetime Membership */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Lifetime Membership</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Lifetime members have made a permanent commitment to our community through their one-time 
              membership contribution. They enjoy full privileges and voting rights in all community 
              activities and decisions. Their continued support forms the backbone of our organization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}