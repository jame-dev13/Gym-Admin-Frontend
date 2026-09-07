import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import type { SubmitBtnProps, CommandBtnProps, PillBtnProps } from '@/types/Props'

const submitStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'bg-accent',
  'text-surface',
  'font-semibold',
  'px-4',
  'py-2',
  'rounded-lg',
  'hover:bg-accent-emphasis',
  'transition-colors',
  'duration-200',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
].join(' ')

const SubmitContent = ({
  Icon,
  children,
}: {
  Icon?: SubmitBtnProps['Icon']
  children: React.ReactNode
}) => {
  const { pending } = useFormStatus()

  return (
    <>
      {pending ? (
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon size={18} aria-hidden="true" />
      )}
      {pending ? <span>Process...</span> : children}
    </>
  )
}

export const SubmitBtn = ({
  Icon,
  onClick,
  'aria-label': ariaLabel,
  children,
  disabled = false,
  className = '',
}: SubmitBtnProps) => {
  return (
    <button
      type="submit"
      className={`${submitStyles} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <SubmitContent Icon={Icon}>{children}</SubmitContent>
    </button>
  )
}

const commandStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'bg-surface-raised',
  'text-text-primary',
  'border',
  'border-border',
  'px-4',
  'py-2',
  'rounded-lg',
  'hover:bg-surface-over',
  'hover:border-accent',
  'transition-colors',
  'duration-200',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
].join(' ')

export const CommandBtn = ({
  type = 'button',
  Icon,
  onClick,
  'aria-label': ariaLabel,
  children,
  disabled = false,
  className = '',
}: CommandBtnProps) => {
  return (
    <button
      type={type}
      className={`${commandStyles} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </button>
  )
}

const pillStyles = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'bg-accent/10',
  'text-accent',
  'rounded-full',
  'px-5',
  'py-1.5',
  'hover:bg-accent/20',
  'transition-colors',
  'duration-200',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
].join(' ')

export const PillBtn = ({
  type = 'button',
  Icon,
  onClick,
  'aria-label': ariaLabel,
  children,
  disabled = false,
  className = '',
}: PillBtnProps) => {
  return (
    <button
      type={type}
      className={`${pillStyles} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {Icon && <Icon size={18} aria-hidden="true" />}
      {children}
    </button>
  )
}
