import { forwardRef } from 'react'

const variants = {
  primary: `
    bg-accent-medium text-surface-0
    hover:bg-accent-high
    active:bg-accent-low
  `,
  secondary: `
    bg-surface-2 text-text-primary
    hover:bg-surface-3
    active:bg-surface-1
  `,
  ghost: `
    bg-transparent text-text-secondary
    hover:bg-surface-2 hover:text-text-primary
    active:bg-surface-3
  `,
  danger: `
    bg-transparent text-danger
    hover:bg-danger/10
    active:bg-danger/20
  `,
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center
          font-medium rounded-lg
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent-medium focus-visible:ring-offset-2
          focus-visible:ring-offset-surface-0
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'