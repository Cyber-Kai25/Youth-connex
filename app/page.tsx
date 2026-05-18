import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-primary/5 via-background to-background pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-12">
            <div className="flex flex-col gap-6">
              <div>
                <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4">
                  National Youth Portal
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-heading leading-tight text-balance">
                  Empowering Cameroon&apos;s Next Generation
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-lg text-balance">
                Connect with verified job opportunities, agricultural projects, and vocational training designed to accelerate your career in your home region.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    Get Started
                  </Button>
                </Link>
                <Link href="/test-credentials">
                  <Button size="lg" variant="outline" className="border-border">
                    Try Demo
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-2xl font-bold text-primary font-heading">45k+</div>
                  <div className="text-sm text-muted-foreground">Registered Youth</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary font-heading">1.2k+</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary font-heading">10</div>
                  <div className="text-sm text-muted-foreground">Regions Covered</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-border/50 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-primary mx-auto opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <p className="text-muted-foreground mt-4">Your pathway to opportunity starts here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">How It Works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Four simple steps to connect with opportunities and advance your career
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Register Profile', desc: 'Create your profile with your skills and interests' },
              { step: 2, title: 'Browse Map', desc: 'Explore opportunities physically located in your region' },
              { step: 3, title: 'Apply with One Click', desc: 'Submit your profile directly to employers' },
              { step: 4, title: 'Get Matched', desc: 'Attend interviews and secure your opportunity' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4 font-heading">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2 font-heading">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">Explore Opportunities</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover various categories of opportunities available across Cameroon
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🌾', title: 'Agricultural Hubs', desc: 'Commercial farming & agribusiness projects', count: '140 Openings' },
              { icon: '💻', title: 'Tech Centers', desc: 'Software engineering & data roles', count: '89 Openings' },
              { icon: '📚', title: 'Training', desc: 'Vocational certification programs', count: '54 Courses' },
              { icon: '💼', title: 'Local Jobs', desc: 'Retail, logistics, & admin roles', count: '320 Positions' },
              { icon: '🏗️', title: 'Construction', desc: 'Project management & skilled trades', count: '95 Roles' },
              { icon: '🏥', title: 'Healthcare', desc: 'Medical & nursing opportunities', count: '67 Positions' },
            ].map((cat, idx) => (
              <div key={idx} className="p-6 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-foreground mb-2 font-heading">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
                <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of Cameroonian youth who are building their futures through YouthConnex. Registration takes less than 5 minutes.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-foreground mb-4 font-heading">YouthConnex</h3>
              <p className="text-sm text-muted-foreground">
                An initiative by the National Youth Employment Agency of Cameroon to bridge the gap between youth and opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 font-heading">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">Government Portal</Link></li>
                <li><Link href="/" className="text-muted-foreground hover:text-primary">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 font-heading">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3 font-heading">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-primary">Contact Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 National Youth Employment Agency, Cameroon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
