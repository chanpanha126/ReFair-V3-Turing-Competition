import { AnimatePresence, motion } from 'framer-motion'
import { FileSpreadsheet, Loader2, UploadCloud, X } from 'lucide-react'
import { type DragEvent, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

const ACCEPTED_EXTENSIONS = ['.csv', '.xlsx', '.xls']
const STEP_DURATION_MS = 650

interface SelectedFile {
  name: string
  size: number
}

interface UploadFlowProps {
  heading: string
  description: string
  ctaLabel?: string
  processingSteps: string[]
  onComplete: (fileName: string) => void
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadFlow({ heading, description, ctaLabel = 'Upload & Analyze', processingSteps, onComplete }: UploadFlowProps) {
  const [file, setFile] = useState<SelectedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isProcessing) return
    const timers: number[] = []
    for (let i = 1; i < processingSteps.length; i++) {
      timers.push(window.setTimeout(() => setStepIndex(i), i * STEP_DURATION_MS))
    }
    timers.push(
      window.setTimeout(() => {
        if (file) onComplete(file.name)
      }, processingSteps.length * STEP_DURATION_MS + 250),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing])

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const picked = files[0]
    setFile({ name: picked.name, size: picked.size })
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const startProcessing = () => {
    if (!file) return
    setStepIndex(0)
    setIsProcessing(true)
  }

  if (isProcessing) {
    const totalDuration = processingSteps.length * STEP_DURATION_MS
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm ring-1 ring-foreground/10">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
          <Loader2 className="size-6 animate-spin" strokeWidth={2} />
        </div>
        <div className="mt-5 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="font-medium text-foreground"
            >
              {processingSteps[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: totalDuration / 1000, ease: 'linear' }}
          />
        </div>
        <p className="mt-4 truncate text-xs text-muted-foreground">{file?.name}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-medium text-foreground md:text-3xl">{heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center shadow-sm transition-all duration-200 ${
          file ? 'cursor-default border-border bg-card' : 'cursor-pointer bg-card'
        } ${isDragging ? 'border-primary bg-accent/40' : !file ? 'border-border hover:border-primary/40 hover:bg-accent/20' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {!file ? (
          <>
            <div className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
              <UploadCloud className="size-6" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-medium text-foreground">Drag and drop your file here</p>
              <p className="mt-1 text-xs text-muted-foreground">Accepts {ACCEPTED_EXTENSIONS.join(', ')}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              Browse files
            </Button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-sm items-center gap-3 rounded-lg border border-border bg-accent/30 px-4 py-3 text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              <FileSpreadsheet className="size-4" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{file.name}</span>
              <span className="block text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
              }}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
              <span className="sr-only">Remove file</span>
            </button>
          </motion.div>
        )}
      </div>

      {file && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 flex justify-center"
        >
          <Button onClick={startProcessing}>{ctaLabel}</Button>
        </motion.div>
      )}
    </div>
  )
}
