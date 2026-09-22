import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  ok: boolean
  className?: string
}

export function ScoreBar({ score, ok, className }: ScoreBarProps) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]', className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: ok ? 'var(--sage)' : 'var(--brick)' }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  )
}
