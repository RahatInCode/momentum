import { forwardRef } from 'react'

export const Input = forwardRef(
  ({ label, error, hint, className = '', ...props }, ref) => {
    const id = props.id || props.name

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full px-3 py-2.5 min-h-11
            bg-surface-2 border border-surface-3 rounded-lg
            text-text-primary placeholder:text-text-muted
            transition-colors duration-150
            hover:border-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent-medium
            focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Textarea = forwardRef(
  ({ label, error, hint, className = '', ...props }, ref) => {
    const id = props.id || props.name

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`
            w-full px-3 py-2.5 min-h-25
            bg-surface-2 border border-surface-3 rounded-lg
            text-text-primary placeholder:text-text-muted
            transition-colors duration-150 resize-none
            hover:border-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent-medium
            focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger focus:ring-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        {hint && !error && <p className="text-sm text-text-muted">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'