'use client'

import {Button} from '@/components/ui/button'
import {stegaClean} from 'next-sanity'
import {Badge} from '@/components/ui/badge'
import {Input} from '@/components/ui/input'
import {MoveRight, Plus, Mail} from 'lucide-react'
import React, {useActionState} from 'react'
import type {ExtractPageBuilderType} from '@/sanity/page-builder'
import {submitNewsletterForm, type FormState} from '@/app/actions/forms'

// Map of icon names to components
export const IconMap = {
  arrowRight: MoveRight,
  plus: Plus,
  mail: Mail,
  none: null,
}

// Section header component
export const SectionHeader = ({
  badgeText,
  heading,
  subheading,
  variant = 'default',
}: Pick<ExtractPageBuilderType<'newsletterSection'>, 'badgeText' | 'heading' | 'subheading'> & {
  variant?: string
}) => (
  <>
    {/* Badge */}
    {badgeText && (
      <div>
        <Badge variant={stegaClean(variant) === 'highlight' ? 'secondary' : 'outline'}>
          {badgeText}
        </Badge>
      </div>
    )}

    {/* Content */}
    <div className="flex flex-col gap-2">
      <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">{heading}</h3>
      {subheading && (
        <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
          {subheading}
        </p>
      )}
    </div>
  </>
)

// Subscription form component
export const SubscriptionForm = ({
  inputPlaceholder = 'Digite seu e-mail',
  buttonText = 'Inscrever-se',
  buttonIcon = 'mail',
  successMessage = 'Obrigado por se inscrever!',
  privacyText,
  variant = 'default',
}: Pick<
  ExtractPageBuilderType<'newsletterSection'>,
  'inputPlaceholder' | 'buttonText' | 'buttonIcon' | 'successMessage' | 'privacyText' | 'variant'
>) => {
  const [state, formAction, pending] = useActionState(submitNewsletterForm, {
    status: 'idle',
  } as FormState)

  // Get icon if specified
  const cleanIcon = stegaClean(buttonIcon)
  const Icon = cleanIcon && cleanIcon !== 'none' ? IconMap[cleanIcon] : null

  // Apply different styles based on variant
  const isHighlightVariant = stegaClean(variant) === 'highlight'
  const isFullVariant = stegaClean(variant) === 'full'
  const containerClass =
    isHighlightVariant || isFullVariant ? 'rounded-md p-1 backdrop-blur-sm' : ''

  if (state.status === 'success') {
    return (
      <div className="mt-2 text-center text-green-600 dark:text-green-400">{successMessage}</div>
    )
  }

  return (
    <form action={formAction} className="w-full max-w-md">
      <div className={`flex flex-col sm:flex-row gap-2 ${containerClass}`}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <Input
          type="email"
          name="email"
          placeholder={inputPlaceholder}
          className={`flex-1 ${isHighlightVariant ? 'bg-primary-foreground border-secondary' : ''}`}
          required
        />
        <Button
          type="submit"
          disabled={pending}
          variant={isHighlightVariant ? 'secondary' : 'default'}
          className={Icon ? 'gap-2' : ''}
        >
          {buttonText}
          {Icon && <Icon className="w-4 h-4" />}
        </Button>
      </div>

      {state.status === 'error' && (
        <p className="mt-2 text-sm text-destructive">
          Ocorreu um erro. Por favor, tente novamente.
        </p>
      )}

      {privacyText && <p className="mt-2 text-xs text-muted-foreground">{privacyText}</p>}
    </form>
  )
}
