import { Calendar, Download as DownloadIcon, File, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getDownloads() {
  try {
    return await prisma.download.findMany({
      orderBy: {
        uploadDate: 'desc'
      }
    })
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return []
  }
}

function getFileIcon(fileType: string) {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />
    case 'doc':
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

function DownloadRow({ download, index }: { download: any, index: number }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(download.uploadDate).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          {getFileIcon(download.fileType)}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {download.title}
            </div>
            {download.description && (
              <div className="text-sm text-gray-500">
                {download.description}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a
          href={download.filePath}
          download
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
        >
          <DownloadIcon className="h-4 w-4 mr-1" />
          Download
        </a>
      </td>
    </tr>
  )
}

export default async function DownloadsPage() {
  const downloads = await getDownloads()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Downloads
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Access important documents, forms, and publications from our community
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {downloads.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No downloads available</h3>
            <p className="mt-1 text-gray-500">
              Documents and files will appear here when they are made available.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sr. No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {downloads.map((download, index) => (
                    <DownloadRow 
                      key={download.id} 
                      download={download} 
                      index={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Featured Downloads */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Publications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smriti Ank 2023</h3>
              <p className="text-gray-600 text-sm mb-4">
                Annual commemorative publication featuring community highlights and memories.
              </p>
              <div className="text-sm text-gray-500">
                Coming Soon
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Membership Form</h3>
              <p className="text-gray-600 text-sm mb-4">
                Application form for new community members.
              </p>
              <div className="text-sm text-gray-500">
                Available Soon
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Guidelines</h3>
              <p className="text-gray-600 text-sm mb-4">
                Guidelines and procedures for community events.
              </p>
              <div className="text-sm text-gray-500">
                Available Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}