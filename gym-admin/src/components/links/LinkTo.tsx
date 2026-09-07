import { Link } from 'react-router-dom'
import type { LinkToProps } from '@/types/Props'

type LinkToIconProps = NonNullable<LinkToProps['Icon']>

const DEFAULT_TARGET = '/'

const baseLinkStyles = [
  'inline-flex',
  'items-center',
  'gap-2',
  'text-text-secondary',
  'hover:text-accent',
  'hover:underline',
  'underline-offset-4',
  'transition-colors',
  'duration-200',
].join(' ')

export const LinkTo = ({
  to = DEFAULT_TARGET,
  Icon,
  className = '',
  label,
  'aria-label': ariaLabel,
}: LinkToProps) => {
  const IconNode: LinkToIconProps | undefined = Icon

  return (
    <Link
      to={to}
      className={`${baseLinkStyles} ${className}`}
      aria-label={ariaLabel}
    >
      {IconNode && <IconNode size={18} aria-hidden="true" />}
      {label && <span>{label}</span>}
    </Link>
  )
}