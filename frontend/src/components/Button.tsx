import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`h-11 min-w-max cursor-pointer rounded-lg bg-star px-3.25 text-xs font-extrabold tracking-[0.4px] text-page uppercase transition-[filter,transform] hover:-translate-y-px hover:brightness-110 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-cream focus-visible:outline-offset-4 sm:min-w-28.5 sm:px-5 sm:text-sm ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
