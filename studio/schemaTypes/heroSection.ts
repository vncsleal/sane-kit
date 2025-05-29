import {
  RocketIcon,
  InfoOutlineIcon,
  ComponentIcon,
  ImageIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const heroSection = defineType({
  name: "heroSection",
  title: documents.heroSection,
  type: "object",
  icon: RocketIcon,
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
      icon: RocketIcon,
    },
    {
      name: "media",
      title: groups.media,
      icon: ImageIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      options: {
        list: sanityOptions.heroVariants,
        layout: "radio",
      },
      initialValue: "buttonBanner",
      group: "appearance",
      validation: (rule) => 
        rule.required().error(validation.heroVariantRequired),
    }),
    defineField({
      name: "bannerButton",
      title: fields.bannerButton,
      type: "object",
      hidden: ({ parent }) => parent?.variant !== "buttonBanner",
      group: "actions",
      fields: [
        defineField({
          name: "label",
          title: fields.label,
          type: "string",
          validation: (rule) => 
            rule.required().error(validation.bannerButtonLabelRequired),
        }),
        defineField({
          name: "url",
          title: fields.url,
          type: "url",
          validation: (rule) => 
            rule.required().error(validation.bannerButtonUrlRequired)
            .uri({
              allowRelative: true,
              scheme: ["http", "https", "mailto", "tel"]
            }).error(validation.bannerButtonUrlInvalid),
        }),
      ],
    }),
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      group: "content",
      hidden: ({ parent }) =>
        parent?.variant !== "badgeBanner" && parent?.variant !== "gridGallery",
      validation: (rule) => 
        rule.max(30).warning(validation.badgeTextWarningHero),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) => 
        rule.required().error(validation.heroTitleRequired)
        .max(70).warning(validation.heroTitleWarning),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) =>
        rule.max(200).warning(validation.heroSubheadingWarning),
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
          title: descriptions.defaultHeroButton,
          fields: [
            defineField({
              name: "label",
              title: fields.label,
              type: "string",
              validation: (rule) => 
                rule.required().error(validation.heroButtonLabelRequired),
            }),
            defineField({
              name: "url",
              title: fields.url,
              type: "string",
              validation: (rule) => 
                rule.required().error(validation.heroButtonUrlRequired),
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
                list: sanityOptions.heroButtonIconOptions,
              },
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
                title: title || descriptions.defaultHeroButton,
                subtitle: `${variantTitle || descriptions.defaultLayout} | ${subtitle || descriptions.urlNotDefined}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "media",
      title: fields.media,
      type: "object",
      description: descriptions.heroMediaDescription,
      group: "media",
      fields: [
        defineField({
          name: "type",
          title: fields.mediaType,
          type: "string",
          options: {
            list: sanityOptions.heroMediaTypes,
            layout: "radio",
          },
          initialValue: "placeholder",
        }),
        defineField({
          name: "image",
          title: fields.image,
          type: "image",
          hidden: ({ parent }) => parent?.type !== "image",
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
        }),
        defineField({
          name: "video",
          title: fields.video,
          type: "object",
          hidden: ({ parent }) => parent?.type !== "video",
          fields: [
            defineField({
              name: "url",
              title: fields.videoUrl,
              type: "url",
              description: descriptions.videoUrlDescription,
              validation: (rule) => 
                rule.required().error(validation.heroButtonUrlRequired),
            }),
            defineField({
              name: "autoplay",
              title: fields.autoplay,
              type: "string",
              options: {
                list: sanityOptions.yesNo,
                layout: "radio",
              },
              initialValue: "false",
            }),
            defineField({
              name: "loop",
              title: fields.loop,
              type: "string",
              options: {
                list: sanityOptions.yesNo,
                layout: "radio",
              },
              initialValue: "true",
            }),
            defineField({
              name: "muted",
              title: fields.muted,
              type: "string",
              options: {
                list: sanityOptions.yesNo,
                layout: "radio",
              },
              initialValue: "true",
            }),
          ],
        }),
        defineField({
          name: "additionalImages",
          title: fields.additionalImages,
          type: "array",
          description: descriptions.additionalImagesDescription,
          hidden: ({ parent }) => {
            return parent?.type !== "image";
          },
          of: [
            defineArrayMember({
              type: "image",
              title: fields.image,
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
            }),
          ],
          validation: (rule) =>
            rule.max(3).warning(validation.additionalImagesMaxWarning),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "variant",
    },
    prepare({ title, subtitle }) {
      const selectedVariant = sanityOptions.heroVariants.find(v => v.value === subtitle);
      const variantTitle = selectedVariant ? selectedVariant.title : subtitle;
      return {
        title: title || descriptions.defaultHeroSection,
        subtitle: `${descriptions.heroVariantLabel}${variantTitle || "buttonBanner"}`,
        media: RocketIcon,
      };
    },
  },
});
