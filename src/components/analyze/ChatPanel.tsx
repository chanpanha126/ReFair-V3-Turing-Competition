import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const initialMessages: ChatMessage[] = [
  { id: 'q1', role: 'user', text: 'Why are delivery times worse in Sen Sok?' },
  {
    id: 'a1',
    role: 'assistant',
    text: 'Sen Sok has the highest cancellation rate at 9.8%, and delivery times across all areas peak on Saturday at 34 minutes. The two likely compound — longer trips into that area are more likely to get cancelled before completion.',
  },
  { id: 'q2', role: 'user', text: 'Which restaurant should we feature this month?' },
  {
    id: 'a2',
    role: 'assistant',
    text: 'Lucky Burger leads with $41,200 in revenue this month, about 18% ahead of Pho House, the next closest restaurant.',
  },
]

const suggestedQuestions = ['What day has the slowest deliveries?', 'Which payment method is most popular?']

const fallbackResponse =
  "That's a good question — I'd need to dig into that specific segment to give you a precise answer. Try asking about revenue by restaurant, delivery times, or cancellation rates for a data-backed take."

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const ask = (question: string) => {
    if (!question.trim() || isTyping) return
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: question.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: fallbackResponse }])
      setIsTyping(false)
    }, 1100)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-card shadow-[-8px_0_24px_-16px_rgba(16,27,51,0.25)]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <span className="inline-flex size-7 items-center justify-center rounded-md bg-accent text-primary">
          <Sparkles className="size-4" strokeWidth={1.75} />
        </span>
        <h2 className="font-heading text-sm font-medium text-foreground">Assistant</h2>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <p
              className={
                message.role === 'user'
                  ? 'max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground'
                  : 'max-w-[85%] rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-sm text-foreground'
              }
            >
              {message.text}
            </p>
          </motion.div>
        ))}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-1 rounded-lg rounded-bl-sm bg-muted px-3 py-2.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pb-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            disabled={isTyping}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data…"
          disabled={isTyping}
        />
        <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
          <Send className="size-4" />
        </Button>
      </form>
    </aside>
  )
}
