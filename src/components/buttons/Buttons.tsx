import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Loader2, Menu, RefreshCw, X } from 'lucide-react'
import type {
  SubmitBtnProps,
  CommandBtnProps,
  PillBtnProps,
  SwitchBtnProps,
  RefreshBtnProps,
  BurgerBtnProps,
} from '@/types/Props'

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

const switchTrackSizes = {
  sm: 'h-6 w-11 px-0.5',
  md: 'h-8 w-14 px-1',
} as const

const switchKnobSizes = {
  sm: 'size-5',
  md: 'size-6',
} as const

const switchKnobTravel = {
  sm: 'translate-x-5',
  md: 'translate-x-6',
} as const

const switchIconSizes = {
  sm: 12,
  md: 14,
} as const

export const SwitchBtn = ({
  checked,
  onCheckedChange,
  onClick,
  OnIcon = Check,
  OffIcon = X,
  label,
  disabled = false,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}: SwitchBtnProps) => {
  const accessibleName = ariaLabel ?? label

  const handleClick = () => {
    if (disabled) return
    onCheckedChange?.(!checked)
    onClick?.()
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={accessibleName}
        disabled={disabled}
        onClick={handleClick}
        className={[
          'relative',
          'inline-flex',
          'items-center',
          'shrink-0',
          'rounded-full',
          'border',
          'cursor-pointer',
          'transition-colors',
          'duration-300',
          'ease-in-out',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-accent',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-surface',
          'disabled:opacity-50',
          'disabled:cursor-not-allowed',
          switchTrackSizes[size],
          checked
            ? 'bg-accent border-accent'
            : 'bg-surface-over border-border hover:border-border-emphasis',
        ].join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'relative',
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-full',
            'bg-surface',
            'text-text-secondary',
            'shadow',
            'transition-transform',
            'duration-300',
            'ease-in-out',
            switchKnobSizes[size],
            checked ? switchKnobTravel[size] : 'translate-x-0',
          ].join(' ')}
        >
          <OnIcon
            size={switchIconSizes[size]}
            aria-hidden="true"
            className={[
              'absolute',
              'transition-all',
              'duration-300',
              checked
                ? 'opacity-100 scale-100 rotate-0 text-accent'
                : 'opacity-0 scale-50 rotate-90',
            ].join(' ')}
          />
          <OffIcon
            size={switchIconSizes[size]}
            aria-hidden="true"
            className={[
              'absolute',
              'transition-all',
              'duration-300',
              checked
                ? 'opacity-0 scale-50 -rotate-90'
                : 'opacity-100 scale-100 rotate-0',
            ].join(' ')}
          />
        </span>
      </button>
      {label && (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      )}
    </span>
  )
}

const refreshStyles = [
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
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-accent',
  'focus-visible:ring-offset-2',
  'focus-visible:ring-offset-surface',
  'disabled:opacity-50',
  'disabled:cursor-not-allowed',
].join(' ')

const DEFAULT_REFRESH_COOLDOWN_MS = 30_000

export const RefreshBtn = ({
  onClick,
  Icon = RefreshCw,
  cooldownMs = DEFAULT_REFRESH_COOLDOWN_MS,
  showCountdown = true,
  label,
  children,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: RefreshBtnProps) => {
  if (!Number.isFinite(cooldownMs) || cooldownMs <= 0) {
    throw new Error('RefreshBtn requires a positive cooldownMs')
  }

  const [remainingMs, setRemainingMs] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return clearTimers
  }, [])

  const isCoolingDown = remainingMs > 0
  const isDisabled = disabled || isCoolingDown
  const remainingSeconds = Math.ceil(remainingMs / 1000)

  const handleClick = () => {
    if (isDisabled) return
    onClick?.()
    setRemainingMs(cooldownMs)
    clearTimers()
    timeoutRef.current = setTimeout(() => {
      clearTimers()
      setRemainingMs(0)
    }, cooldownMs)
    intervalRef.current = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 1000))
    }, 1000)
  }

  const content = isCoolingDown && showCountdown ? (
    <span aria-live="polite">Retry in {remainingSeconds}s</span>
  ) : (
    (children ?? label ?? 'Refresh')
  )

  return (
    <button
      type="button"
      className={`${refreshStyles} ${className}`}
      onClick={handleClick}
      aria-label={ariaLabel ?? (typeof content === 'string' ? content : 'Refresh')}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      title={isCoolingDown ? `Available again in ${remainingSeconds}s` : undefined}
    >
      <Icon
        size={18}
        aria-hidden="true"
        className={isCoolingDown ? 'animate-spin' : undefined}
      />
      {content}
    </button>
  )
}

const burgerStyles = [
  'rounded-full',
  'p-1.5',
  'text-text-secondary',
  'transition-colors',
  'hover:bg-surface-over',
  'hover:text-text-primary',
  'focus-visible:outline-2',
  'focus-visible:outline-offset-2',
  'focus-visible:outline-accent',
  'tab:hidden',
].join(' ')

export const BurgerBtn = ({
  open,
  controlsId,
  onToggle,
  buttonRef,
}: BurgerBtnProps) => {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={onToggle}
      className={burgerStyles}
    >
      {open ? (
        <X size={20} aria-hidden="true" />
      ) : (
        <Menu size={20} aria-hidden="true" />
      )}
    </button>
  )
}
