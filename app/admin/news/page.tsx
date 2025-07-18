"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface NewsArticle {
  id: number
  title: string
  slug: string
  content: string
  imageUrl?: string
  publishedAt?: string
  createdAt: string
  author: {
    name: string
  }
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    publishedAt: ""
  })

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/admin/news')
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredArticles(filtered)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dataToSend = {
        ...formData,
        slug: generateSlug(formData.title),
        publishedAt: formData.publishedAt || null
      }

      const url = editingArticle ? `/api/admin/news/${editingArticle.id}` : '/api/admin/news'
      const method = editingArticle ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        fetchArticles()
        resetForm()
        setShowAddDialog(false)
        setShowEditDialog(false)
      }
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl || "",
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : ""
    })
    setShowEditDialog(true)
  }

  const handleDelete = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await fetch(`/api/admin/news/${articleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const handlePublish = async (articleId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/news/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publishedAt: currentStatus ? null : new Date().toISOString()
        }),
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error('Error updating publish status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      imageUrl: "",
      publishedAt: ""
    })
    setEditingArticle(null)
  }

  const isPublished = (publishedAt?: string) => !!publishedAt

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
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <Button onClick={() => {
          resetForm()
          setShowAddDialog(true)
        }} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {articles.filter(a => isPublished(a.publishedAt)).length}
            </div>
            <p className="text-sm text-gray-600">Published Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {articles.filter(a => !isPublished(a.publishedAt)).length}
            </div>
            <p className="text-sm text-gray-600">Draft Articles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{articles.length}</div>
            <p className="text-sm text-gray-600">Total Articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredArticles.length} of {articles.length} articles
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{article.author.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isPublished(article.publishedAt) ? "default" : "secondary"}>
                        {isPublished(article.publishedAt) ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {article.publishedAt 
                          ? new Date(article.publishedAt).toLocaleDateString('en-IN')
                          : '-'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublish(article.id, isPublished(article.publishedAt))}
                          className={isPublished(article.publishedAt) ? "text-yellow-600" : "text-green-600"}
                        >
                          {isPublished(article.publishedAt) ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{selectedArticle.title}</h3>
                <div className="text-sm text-gray-500 mt-2">
                  By {selectedArticle.author.name} • {
                    selectedArticle.publishedAt 
                      ? new Date(selectedArticle.publishedAt).toLocaleDateString('en-IN')
                      : 'Draft'
                  }
                </div>
              </div>

              {selectedArticle.imageUrl && (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Article Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false)
          setShowEditDialog(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'Edit Article' : 'Add New Article'}</DialogTitle>
            <DialogDescription>
              {editingArticle ? 'Update article information' : 'Create a new news article or announcement'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={10}
                placeholder="Write your article content here..."
                required
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Featured Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label htmlFor="publishedAt">Publish Date & Time (Leave empty for draft)</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => setFormData({...formData, publishedAt: e.target.value})}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowAddDialog(false)
                setShowEditDialog(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                {editingArticle ? 'Update Article' : 'Create Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}