import { InfoOutlineIcon, BarChartIcon, ComponentIcon } from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import {
  fields,
  groups,
  documents,
  descriptions,
  validation,
  sanityOptions,
} from "../dictionary";

export const statsSection = defineType({
  name: "statsSection",
  title: documents.statsSection,
  type: "object",
  icon: BarChartIcon,
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
      name: "stats",
      title: fields.stats,
      icon: BarChartIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.statsVariants,
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      description: descriptions.badgeTextDescriptionStats,
      hidden: ({ parent }) => parent?.variant !== "withContent",
      group: "content",
      validation: (rule) =>
        rule.max(30).warning(validation.badgeTextWarningStats),
    }),
    defineField({
      name: "contentHeading",
      title: fields.contentHeading,
      type: "string",
      description: descriptions.contentHeadingDescription,
      hidden: ({ parent }) => parent?.variant !== "withContent",
      group: "content",
      validation: (rule) =>
        rule.max(100).warning(validation.contentHeadingWarning),
    }),
    defineField({
      name: "contentText",
      title: fields.contentText,
      type: "text",
      description: descriptions.contentTextDescription,
      rows: 4,
      hidden: ({ parent }) => parent?.variant !== "withContent",
      group: "content",
      validation: (rule) =>
        rule.max(400).warning(validation.contentTextWarning),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      description: descriptions.statsHeadingDescription,
      hidden: ({ parent }) => parent?.variant !== "grid",
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      description: descriptions.statsSubheadingDescription,
      rows: 2,
      hidden: ({ parent }) => parent?.variant !== "grid",
      group: "content",
    }),
    defineField({
      name: "stats",
      title: fields.stats,
      type: "array",
      description: descriptions.statsArrayDescription,
      group: "stats",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          title: descriptions.defaultStatistic,
          fields: [
            defineField({
              name: "value",
              title: fields.value,
              type: "string",
              description: descriptions.statValueDescription,
              validation: (rule) =>
                rule.required().error(validation.statValueRequired),
            }),
            defineField({
              name: "label",
              title: fields.label,
              type: "string",
              description: descriptions.statLabelDescription,
              validation: (rule) =>
                rule.required().error(validation.statLabelRequired),
            }),
            defineField({
              name: "trendDirection",
              title: fields.trendDirection,
              type: "string",
              options: {
                list: sanityOptions.trendDirections,
                layout: "radio",
              },
              initialValue: "none",
            }),
            defineField({
              name: "trendValue",
              title: fields.trendValue,
              type: "string",
              description: descriptions.trendValueDescription,
            }),
            defineField({
              name: "color",
              title: fields.color,
              type: "string",
              options: {
                list: sanityOptions.iconColors,
              },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: {
              value: "value",
              label: "label",
              trend: "trendValue",
            },
            prepare({ value, label, trend }) {
              return {
                title: value || descriptions.defaultStatistic,
                subtitle: `${label || ""}${trend ? ` (${trend})` : ""}`,
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.statsMinRequired),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.statsVariants.find(
        (v) => v.value === variant
      );
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultStatsSection,
        subtitle: variantTitle || descriptions.defaultLayout,
        media: BarChartIcon,
      };
    },
  },
});
