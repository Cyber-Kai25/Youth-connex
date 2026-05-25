import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ResourcesPage() {
  const resources = [
    {
      category: 'Training',
      icon: '📚',
      title: 'Vocational Certification Programs',
      desc: 'Approved training courses backed by the Ministry of Employment',
      items: ['Digital Skills', 'Agricultural Management', 'Business Administration', 'Technical Trades']
    },
    {
      category: 'Guides',
      icon: '📖',
      title: 'Career Development Resources',
      desc: 'Learn how to build a strong profile and land opportunities',
      items: ['CV Writing Guide', 'Interview Preparation', 'Salary Negotiation', 'Professional Development']
    },
    {
      category: 'Tools',
      icon: '🛠️',
      title: 'YouthConnex Tools',
      desc: 'Useful resources to enhance your profile and opportunities',
      items: ['Resume Builder', 'Skill Assessment', 'Job Alerts Setup', 'Profile Optimization']
    },
    {
      category: 'Support',
      icon: '💬',
      title: 'Get Help',
      desc: 'Connect with our support team and community',
      items: ['FAQ', 'Contact Support', 'Community Forum', 'Feedback & Suggestions']
    }
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar isDashboard={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-heading">Learning & Resources</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Everything you need to succeed in your career journey. From training programs to job search tips.
          </p>
        </div>

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {resources.map((resource, idx) => (
            <div key={idx} className="bg-card rounded-lg border border-border p-5 sm:p-8 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{resource.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{resource.title}</h3>
              <p className="text-muted-foreground mb-6">{resource.desc}</p>
              <ul className="space-y-2 mb-6">
                {resource.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="text-primary">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Learn More
              </Button>
            </div>
          ))}
        </div>

        {/* Featured Training */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-border p-5 sm:p-8 md:p-12 mb-8 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-heading">
                Ministry-Approved Training Programs
              </h2>
              <p className="text-muted-foreground mb-6">
                Access verified training courses backed by the Ministry of Employment. Complete programs and earn certifications that employers recognize.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-primary text-lg">✓</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Government Certified</h4>
                    <p className="text-sm text-muted-foreground">Courses validated by official government agencies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary text-lg">✓</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Industry-Relevant</h4>
                    <p className="text-sm text-muted-foreground">Skills that employers are actively seeking</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary text-lg">✓</span>
                  <div>
                    <h4 className="font-semibold text-foreground">Flexible Learning</h4>
                    <p className="text-sm text-muted-foreground">Online and offline options available</p>
                  </div>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                View All Courses
              </Button>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 text-primary mx-auto opacity-20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <p className="text-muted-foreground mt-4">Upgrade your skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I apply for opportunities on YouthConnex?',
                a: 'Simply browse available opportunities, click on one that interests you, and click "Apply Now". Your profile will be sent to the employer.'
              },
              {
                q: 'Are there fees to use YouthConnex?',
                a: 'No! Registration and job search are completely free for all users. All opportunities are verified by the government.'
              },
              {
                q: 'What if I don\'t get a response to my application?',
                a: 'Applications are reviewed by employers within 5-10 business days. You can track your application status in your dashboard.'
              },
              {
                q: 'Can I apply for multiple opportunities?',
                a: 'Yes! You can apply for as many opportunities as you\'d like. We recommend tailoring your profile for each application.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-card rounded-lg border border-border p-4">
                <summary className="font-semibold text-foreground cursor-pointer flex justify-between items-center">
                  {faq.q}
                  <span className="text-primary">+</span>
                </summary>
                <p className="text-muted-foreground mt-3">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 font-heading">Still have questions?</h2>
          <p className="mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
            Our support team is here to help. Reach out anytime and we&apos;ll get back to you within 24 hours.
          </p>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
            Contact Support
          </Button>
        </div>
      </div>
    </main>
  )
}
