import {
  CreditCardIcon,
  InfoOutlineIcon,
  TagIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const pricingSection = defineType({
  name: "pricingSection",
  title: documents.pricingSection,
  type: "object",
  icon: CreditCardIcon,
  groups: [
    {
      name: "content",
      title: groups.content,
      icon: InfoOutlineIcon,
      default: true,
    },
    { 
      name: "plans", 
      title: fields.pricingPlans, 
      icon: TagIcon 
    },
  ],
  fields: [
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      initialValue: descriptions.defaultPricing,
      group: "content",
      validation: (rule) => 
        rule.max(20).warning(validation.badgeTextWarningPricing),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) => 
        rule.required().error(validation.pricingSectionTitleRequired),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      rows: 2,
      group: "content",
      validation: (rule) =>
        rule.max(160).warning(validation.pricingSubheadingWarning),
    }),
    defineField({
      name: "plans",
      title: fields.pricingPlans,
      type: "array",
      group: "plans",
      of: [
        defineArrayMember({
          type: "object",
          name: "plan",
          title: descriptions.defaultPricingPlan,
          fields: [
            defineField({
              name: "title",
              title: fields.planTitle,
              type: "string",
              validation: (rule) => 
                rule.required().error(validation.pricingPlanTitleRequired),
            }),
            defineField({
              name: "description",
              title: fields.planDescription,
              type: "text",
              validation: (rule) =>
                rule.max(300).warning(validation.pricingPlanDescriptionWarning),
            }),
            defineField({
              name: "highlighted",
              title: fields.highlighted,
              type: "string",
              description: descriptions.highlightPlanDescriptionPricing,
              options: {
                list: sanityOptions.yesNo,
                layout: "radio",
              },
              initialValue: "false",
            }),
            defineField({
              name: "price",
              title: fields.price,
              type: "string",
              description: descriptions.pricingPlanExample,
              validation: (rule) => 
                rule.required().error(validation.pricingPlanPriceRequired),
            }),
            defineField({
              name: "billingPeriod",
              title: fields.billingPeriod,
              type: "string",
              description: descriptions.pricingBillingPeriodExample,
              validation: (rule) =>
                rule.max(20).warning(validation.pricingBillingPeriodWarning),
            }),
            defineField({
              name: "features",
              title: fields.pricingFeatures,
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "feature",
                  title: descriptions.defaultPricingFeature,
                  fields: [
                    defineField({
                      name: "title",
                      title: fields.title,
                      type: "string",
                      validation: (rule) => 
                        rule.required().error(validation.pricingFeatureTitleRequired),
                    }),
                    defineField({
                      name: "description",
                      title: fields.description,
                      type: "text",
                      validation: (rule) =>
                        rule.max(200).warning(validation.pricingFeatureDescriptionWarning),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "title",
                      description: "description",
                    },
                    prepare({ title, description }) {
                      return {
                        title: title || descriptions.noPricingFeature,
                        subtitle: description ? `${description.substring(0, 50)}...` : "",
                      };
                    },
                  },
                }),
              ],
              validation: (rule) =>
                rule.min(1).error(validation.pricingFeaturesMinRequired),
            }),
            defineField({
              name: "buttonText",
              title: fields.buttonText,
              type: "string",
              validation: (rule) => 
                rule.required().error(validation.pricingButtonTextRequired),
            }),
            defineField({
              name: "buttonUrl",
              title: fields.buttonUrl,
              type: "url",
              validation: (rule) => 
                rule.required().error(validation.pricingButtonUrlRequired)
                .uri({
                  allowRelative: true,
                  scheme: ["http", "https", "mailto", "tel"]
                }).error(validation.pricingButtonUrlInvalid),
            }),
            defineField({
              name: "buttonIcon",
              title: fields.buttonIcon,
              type: "string",
              options: {
                list: sanityOptions.pricingButtonIconOptions,
                layout: "radio",
              },
              initialValue: "arrowRight",
            }),
            defineField({
              name: "buttonVariant",
              title: fields.buttonVariant,
              type: "string",
              options: {
                list: sanityOptions.pricingButtonVariantOptions,
                layout: "radio",
              },
              initialValue: "default",
            }),
          ],
          preview: {
            select: {
              title: "title",
              price: "price",
            },
            prepare({ title, price }) {
              return {
                title: title || descriptions.defaultPricingPlan,
                subtitle: price ? `${price}` : descriptions.noPrice,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error(validation.pricingPlansMinRequired),
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title || descriptions.defaultPricingSection,
        media: CreditCardIcon,
      };
    },
  },
});
