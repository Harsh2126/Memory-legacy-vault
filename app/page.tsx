import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Heart, Lock, Share2, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">Legacy</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Preserve Your Family&apos;s Legacy
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create a digital vault for your family&apos;s most precious memories. Upload, share, and revisit the
                    moments that matter most.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Start Your Family Vault
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-indigo-100 opacity-50"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-4 transform rotate-12">
                      <div className="bg-white p-2 rounded-lg shadow-lg transform -rotate-6">
                        <div className="w-full aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                          <img
                            src="/placeholder.svg?height=300&width=400"
                            alt="Family photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-lg transform rotate-6 mt-8">
                        <div className="w-full aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                          <img
                            src="/placeholder.svg?height=300&width=400"
                            alt="Family photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-lg transform rotate-3">
                        <div className="w-full aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                          <img
                            src="/placeholder.svg?height=300&width=400"
                            alt="Family photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg shadow-lg transform -rotate-3 mt-4">
                        <div className="w-full aspect-[4/3] bg-gray-200 rounded overflow-hidden">
                          <img
                            src="/placeholder.svg?height=300&width=400"
                            alt="Family photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to preserve and share your family&apos;s most precious memories.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <Users className="h-6 w-6 text-rose-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Shared Vault Access</h3>
                  <p className="text-muted-foreground">
                    Create and join family vaults with multiple members to collaborate and share memories together.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <Share2 className="h-6 w-6 text-rose-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Upload & View Memories</h3>
                  <p className="text-muted-foreground">
                    Easily upload photos and browse through your family&apos;s collection of memories.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                  <Lock className="h-6 w-6 text-rose-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Safe Delete Mechanism</h3>
                  <p className="text-muted-foreground">
                    Control over your content with the ability to delete your own uploads or designate an admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Start preserving your family&apos;s legacy in three simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 text-2xl font-bold">
                  1
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Create Your Vault</h3>
                  <p className="text-muted-foreground">
                    Sign up and create a personalized vault for your family with a custom name and theme.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 text-2xl font-bold">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Invite Family Members</h3>
                  <p className="text-muted-foreground">
                    Share access with your loved ones so everyone can contribute to the family legacy.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 text-2xl font-bold">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Upload & Share Memories</h3>
                  <p className="text-muted-foreground">
                    Start uploading photos and sharing memories that will be preserved for generations to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Loved by Families</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  See what families are saying about Legacy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "Legacy has brought our family closer together. We've rediscovered so many forgotten memories and
                    created a treasure trove for future generations."
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-100 h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Family of 5</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    "I can't express how meaningful it is to have all our family photos in one place. My grandchildren
                    love exploring our history together."
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-100 h-10 w-10"></div>
                  <div>
                    <p className="text-sm font-medium">Robert Martinez</p>
                    <p className="text-sm text-muted-foreground">Family of 12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Preserving Your Family&apos;s Legacy Today
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Don&apos;t let precious memories fade away. Create your family vault now.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="gap-1.5">
                    Create Your Vault
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" />
            <span className="text-xl font-bold">Legacy</span>
          </div>
          <p className="text-sm text-muted-foreground md:order-first">
            © {new Date().getFullYear()} Legacy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
