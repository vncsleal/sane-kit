import { HelpCircleIcon, InfoOutlineIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const faqSection = defineType({
  name: "faqSection",
  title: documents.faqSection,
  type: "object",
  icon: HelpCircleIcon,
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
      name: "questions",
      title: groups.questions,
      icon: HelpCircleIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.faqLayoutVariants,
        layout: "radio",
      },
      initialValue: "sideBySide",
    }),
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      description: descriptions.faqBadgeDescription,
      initialValue: descriptions.defaultFaq,
      group: "content",
      validation: (rule) =>
        rule.max(30).warning(validation.badgeTextWarning),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .error(validation.faqTitleRequired)
          .max(100)
          .warning(validation.faqTitleWarning),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      description: descriptions.faqSubheadingDescription,
      rows: 3,
      group: "content",
      validation: (rule) =>
        rule.max(250).warning(validation.faqSubheadingWarning),
    }),
    defineField({
      name: "buttonText",
      title: fields.buttonText,
      type: "string",
      description: descriptions.faqButtonDescription,
      group: "content",
      validation: (rule) =>
        rule.max(50).warning(validation.planButtonTextWarning),
    }),
    defineField({
      name: "buttonUrl",
      title: fields.buttonUrl,
      type: "url",
      description: descriptions.faqButtonUrlDescription,
      hidden: ({ parent }) => !parent?.buttonText,
      group: "content",
      validation: (rule) => 
        rule
          .required()
          .error(validation.faqButtonUrlRequired)
          .uri({
            allowRelative: true,
            scheme: ["http", "https", "mailto", "tel"]
          })
          .error(validation.faqButtonUrlInvalid)
    }),
    defineField({
      name: "buttonIcon",
      title: fields.buttonIcon,
      type: "string",
      options: {
        list: sanityOptions.faqButtonIconOptions,
      },
      initialValue: "phone",
      hidden: ({ parent }) => !parent?.buttonText,
      group: "content",
    }),
    defineField({
      name: "faqItems",
      title: fields.faqItems,
      type: "array",
      description: descriptions.faqItemsDescription,
      group: "questions",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: descriptions.faqItemDefault,
          fields: [
            defineField({
              name: "question",
              title: fields.question,
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.questionRequired)
                  .max(200)
                  .warning(validation.questionWarning),
            }),
            defineField({
              name: "answer",
              title: fields.answer,
              type: "text",
              rows: 3,
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.answerRequired)
                  .min(20)
                  .warning(validation.answerMinLength),
            }),
          ],
          preview: {
            select: {
              title: "question",
              subtitle: "answer",
            },
            prepare({ title, subtitle }) {
              const answerPreview = subtitle
                ? subtitle.substring(0, 80) + (subtitle.length > 80 ? "..." : "")
                : descriptions.noAnswer;
              return {
                title: title || descriptions.questionNotDefined,
                subtitle: answerPreview,
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.faqItemsMinRequired),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.faqLayoutVariants.find((v) => v.value === variant);
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultFaqSection,
        subtitle: variantTitle || descriptions.defaultLayout,
        media: HelpCircleIcon,
      };
    },
  },
});
