import { ArrowRight, BarChart3, FileSpreadsheet, Upload, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import logoFull from '@/assets/logo-full.png'
import logoIcon from '@/assets/logo-icon.png'

const steps = [
  {
    number: '01',
    icon: Upload,
    label: 'Upload your dataset',
    description: 'Drop in a CSV — no setup required.',
  },
  {
    number: '02',
    icon: Wand2,
    label: 'Automated data cleaning',
    description: 'Missing values, duplicates, and typos resolved for you.',
  },
  {
    number: '03',
    icon: BarChart3,
    label: 'Instant visual analysis',
    description: 'Explore trends with interactive charts and dashboards.',
  },
]

const tools = [
  {
    icon: Wand2,
    title: 'Clean',
    description: 'Profile your data and fix quality issues in minutes.',
    href: '/clean',
    note: 'Supports .csv, .xlsx, .xls',
  },
  {
    icon: BarChart3,
    title: 'Analyze',
    description: 'Build dashboards and get answers from your data.',
    href: '/analyze',
  },
]

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center">
            <img src={logoFull} alt="ReFair" className="h-8 w-auto" />
          </Link>
          <Button render={<Link to="/clean" />} nativeButton={false}>
            Get started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Decorative background: dot grid + soft overlapping shapes */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(circle, var(--line) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              maskImage:
                'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute -top-24 right-[8%] size-72 rounded-full opacity-30 blur-3xl"
            style={{ background: 'var(--sky)' }}
          />
          <div
            className="pointer-events-none absolute top-10 left-[6%] size-56 rounded-full opacity-20 blur-3xl"
            style={{ background: 'var(--blue)' }}
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center md:text-left"
            >
              <h1 className="font-heading text-5xl font-medium tracking-tight text-balance text-foreground md:text-6xl">
                Clean data. Clear insight.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground text-balance md:mx-0">
                ReFair turns messy spreadsheets into dashboards you can trust — automatically.
              </p>
              <div className="mt-8 flex justify-center md:justify-start">
                <Button size="lg" render={<Link to="/clean" />} nativeButton={false}>
                  Get started
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>

            {/* Hero visual: stylized dashboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-md"
            >
              <div
                className="pointer-events-none absolute -inset-6 rounded-3xl opacity-50 blur-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, var(--sky) 0%, var(--blue) 100%)',
                }}
              />
              <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xl shadow-[var(--ink)]/10">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[var(--brick)]/60" />
                  <span className="size-2.5 rounded-full bg-[var(--steel)]/40" />
                  <span className="size-2.5 rounded-full bg-[var(--sage)]/60" />
                  <span className="ml-auto text-xs font-medium text-muted-foreground">
                    Dashboard
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Rows cleaned', value: '12.4k' },
                    { label: 'Issues fixed', value: '318' },
                    { label: 'Data quality', value: '98%' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg border border-border bg-accent/40 p-2.5"
                    >
                      <p className="font-mono text-sm font-medium text-foreground">
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex h-28 items-end gap-2.5 rounded-lg border border-border bg-accent/20 p-4">
                  {[38, 62, 45, 80, 55, 92, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.4 + i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex-1 rounded-t-sm"
                      style={{
                        background: i % 2 === 0 ? 'var(--blue)' : 'var(--sky)',
                      }}
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="size-14 shrink-0 rounded-full"
                    style={{
                      background:
                        'conic-gradient(var(--blue) 0% 65%, var(--sky) 65% 88%, var(--line) 88% 100%)',
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-full rounded-full bg-[var(--line)]">
                      <div className="h-2 w-[70%] rounded-full bg-[var(--blue)]" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--line)]">
                      <div className="h-2 w-[45%] rounded-full bg-[var(--sky)]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools */}
        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.title} to={tool.href} className="group block">
                <Card className="h-full shadow-sm ring-1 ring-foreground/10 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-[var(--blue)]/10 group-hover:ring-primary/30">
                  <CardContent>
                    <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <tool.icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-medium text-foreground">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                    {tool.note && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-accent/30 px-2 py-1 text-xs text-muted-foreground">
                        <FileSpreadsheet className="size-3.5" strokeWidth={1.75} />
                        {tool.note}
                      </div>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="relative overflow-hidden border-t border-border py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage:
                'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6">
            <h2 className="text-center font-heading text-3xl font-medium tracking-tight text-foreground">
              How it works
            </h2>

            <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
              {steps.map((step, i) => (
                <div key={step.label} className="relative">
                  {i < steps.length - 1 && (
                    <div className="pointer-events-none absolute top-5 left-[calc(50%+2.5rem)] hidden w-[calc(100%-5rem)] items-center md:flex">
                      <svg
                        className="h-4 w-full text-[var(--line)]"
                        viewBox="0 0 100 16"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        <line
                          x1="0"
                          y1="8"
                          x2="94"
                          y2="8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M90 2 L98 8 L90 14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-medium text-primary-foreground">
                        {step.number}
                      </span>
                      <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                        <step.icon className="size-5" strokeWidth={1.75} />
                      </div>
                    </div>
                    <h3 className="mt-4 font-medium text-foreground">{step.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="" className="size-5" />
            <span>ReFair</span>
          </div>
          <span>© 2026 ReFair</span>
        </div>
      </footer>
    </div>
  )
}
