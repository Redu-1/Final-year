// src/components/layout/Container.jsx
import { forwardRef } from 'react'

const Container = forwardRef(({
  children,
  size = 'default',
  padding = true,
  className = '',
  ...props
}, ref) => {
  const maxWidthClasses = {
    full: 'max-w-none',
    default: 'max-w-7xl',
    narrow: 'max-w-5xl',
    wide: 'max-w-[90rem]',
  }

  const paddingClasses = padding 
    ? 'px-4 sm:px-6 lg:px-8' 
    : ''

  return (
    <div
      ref={ref}
      className={`mx-auto ${maxWidthClasses[size]} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
})

Container.displayName = 'Container'

// Section Component
export const Section = ({
  children,
  spacing = 'default',
  background = 'default',
  className = '',
  containerProps = {},
  ...props
}) => {
  const spacingClasses = {
    none: 'py-0',
    xs: 'py-8',
    sm: 'py-12',
    default: 'py-16 md:py-20',
    lg: 'py-24 md:py-28',
    xl: 'py-32 md:py-40',
  }

  const backgroundClasses = {
    default: 'bg-white',
    muted: 'bg-emerald-50',
    gradient: 'bg-gradient-to-br from-emerald-50 to-white',
    dark: 'bg-gradient-to-br from-emerald-900 to-emerald-800 text-white',
  }

  return (
    <section
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
      {...props}
    >
      <Container {...containerProps}>
        {children}
      </Container>
    </section>
  )
}

// Grid Layout Component
export const Grid = ({
  children,
  cols = 'default',
  gap = 'default',
  className = '',
  ...props
}) => {
  const gridColsClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    default: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-4',
    sm: 'gap-6',
    default: 'gap-8',
    lg: 'gap-12',
    xl: 'gap-16',
  }

  return (
    <div
      className={`grid ${gridColsClasses[cols]} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Flex Layout Component
export const Flex = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'center',
  wrap = false,
  gap = 'default',
  className = '',
  ...props
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    default: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  }

  const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap'

  return (
    <div
      className={`flex ${directionClasses[direction]} ${justifyClasses[justify]} ${alignClasses[align]} ${wrapClass} ${gapClasses[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Hero Container Component
export const HeroContainer = ({
  children,
  align = 'center',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      className={`max-w-4xl mx-auto ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container