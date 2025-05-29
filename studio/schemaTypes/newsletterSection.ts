import { EnvelopeIcon, InfoOutlineIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const newsletterSection = defineType({
  name: "newsletterSection",
  title: documents.newsletterSection,
  type: "object",
  icon: EnvelopeIcon,
  groups: [
    {
      name: "content",
      title: groups.content,
      icon: InfoOutlineIcon,
      default: true,
    },
    {
      name: "appearance",
      title: groups.appearance,
      icon: ComponentIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.newsletterVariants,
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      group: "content",
      description: descriptions.newsletterBadgeDescription,
      validation: (rule) => 
        rule.max(30).warning(validation.badgeTextWarningNewsletter),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      group: "content",
      validation: (rule) => 
        rule.required().error(validation.newsletterTitleRequired),
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      group: "content",
      rows: 3,
      validation: (rule) =>
        rule.max(200).warning(validation.newsletterSubheadingWarning),
    }),
    defineField({
      name: "inputPlaceholder",
      title: fields.inputPlaceholder,
      type: "string",
      group: "content",
      initialValue: descriptions.defaultEmailPlaceholder,
      validation: (rule) =>
        rule.max(50).warning(validation.placeholderWarning),
    }),
    defineField({
      name: "buttonText",
      title: fields.buttonText,
      type: "string",
      group: "content",
      initialValue: descriptions.defaultSubscribeButton,
      validation: (rule) => 
        rule.required().error(validation.newsletterButtonTextRequired)
          .max(30).warning(validation.newsletterButtonTextWarning),
    }),
    defineField({
      name: "buttonIcon",
      title: fields.buttonIcon,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.newsletterButtonIconOptions,
        layout: "radio",
      },
      initialValue: "mail",
    }),
    defineField({
      name: "successMessage",
      title: fields.successMessage,
      type: "string",
      group: "content",
      initialValue: descriptions.defaultSuccessMessage,
      validation: (rule) =>
        rule.required().error(validation.successMessageRequired)
          .max(100).warning(validation.successMessageWarning),
    }),
    defineField({
      name: "privacyText",
      title: fields.privacyText,
      type: "text",
      group: "content",
      description: descriptions.privacyTextDescription,
      rows: 2,
      validation: (rule) =>
        rule.max(200).warning(validation.privacyTextWarning),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.newsletterVariants.find((v) => v.value === variant);
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      
      return {
        title: title || descriptions.defaultNewsletterSection,
        subtitle: `${descriptions.newsletterVariantLabel}${variantTitle || descriptions.defaultLayout}`,
        media: EnvelopeIcon,
      };
    },
  },
});
