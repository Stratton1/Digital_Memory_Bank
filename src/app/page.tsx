import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Heart,
  Lock,
  MessageCircle,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-serif text-xl font-bold text-foreground">
            Memory Bank
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pb-20 pt-24 text-center md:pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            Guided by Nexa, your memory companion
          </div>
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Preserve your family&apos;s story.
            <br />
            <span className="text-primary">One memory at a time.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Memory Bank is a secure, private space where you and your family can
            capture life&apos;s most meaningful moments — stories, reflections,
            and the little things that matter most. Before they fade.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8 text-base">
                <Heart className="h-4 w-4" />
                Start preserving memories
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 text-base">
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to use. No credit card required.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-card/50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              Everything you need to remember
            </h2>
            <p className="mt-3 text-muted-foreground">
              Simple tools to capture, organise, and share your most precious
              moments
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-primary" />}
              title="Daily prompts from Nexa"
              description="Nexa asks thoughtful questions every day to help you uncover and record memories you might never think to write down."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6 text-primary" />}
              title="Rich memory capture"
              description="Write your stories with titles, dates, locations, and hashtags. Every detail helps paint the full picture."
            />
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6 text-primary" />}
              title="Guided reflections"
              description="Questions across ten categories — childhood, milestones, gratitude, and more — designed to draw out your deepest memories."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Family connections"
              description="Invite family members and build your network. Share as much or as little as you choose."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6 text-primary" />}
              title="Shared vault"
              description="Choose exactly which memories to share with which people. Your stories, your rules."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-primary" />}
              title="Private by default"
              description="Every memory is private until you decide otherwise. Your data is encrypted and never shared with third parties."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              How it works
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Step
              number="1"
              title="Create your account"
              description="Sign up in seconds. Set up your profile and you're ready to go."
            />
            <Step
              number="2"
              title="Answer daily prompts"
              description="Nexa asks you a new question each day. Answer in your own words — there's no wrong way to remember."
            />
            <Step
              number="3"
              title="Build your vault"
              description="Your memories grow into a beautiful, searchable timeline. Share them with family whenever you're ready."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-card/50 px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Every family has a story worth telling
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don&apos;t let your most precious memories fade away. Start
            capturing them today — it only takes a moment.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg" className="gap-2 px-8 text-base">
                <Heart className="h-4 w-4" />
                Get started for free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Memory Bank. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <h3 className="font-serif text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
