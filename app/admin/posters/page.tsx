"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react"

interface Poster {
  id: number
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  isActive: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export default function PostersAdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [posters, setPosters] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    linkUrl: "",
    displayOrder: 0,
    isActive: true
  })
  const [posterImage, setPosterImage] = useState<File | null>(null)
  const [posterImagePreview, setPosterImagePreview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user?.role !== 'Super Admin' && session?.user?.role !== 'Committee Admin') {
      router.push('/dashboard')
      return
    }
    fetchPosters()
  }, [session, router])

  const fetchPosters = async () => {
    try {
      const response = await fetch('/api/admin/posters')
      if (response.ok) {
        const data = await response.json()
        setPosters(data)
      }
    } catch (error) {
      console.error('Error fetching posters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = editingPoster?.imageUrl || ""

      // Upload image if new one is selected
      if (posterImage) {
        const imageFormData = new FormData()
        imageFormData.append('image', posterImage)
        
        const imageResponse = await fetch("/api/upload/image", {
          method: "POST",
          body: imageFormData,
        })
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          imageUrl = imageData.imageUrl
        } else {
          throw new Error("Failed to upload image")
        }
      }

      const url = editingPoster 
        ? `/api/admin/posters/${editingPoster.id}`
        : '/api/admin/posters'
      
      const method = editingPoster ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        }),
      })

      if (response.ok) {
        fetchPosters()
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save poster')
      }
    } catch (error) {
      console.error('Error saving poster:', error)
      alert('Failed to save poster')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (poster: Poster) => {
    setEditingPoster(poster)
    setFormData({
      title: poster.title,
      description: poster.description || "",
      linkUrl: poster.linkUrl || "",
      displayOrder: poster.displayOrder,
      isActive: poster.isActive
    })
    setPosterImagePreview(poster.imageUrl)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this poster?')) return

    try {
      const response = await fetch(`/api/admin/posters/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPosters()
      } else {
        alert('Failed to delete poster')
      }
    } catch (error) {
      console.error('Error deleting poster:', error)
      alert('Failed to delete poster')
    }
  }

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/posters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchPosters()
      }
    } catch (error) {
      console.error('Error updating poster status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      linkUrl: "",
      displayOrder: 0,
      isActive: true
    })
    setPosterImage(null)
    setPosterImagePreview("")
    setEditingPoster(null)
    setShowForm(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPosterImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPosterImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Poster Management</h1>
          <p className="text-gray-600">Manage homepage poster slideshow</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Poster</span>
        </button>
      </div>

      {/* Poster Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPoster ? 'Edit Poster' : 'Add New Poster'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poster Image *
                </label>
                <div className="flex items-center space-x-4">
                  {posterImagePreview ? (
                    <Image
                      src={posterImagePreview}
                      alt="Preview"
                      width={200}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-48 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="posterImage"
                    />
                    <label
                      htmlFor="posterImage"
                      className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Choose Image
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter poster title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Enter poster description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter link URL (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingPoster ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posters List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posters.map((poster) => (
              <tr key={poster.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Image
                    src={poster.imageUrl}
                    alt={poster.title}
                    width={80}
                    height={40}
                    className="rounded-md object-cover"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{poster.title}</div>
                  {poster.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">{poster.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {poster.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    poster.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {poster.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => toggleActive(poster.id, poster.isActive)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {poster.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(poster)}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(poster.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {posters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posters found. Create your first poster to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}