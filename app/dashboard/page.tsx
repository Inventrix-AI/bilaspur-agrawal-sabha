"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { User, Calendar, MapPin, Briefcase, Phone, Mail, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface MemberProfile {
  id: number
  user: {
    name: string
    email: string
    phone?: string
    role: string
  }
  firstName?: string
  lastName?: string
  city?: string
  locality?: string
  nativePlace?: string
  businessName?: string
  businessCategory?: string
  gotra?: string
  profileImageUrl?: string
  membershipType: string
  status: string
  isApproved: boolean
  isActive: boolean
  joinedDate: string
  createdAt: string
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchMemberProfile()
    }
  }, [session])

  const fetchMemberProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setMemberProfile(data)
      }
    } catch (error) {
      console.error('Error fetching member profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  if (!memberProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600">Your member profile could not be found.</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = () => {
    if (!memberProfile.isApproved) {
      return <Clock className="h-5 w-5 text-orange-500" />
    } else if (memberProfile.isActive) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = () => {
    if (!memberProfile.isApproved) {
      return "Pending Admin Approval"
    } else if (memberProfile.isActive) {
      return "Active Member"
    } else {
      return "Inactive Member"
    }
  }

  const getStatusDescription = () => {
    if (!memberProfile.isApproved) {
      return "Your membership application is currently under review by our administrators. You will receive an email notification once your application is approved."
    } else if (memberProfile.isActive) {
      return "Your membership is active and you have full access to all community features and services."
    } else {
      return "Your membership is currently inactive. Please contact the administrators for assistance."
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            {memberProfile.profileImageUrl ? (
              <Image
                src={memberProfile.profileImageUrl}
                alt={memberProfile.user.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-10 w-10 text-orange-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {memberProfile.user.name}
              </h1>
              <p className="text-gray-600">Bilaspur Agrawal Sabha Member</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Status Alert */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {getStatusIcon()}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Membership Status: {getStatusText()}
                </h3>
                <p className="text-gray-600">{getStatusDescription()}</p>
              </div>
              <Badge 
                variant={memberProfile.isApproved ? (memberProfile.isActive ? "default" : "secondary") : "destructive"}
                className="ml-4"
              >
                {getStatusText()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-900">{memberProfile.user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {memberProfile.user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {memberProfile.user.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                    <Badge variant="outline">{memberProfile.user.role}</Badge>
                  </div>
                  {memberProfile.gotra && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Gotra</label>
                      <p className="text-gray-900">{memberProfile.gotra}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(memberProfile.joinedDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Location Information */}
                {(memberProfile.city || memberProfile.locality) && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {memberProfile.city && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                          <p className="text-gray-900 flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {memberProfile.city}
                          </p>
                        </div>
                      )}
                      {memberProfile.locality && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Locality</label>
                          <p className="text-gray-900">{memberProfile.locality}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Business Information */}
                {(memberProfile.businessName || memberProfile.businessCategory) && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Business Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {memberProfile.businessName && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Business/Firm Name</label>
                          <p className="text-gray-900 flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                            {memberProfile.businessName}
                          </p>
                        </div>
                      )}
                      {memberProfile.businessCategory && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Business Category</label>
                          <p className="text-gray-900">{memberProfile.businessCategory}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Membership Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Membership Type</label>
                  <Badge variant="secondary" className="text-sm">
                    {memberProfile.membershipType}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <Badge 
                    variant={memberProfile.isApproved ? (memberProfile.isActive ? "default" : "secondary") : "destructive"}
                  >
                    {getStatusText()}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(memberProfile.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="/members"
                  className="block w-full text-center bg-orange-50 text-orange-600 py-2 px-4 rounded-md hover:bg-orange-100 transition-colors"
                >
                  View Community Members
                </a>
                <a
                  href="/events"
                  className="block w-full text-center bg-blue-50 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Upcoming Events
                </a>
                <a
                  href="/news"
                  className="block w-full text-center bg-green-50 text-green-600 py-2 px-4 rounded-md hover:bg-green-100 transition-colors"
                >
                  Community News
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}