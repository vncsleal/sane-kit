'use client'

import {stegaClean} from 'next-sanity'
import {buttonVariants} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import Link from 'next/link'
import {SectionHeader, FeatureItem, IconMap, type PricingSectionProps} from './shared'

export default function DefaultPricing({
  badgeText = 'Pricing',
  heading,
  subheading,
  plans = [],
}: PricingSectionProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <SectionHeader badgeText={badgeText} heading={heading} subheading={subheading} />
          <div className="grid pt-20 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
            {plans.map((plan) => (
              <Card
                key={plan._key}
                className={`w-full rounded-md ${plan.highlighted === true ? 'shadow-2xl' : ''}`}
              >
                <CardHeader>
                  <CardTitle>
                    <span className="flex flex-row gap-4 items-center font-normal">
                      {plan.title}
                    </span>
                  </CardTitle>
                  {plan.description && <CardDescription>{plan.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-8 justify-start">
                    <p className="flex flex-row items-center gap-2 text-xl">
                      <span className="text-4xl">{plan.price}</span>
                      {plan.billingPeriod && (
                        <span className="text-sm text-muted-foreground"> {plan.billingPeriod}</span>
                      )}
                    </p>
                    <div className="flex flex-col gap-4 justify-start">
                      {plan.features?.map((feature) => (
                        <FeatureItem key={feature._key} feature={feature} />
                      ))}
                    </div>
                    {plan.buttonText && plan.buttonUrl && (
                      <Link
                        href={plan.buttonUrl || '#'}
                        className={cn(
                          buttonVariants({
                            variant:
                              stegaClean(plan.buttonVariant) ||
                              (plan.highlighted === true ? 'default' : 'outline'),
                          }),
                          'gap-4',
                        )}
                      >
                        {plan.buttonText}
                        {plan.buttonIcon &&
                          (() => {
                            const cleanIcon = stegaClean(plan.buttonIcon)
                            const Icon = cleanIcon ? IconMap[cleanIcon] : null
                            return Icon ? <Icon className="w-4 h-4" /> : null
                          })()}
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
