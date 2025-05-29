import {
  StarIcon,
  InfoOutlineIcon,
  UsersIcon,
  ComponentIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: documents.testimonialsSection,
  type: "object",
  icon: StarIcon,
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
      name: "quotes",
      title: fields.testimonials,
      icon: UsersIcon,
    },
  ],
  fields: [
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      group: "appearance",
      options: {
        list: sanityOptions.testimonialsVariants,
        layout: "radio", 
      },
      initialValue: "carousel",
      validation: (rule) => 
        rule.required().error(validation.testimonialsVariantRequired),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) => 
        rule.required().error(validation.testimonialsSectionTitleRequired),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      rows: 2,
      group: "content",
      validation: (rule) =>
        rule.max(160).warning(validation.testimonialsSubheadingWarning),
    }),
    defineField({
      name: "testimonials",
      title: fields.testimonials,
      type: "array",
      group: "quotes",
      of: [
        defineArrayMember({
          type: "object",
          name: "testimonial",
          title: descriptions.defaultTestimonial,
          fields: [
            defineField({
              name: "title",
              title: fields.title,
              type: "string",
              description: descriptions.testimonialTitleDescription,
              validation: (rule) => 
                rule.max(100).warning(validation.featureTitleWarning),
            }),
            defineField({
              name: "content",
              title: fields.content,
              type: "text",
              description: descriptions.testimonialContentDescription,
              rows: 3,
              validation: (rule) => 
                rule.required().error(validation.testimonialContentRequired)
                .max(500).warning(validation.testimonialContentWarning),
            }),
            defineField({
              name: "author",
              title: fields.author,
              type: "string",
              description: descriptions.testimonialAuthorDescription,
              validation: (rule) => 
                rule.required().error(validation.testimonialAuthorRequired),
            }),
            defineField({
              name: "role",
              title: fields.authorRole,
              type: "string",
              description: descriptions.testimonialRoleDescription,
              validation: (rule) => 
                rule.max(100).warning(validation.testimonialRoleWarning),
            }),
            defineField({
              name: "avatar",
              title: fields.authorAvatar,
              type: "image",
              description: descriptions.testimonialAvatarDescription,
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: fields.alt,
                  type: "string",
                  validation: (rule) => 
                    rule.required().error(validation.testimonialAvatarAltRequired),
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "author",
              media: "avatar",
              content: "content"
            },
            prepare({ title, subtitle, media, content }) {
              return {
                title: title || descriptions.noTestimonialTitle,
                subtitle: subtitle ? `${subtitle} - ${content?.substring(0, 30)}...` : descriptions.noTestimonialAuthor,
                media: media || StarIcon,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error(validation.testimonialsMinRequired),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.testimonialsVariants.find(v => v.value === variant);
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultTestimonialsSection,
        subtitle: `${descriptions.testimonialVariantLabel}${variantTitle || "carousel"}`,
        media: StarIcon,
      };
    },
  },
});
