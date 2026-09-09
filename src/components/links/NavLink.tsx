import { Link } from 'react-router-dom'
import type { NavLinkProps, NavLinkToProps } from '@/types/Props'

type NavLinkToIconProps = NonNullable<NavLinkToProps['Icon']>

const DEFAULT_SECTION = ''

const navLinkStyles = [
  'inline-flex',
  'items-center',
  'gap-1.5',
  'text-text-secondary',
  'hover:text-accent',
  'hover:underline',
  'underline-offset-4',
  'transition-colors',
  'duration-200',
].join(' ')

export const NavLink = ({ section = DEFAULT_SECTION, className = '' }: NavLinkProps) => {
  return (
    <a href={`#${section}`} className={`${navLinkStyles} ${className}`}>
      {section}
    </a>
  )
}

const navLinkToStyles = [
  'flex',
  'items-center',
  'gap-3',
  'w-full',
  'rounded-lg',
  'px-3',
  'py-2',
  'text-text-secondary',
  'hover:bg-surface-over',
  'hover:text-accent',
  'transition-colors',
  'duration-200',
].join(' ')

export const NavLinkTo = ({
  to = '/',
  Icon,
  className = '',
  label,
}: NavLinkToProps) => {
  const IconNode: NavLinkToIconProps | undefined = Icon

  return (
    <Link to={to} className={`${navLinkToStyles} ${className}`}>
      {IconNode && <IconNode size={20} aria-hidden="true" />}
      {label && <span>{label}</span>}
    </Link>
  )
}