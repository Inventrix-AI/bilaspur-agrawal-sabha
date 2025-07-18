import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, User, Phone, Mail } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getCommittee(id: string) {
  try {
    const committee = await prisma.committee.findUnique({
      where: { id: parseInt(id) },
      include: {
        committeeMembers: {
          include: {
            member: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                city: true,
                phonePrimary: true,
                email: true,
                profileImageUrl: true,
                businessName: true
              }
            }
          },
          orderBy: [
            { designation: 'asc' },
            { member: { firstName: 'asc' } }
          ]
        }
      }
    })
    return committee
  } catch (error) {
    console.error('Error fetching committee:', error)
    return null
  }
}

function MemberCard({ committeeMember }: { committeeMember: any }) {
  const member = committeeMember.member

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
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-orange-600 font-medium text-sm">
              {committeeMember.designation}
            </p>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              {member.city}
            </div>
            
            {member.businessName && (
              <div className="text-gray-600 text-sm">
                {member.businessName}
              </div>
            )}
            
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              {member.phonePrimary}
            </div>
            
            {member.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                {member.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function CommitteeDetailPage({ params }: { params: { id: string } }) {
  const committee = await getCommittee(params.id)

  if (!committee) {
    notFound()
  }

  // Group members by designation for better organization
  const groupedMembers = committee.committeeMembers.reduce((acc, member) => {
    const designation = member.designation
    if (!acc[designation]) {
      acc[designation] = []
    }
    acc[designation].push(member)
    return acc
  }, {} as Record<string, any[]>)

  // Order designations to show important positions first
  const designationOrder = ['President', 'Secretary', 'Treasurer', 'Vice President', 'Joint Secretary']
  const orderedDesignations = [
    ...designationOrder.filter(d => groupedMembers[d]),
    ...Object.keys(groupedMembers).filter(d => !designationOrder.includes(d))
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="mb-6">
            <Link
              href="/committee"
              className="inline-flex items-center text-orange-600 hover:text-orange-500 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Committees
            </Link>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {committee.name}
            </h1>
            
            <div className="mt-6 flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Session: {committee.sessionYear}
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {committee.committeeMembers.length} members
              </div>
            </div>
            
            {committee.description && (
              <p className="mt-6 text-xl leading-8 text-gray-600">
                {committee.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {committee.committeeMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No committee members</h3>
            <p className="mt-1 text-gray-500">
              Committee members will appear here when they are assigned.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {orderedDesignations.map((designation) => (
              <div key={designation}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {designation}
                  {groupedMembers[designation].length > 1 && (
                    <span className="text-lg font-normal text-gray-500 ml-2">
                      ({groupedMembers[designation].length})
                    </span>
                  )}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMembers[designation].map((member) => (
                    <MemberCard key={member.id} committeeMember={member} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}