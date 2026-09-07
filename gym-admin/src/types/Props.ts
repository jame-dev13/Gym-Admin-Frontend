import { type LucideIcon } from 'lucide-react'

type AvailableIcon = LucideIcon

export interface LinkToBaseProps {
  to: string
  Icon?: AvailableIcon
  className?: string
  label?: string
}

export type LinkToProps = Partial<LinkToBaseProps> & {
  'aria-label'?: string
}

export interface NavLinkProps {
  section?: string
  className?: string
}

export type NavLinkToProps = Partial<LinkToBaseProps>