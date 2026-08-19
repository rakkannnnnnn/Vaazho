import {
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react"

import PageHeader from "../components/layout/PageHeader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"

function Contact() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact VAZHO"
        title="We're here to help."
        description="Have a question about VAZHO, your trip or the platform? Send us a message and we'll get back to you."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          {/* Contact information */}
          <div>
            <h2 className="text-2xl font-semibold">
              Get in touch
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Whether you have a question, feedback or need help
              understanding a feature, we'd love to hear from you.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>

                <div>
                  <p className="font-medium">Email</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    hello@vazho.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageCircle className="size-5 text-primary" />
                </div>

                <div>
                  <p className="font-medium">Support</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We're happy to help with your questions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="size-5 text-primary" />
                </div>

                <div>
                  <p className="font-medium">Location</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <form
              onSubmit={(event) => event.preventDefault()}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium"
                  >
                    Name
                  </label>

                  <Input
                    id="name"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium"
                >
                  Subject
                </label>

                <Input
                  id="subject"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium"
                >
                  Message
                </label>

                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  className="min-h-32"
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto"
              >
                Send message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact