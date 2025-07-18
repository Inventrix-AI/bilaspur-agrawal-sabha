"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Image as ImageIcon, FileImage } from "lucide-react"
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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Committee {
  id: number
  name: string
  description?: string
  sessionYear: string
  committeeImageUrl?: string
  posterImageUrl?: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
  _count: {
    committeeMembers: number
  }
}

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sessionYear: "",
    committeeImageUrl: "",
    posterImageUrl: "",
    isActive: true,
    displayOrder: 0
  })

  const fetchCommittees = async () => {
    try {
      const response = await fetch('/api/admin/committees')
      if (response.ok) {
        const data = await response.json()
        setCommittees(data)
      }
    } catch (error) {
      console.error('Error fetching committees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCommittees()
  }, [])

  const filteredCommittees = committees.filter(committee =>
    committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    committee.sessionYear.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/admin/committees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchCommittees()
        setIsAddModalOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating committee:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCommittee) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/admin/committees/${selectedCommittee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        await fetchCommittees()
        setIsEditModalOpen(false)
        setSelectedCommittee(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating committee:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this committee?')) return
    
    try {
      const response = await fetch(`/api/admin/committees/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchCommittees()
      }
    } catch (error) {
      console.error('Error deleting committee:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      sessionYear: "",
      committeeImageUrl: "",
      posterImageUrl: "",
      isActive: true,
      displayOrder: 0
    })
  }

  const openEditModal = (committee: Committee) => {
    setSelectedCommittee(committee)
    setFormData({
      name: committee.name,
      description: committee.description || "",
      sessionYear: committee.sessionYear,
      committeeImageUrl: committee.committeeImageUrl || "",
      posterImageUrl: committee.posterImageUrl || "",
      isActive: committee.isActive,
      displayOrder: committee.displayOrder
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (committee: Committee) => {
    setSelectedCommittee(committee)
    setIsViewModalOpen(true)
  }

  const handleImageUpload = async (file: File, imageType: 'committee' | 'poster') => {
    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          [imageType === 'committee' ? 'committeeImageUrl' : 'posterImageUrl']: data.url
        }))
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Committees</h1>
          <p className="text-gray-600">Manage community committees and their display</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Committee
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Committees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or session year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Committees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Committees ({filteredCommittees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Committee</TableHead>
                <TableHead>Session Year</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommittees.map((committee) => (
                <TableRow key={committee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{committee.name}</div>
                      {committee.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {committee.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{committee.sessionYear}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {committee._count.committeeMembers} members
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {committee.committeeImageUrl && (
                        <div className="flex items-center text-xs text-green-600">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Logo
                        </div>
                      )}
                      {committee.posterImageUrl && (
                        <div className="flex items-center text-xs text-blue-600">
                          <FileImage className="h-3 w-3 mr-1" />
                          Poster
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={committee.isActive ? "default" : "secondary"}>
                      {committee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{committee.displayOrder}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewModal(committee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(committee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(committee.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Committee Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Committee</DialogTitle>
            <DialogDescription>
              Create a new committee with images for display
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Committee Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sessionYear">Session Year</Label>
                <Input
                  id="sessionYear"
                  value={formData.sessionYear}
                  onChange={(e) => setFormData(prev => ({...prev, sessionYear: e.target.value}))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Committee Image (Logo/Group Photo)</Label>
                <div className="mt-2 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'committee')
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {formData.committeeImageUrl && (
                    <img
                      src={formData.committeeImageUrl}
                      alt="Committee"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <Label>Poster Image (Homepage Slider)</Label>
                <div className="mt-2 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'poster')
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {formData.posterImageUrl && (
                    <img
                      src={formData.posterImageUrl}
                      alt="Poster"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({...prev, isActive: checked}))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({...prev, displayOrder: parseInt(e.target.value) || 0}))}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Committee"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Committee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Committee</DialogTitle>
            <DialogDescription>
              Update committee information and images
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Committee Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-sessionYear">Session Year</Label>
                <Input
                  id="edit-sessionYear"
                  value={formData.sessionYear}
                  onChange={(e) => setFormData(prev => ({...prev, sessionYear: e.target.value}))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Committee Image (Logo/Group Photo)</Label>
                <div className="mt-2 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'committee')
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {formData.committeeImageUrl && (
                    <img
                      src={formData.committeeImageUrl}
                      alt="Committee"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <Label>Poster Image (Homepage Slider)</Label>
                <div className="mt-2 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'poster')
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {formData.posterImageUrl && (
                    <img
                      src={formData.posterImageUrl}
                      alt="Poster"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({...prev, isActive: checked}))}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>
              
              <div>
                <Label htmlFor="edit-displayOrder">Display Order</Label>
                <Input
                  id="edit-displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({...prev, displayOrder: parseInt(e.target.value) || 0}))}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Committee"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Committee Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Committee Details</DialogTitle>
          </DialogHeader>
          
          {selectedCommittee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Committee Name</h3>
                  <p className="text-gray-600">{selectedCommittee.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Session Year</h3>
                  <p className="text-gray-600">{selectedCommittee.sessionYear}</p>
                </div>
              </div>
              
              {selectedCommittee.description && (
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-600">{selectedCommittee.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Committee Image</h3>
                  {selectedCommittee.committeeImageUrl ? (
                    <img
                      src={selectedCommittee.committeeImageUrl}
                      alt="Committee"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  ) : (
                    <p className="text-gray-400 mt-2">No image uploaded</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Poster Image</h3>
                  {selectedCommittee.posterImageUrl ? (
                    <img
                      src={selectedCommittee.posterImageUrl}
                      alt="Poster"
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  ) : (
                    <p className="text-gray-400 mt-2">No poster uploaded</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Status</h3>
                  <Badge variant={selectedCommittee.isActive ? "default" : "secondary"}>
                    {selectedCommittee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Display Order</h3>
                  <p className="text-gray-600">{selectedCommittee.displayOrder}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Members</h3>
                  <p className="text-gray-600">{selectedCommittee._count.committeeMembers} members</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}