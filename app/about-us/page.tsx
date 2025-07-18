import { Users, Heart, Trophy, Calendar } from "lucide-react"

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About Bilaspur Agrawal Sabha
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Connecting Hearts, Celebrating Heritage, Building Community
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                The fundamental mission of Bilaspur Agrawal Sabha is to create a unified digital ecosystem 
                that serves the Agarwal community of Bilaspur. We aim to foster a stronger sense of unity, 
                celebrate our rich cultural heritage, and provide a comprehensive, centralized resource for 
                all Agarwal families in and around the Bilaspur region.
              </p>
              <p className="text-gray-600">
                Our platform acts as the official digital presence of the Bilaspur Agrawal Sabha, ensuring 
                that members are connected, informed, and engaged in community activities.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                To build an inclusive, supportive, and active online community hub that preserves our 
                cultural values while embracing modern technology to serve our community better.
              </p>
              <p className="text-gray-600">
                We envision a future where every member of our community feels connected, supported, 
                and proud of their heritage, regardless of their geographical location.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Unity</h3>
              <p className="mt-2 text-gray-600">
                Bringing our community together through shared values and common goals.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Heritage</h3>
              <p className="mt-2 text-gray-600">
                Preserving and celebrating our rich cultural traditions and history.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Service</h3>
              <p className="mt-2 text-gray-600">
                Serving our community members with dedication and commitment.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-6 text-xl font-medium text-gray-900">Progress</h3>
              <p className="mt-2 text-gray-600">
                Embracing innovation while honoring our traditional values.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our History</h2>
            <p className="mt-4 text-lg text-gray-600">
              25+ years of service to the Agarwal community
            </p>
          </div>

          <div className="prose prose-lg prose-orange max-w-4xl mx-auto">
            <p className="text-gray-600 text-lg leading-relaxed">
              The Bilaspur Agrawal Sabha has been a cornerstone of the Agarwal community in Bilaspur 
              for over two decades. Established with the vision of bringing together Agarwal families 
              from across the region, our organization has grown from a small group of dedicated 
              individuals to a thriving community of hundreds of families.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed mt-6">
              Over the years, we have organized countless cultural events, festivals, and community 
              gatherings that have strengthened the bonds between our members. Our commitment to 
              preserving Agarwal traditions while adapting to modern times has made us a respected 
              institution in Bilaspur.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed mt-6">
              Today, with our digital platform, we continue this legacy by connecting families 
              across geographical boundaries and providing a modern, efficient way for our community 
              to stay connected and engaged.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600">
              We'd love to hear from you
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Bilaspur Agrawal Sabha
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>C/o Agrasen Bhawan</p>
                <p>Juni Line, Bilaspur</p>
                <p>Chhattisgarh - 495001</p>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-gray-500">
                  For any queries or assistance, please contact our committee members 
                  or visit us during our regular meetings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}