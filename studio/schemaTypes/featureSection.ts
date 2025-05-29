import {
  SparklesIcon,
  InfoOutlineIcon,
  ImageIcon,
  ComponentIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import {
  fields,
  groups,
  documents,
  descriptions,
  validation,
  sanityOptions,
} from "../dictionary";

export const featureSection = defineType({
  name: "featureSection",
  title: documents.featureSection,
  type: "object",
  icon: SparklesIcon,
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
      name: "media",
      title: groups.media,
      icon: ImageIcon,
    },
    {
      name: "features",
      title: groups.features,
      icon: SparklesIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.featureLayoutVariants,
      },
      initialValue: "default",
    }),
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      description: descriptions.featureBadgeDescription,
      group: "content",
      validation: (rule) =>
        rule.max(40).warning(validation.badgeTextWarning),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) =>
        rule.required().error(validation.featureSectionTitleRequired),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      rows: 2,
      group: "content",
      validation: (rule) =>
        rule.max(250).warning(validation.featureSectionSubheadingWarning),
    }),
    defineField({
      name: "image",
      title: fields.image,
      type: "image",
      description: descriptions.featureImageDescription,
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: fields.alt,
          type: "string",
          validation: (rule) =>
            rule.required().error(validation.mainImageAltRequired),
        }),
      ],
      hidden: ({ parent }) =>
        parent?.variant !== "withImage" &&
        parent?.variant !== "slidingComparison",
      group: "media",
    }),
    defineField({
      name: "comparisonImage",
      title: fields.comparisonImage,
      type: "image",
      description: descriptions.comparisonImageDescription,
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: fields.alt,
          type: "string",
          validation: (rule) =>
            rule.required().error(validation.comparisonImageAltRequired),
        }),
      ],
      hidden: ({ parent }) => parent?.variant !== "slidingComparison",
      group: "media",
    }),
    defineField({
      name: "features",
      title: fields.features,
      type: "array",
      group: "features",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          title: descriptions.defaultFeature,
          fields: [
            defineField({
              name: "title",
              title: fields.featureTitle,
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.featureTitleRequired)
                  .max(100)
                  .warning(validation.featureTitleWarning),
            }),
            defineField({
              name: "description",
              title: fields.featureDescription,
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.max(200).warning(validation.featureDescriptionWarning),
            }),
            defineField({
              name: "icon",
              title: fields.icon,
              type: "string",
              description: descriptions.featureIconDescription,
              options: {
                list: sanityOptions.featureIconOptions,
                layout: "radio",
              },
              hidden: ({ parent }) => parent?.variant !== "masonryGrid",
            }),
            defineField({
              name: "highlighted",
              title: fields.highlightedFeature,
              type: "string",
              options: {
                list: sanityOptions.yesNo,
                layout: "radio",
              },
              description: descriptions.highlightedDescription,
              initialValue: "false",
              hidden: ({ parent }) => parent?.variant !== "masonryGrid",
            }),
            defineField({
              name: "image",
              title: fields.featureImage,
              type: "image",
              description: descriptions.featureItemImageDescription,
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: fields.alt,
                  type: "string",
                  validation: (rule) =>
                    rule.required().error(validation.featureImageAltRequired),
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
              media: "image",
              icon: "icon",
            },
            prepare({ title, subtitle, media, icon }) {
              const selectedIcon = sanityOptions.featureIconOptions.find(
                (i) => i.value === icon,
              );
              const iconTitle = selectedIcon ? selectedIcon.title : icon;
              return {
                title: title || descriptions.defaultFeature,
                subtitle:
                  subtitle ||
                  (icon
                    ? `${descriptions.iconLabel}${iconTitle}`
                    : descriptions.noDescription),
                media: media || SparklesIcon,
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.featuresMinRequired),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.featureLayoutVariants.find(
        (v) => v.value === variant,
      );
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultFeatureSection,
        subtitle: variantTitle || descriptions.defaultLayout,
        media: SparklesIcon,
      };
    },
  },
});
