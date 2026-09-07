import type { ReactNode } from 'react'
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

export interface ButtonBaseProps {
  Icon?: AvailableIcon
  onClick?: () => void
  'aria-label'?: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export type SubmitBtnProps = Omit<ButtonBaseProps, 'type'> & {
  type?: 'submit'
}

export type CommandBtnProps = ButtonBaseProps & {
  type?: 'button' | 'reset'
}

export type PillBtnProps = ButtonBaseProps & {
  type?: 'button' | 'reset'
}