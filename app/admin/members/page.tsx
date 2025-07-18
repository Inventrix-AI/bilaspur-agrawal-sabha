"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Member {
  id: number
  user: {
    name: string
    email: string
    phone?: string
    role: string
  }
  firstName?: string
  lastName?: string
  email?: string
  phonePrimary?: string
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
  createdAt: string
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, filterType, statusFilter])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = members

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user.phone?.includes(searchTerm) ||
        member.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType) {
      filtered = filtered.filter(member => member.membershipType === filterType)
    }

    if (statusFilter) {
      if (statusFilter === "pending") {
        filtered = filtered.filter(member => !member.isApproved)
      } else if (statusFilter === "approved") {
        filtered = filtered.filter(member => member.isApproved)
      } else if (statusFilter === "active") {
        filtered = filtered.filter(member => member.isActive)
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter(member => !member.isActive)
      }
    }

    setFilteredMembers(filtered)
  }

  const handleToggleStatus = async (memberId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error updating member status:', error)
    }
  }

  const handleApproval = async (memberId: number, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error updating member approval:', error)
    }
  }

  const handleRoleChange = async (memberId: number, role: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error updating member role:', error)
    }
  }

  const handleMembershipTypeChange = async (memberId: number, membershipType: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membershipType }),
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error updating membership type:', error)
    }
  }

  const handleDeleteMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMembers()
      }
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
          <p className="text-gray-600">Manage community members and their information</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{members.filter(m => !m.isApproved).length}</div>
            <p className="text-sm text-gray-600">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{members.filter(m => m.isApproved && m.isActive).length}</div>
            <p className="text-sm text-gray-600">Active Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{members.filter(m => m.membershipType === 'Lifetime').length}</div>
            <p className="text-sm text-gray-600">Lifetime Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{members.filter(m => m.membershipType === 'Patron').length}</div>
            <p className="text-sm text-gray-600">Patron Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{members.filter(m => m.membershipType === '2-Year').length}</div>
            <p className="text-sm text-gray-600">2-Year Members</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="w-full md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Membership Types</option>
                <option value="Regular">Regular</option>
                <option value="Patron">Patron</option>
                <option value="Lifetime">Lifetime</option>
                <option value="2-Year">2-Year</option>
              </select>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {member.profileImageUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={member.profileImageUrl}
                            alt={member.user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-orange-600">
                              {member.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.user.name}
                          </div>
                          {member.gotra && (
                            <div className="text-sm text-gray-500">Gotra: {member.gotra}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{member.user.phone || member.phonePrimary}</div>
                        <div className="text-gray-500">{member.user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{member.city}</div>
                        {member.locality && <div className="text-gray-500">{member.locality}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{member.businessName || 'N/A'}</div>
                        {member.businessCategory && (
                          <div className="text-gray-500">{member.businessCategory}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <select
                        value={member.user.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Member">Member</option>
                        <option value="Committee Admin">Committee Admin</option>
                        <option value="Super Admin">Super Admin</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        value={member.membershipType}
                        onChange={(e) => handleMembershipTypeChange(member.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Patron">Patron</option>
                        <option value="Lifetime">Lifetime</option>
                        <option value="2-Year">2-Year</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Badge variant={member.isApproved ? "default" : "destructive"} className="text-xs">
                          {member.isApproved ? "Approved" : "Pending"}
                        </Badge>
                        <Badge variant={member.isActive ? "default" : "secondary"} className="text-xs">
                          {member.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {!member.isApproved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(member.id, true)}
                            className="text-green-600 text-xs px-2"
                          >
                            Approve
                          </Button>
                        )}
                        {member.isApproved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproval(member.id, false)}
                            className="text-orange-600 text-xs px-2"
                          >
                            Unapprove
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedMember(member)}
                          className="text-xs px-2"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(member.id, member.isActive)}
                          className={`text-xs px-2 ${member.isActive ? "text-red-600" : "text-green-600"}`}
                        >
                          {member.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No members found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Detail Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-sm text-gray-900">{selectedMember.firstName} {selectedMember.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm text-gray-900">{selectedMember.phonePrimary}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{selectedMember.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="text-sm text-gray-900">{selectedMember.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Native Place</label>
                <p className="text-sm text-gray-900">{selectedMember.nativePlace}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Membership Type</label>
                <p className="text-sm text-gray-900">{selectedMember.membershipType.name}</p>
              </div>
              {selectedMember.businessName && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <p className="text-sm text-gray-900">{selectedMember.businessName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Category</label>
                    <p className="text-sm text-gray-900">{selectedMember.businessCategory || 'N/A'}</p>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-sm text-gray-900">{selectedMember.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Joined</label>
                <p className="text-sm text-gray-900">
                  {new Date(selectedMember.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Enter member information to add them to the community.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-gray-500">Add member form will be implemented here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}