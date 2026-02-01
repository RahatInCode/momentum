import { IDENTITY_TEMPLATES } from '../../utils/constants'

export const IdentityStatement = ({
  statement,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <blockquote
      className={`
        ${sizes[size]}
        text-text-primary font-medium
        pl-3 border-l-2 border-accent-medium
        ${className}
      `}
    >
      <span className="italic text-text-secondary">"I am a person who </span>
      <span>{statement}</span>
      <span className="italic text-text-secondary">"</span>
    </blockquote>
  )
}

export const IdentityStatementInput = ({
  value,
  onChange,
  template = IDENTITY_TEMPLATES[0],
  error,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        Your identity statement
      </label>
      <div className="flex items-start gap-2">
        <span className="py-2.5 text-text-secondary italic whitespace-nowrap">
          "{template}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="exercises daily"
          className={`
            flex-1 px-3 py-2.5
            bg-surface-2 border border-surface-3 rounded-lg
            text-text-primary placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-accent-medium
            ${error ? 'border-danger' : ''}
          `}
        />
        <span className="py-2.5 text-text-secondary italic">"</span>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}