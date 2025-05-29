import {
  BellIcon,
  InfoOutlineIcon,
  BulbOutlineIcon,
  ComponentIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const ctaSection = defineType({
  name: "ctaSection",
  title: documents.ctaSection,
  type: "object",
  icon: BellIcon,
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
    {
      name: "actions",
      title: groups.actions,
      icon: BulbOutlineIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.ctaSectionVariants,
        layout: "radio",
      },
      initialValue: "default",
    }),
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      description: descriptions.badgeTextDescription,
      group: "content",
      validation: (rule) =>
        rule.max(40).warning(validation.badgeTextWarning),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .error(validation.ctaTitleRequired)
          .max(120)
          .warning(validation.ctaTitleWarning),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) =>
        rule.max(300).warning(validation.ctaSubheadingWarning),
    }),
    defineField({
      name: "buttons",
      title: fields.buttons,
      type: "array",
      group: "actions",
      of: [
        defineArrayMember({
          type: "object",
          name: "button",
          title: descriptions.defaultButton,
          fields: [
            defineField({
              name: "label",
              title: fields.label,
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.buttonLabelRequired)
                  .max(50)
                  .warning(validation.buttonLabelWarning),
            }),
            defineField({
              name: "url",
              title: fields.url,
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.buttonUrlRequired)
                  .uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] })
                  .error(validation.buttonUrlInvalid),
            }),
            defineField({
              name: "variant",
              title: fields.buttonVariant,
              type: "string",
              options: {
                list: sanityOptions.buttonVariantOptions,
              },
              initialValue: "default",
            }),
            defineField({
              name: "icon",
              title: fields.icon,
              type: "string",
              options: {
                list: sanityOptions.ctaButtonIconOptions,
                layout: "radio",
              },
              initialValue: "none",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
              variant: "variant",
            },
            prepare({ title, subtitle, variant }) {
              const selectedVariant = sanityOptions.buttonVariantOptions.find(v => v.value === variant);
              const variantTitle = selectedVariant ? selectedVariant.title : variant;
              return {
                title: title || descriptions.defaultButton,
                subtitle: `${variantTitle || "Padrão"} | ${subtitle || descriptions.urlNotDefined}`,
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.buttonsMinRequired),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.ctaSectionVariants.find(v => v.value === variant);
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultCtaSection,
        subtitle: variantTitle || descriptions.defaultLayout,
        media: BellIcon,
      };
    },
  },
});
