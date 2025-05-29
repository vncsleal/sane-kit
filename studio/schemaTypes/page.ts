import {
  DocumentIcon,
  InfoOutlineIcon,
  EarthGlobeIcon,
  StackCompactIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueOtherThanLanguage } from "../utils/isUniqueOtherThanLanguage";
import { fields, groups, documents, descriptions, validation } from "../dictionary";

export const page = defineType({
  name: "page",
  title: documents.page,
  type: "document",
  icon: DocumentIcon,
  groups: [
    {
      name: "basic",
      title: groups.basic,
      icon: InfoOutlineIcon,
      default: true,
    },
    {
      name: "seo",
      title: groups.seo,
      icon: EarthGlobeIcon,
    },
    {
      name: "content",
      title: groups.content,
      icon: StackCompactIcon,
    },
  ],
  fields: [
    defineField({
      name: "language",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: fields.title,
      type: "string",
      validation: (rule) => 
        rule.required().error(validation.pageTitleRequired)
        .max(70).warning(validation.pageTitleWarning),
      group: "basic",
    }),
    defineField({
      name: "slug",
      title: fields.slug,
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage,
      },
      validation: (rule) => 
        rule.required().error(validation.pageSlugRequired),
      group: "basic",
    }),
    defineField({
      name: "description",
      title: fields.metaDescription,
      type: "text",
      description: descriptions.metaDescription,
      group: "seo",
      validation: (rule) => 
        rule.max(160).warning(validation.metaDescriptionWarning),
    }),
    defineField({
      name: "ogImage",
      title: fields.ogImage,
      type: "image",
      description: descriptions.ogImage,
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          title: fields.alt,
          type: "string",
          validation: (rule) => 
            rule.required().error(validation.altRequired),
        },
      ],
      group: "seo",
    }),
    defineField({
      name: "pageBuilder",
      title: fields.pageBuilder,
      type: "array",
      description: descriptions.pageBuilder,
      group: "content",
      of: [
        { type: "heroSection" },
        { type: "casesSection" },
        { type: "testimonialsSection" },
        { type: "pricingSection" },
        { type: "compareFeaturesSection" },
        { type: "statsSection" },
        { type: "ctaSection" },
        { type: "faqSection" },
        { type: "featureSection" },
        { type: "blogSection" },
        { type: "contactSection" },
        { type: "newsletterSection" },
      ],
      validation: (rule) => 
        rule.min(1).error(validation.pageBuilderRequired),
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      description: "description",
    },
    prepare({ title, slug, description }) {
      return {
        title: title || descriptions.untitledPage,
        subtitle: `/${slug || ""} - ${description || descriptions.noDescription}`,
        media: DocumentIcon,
      };
    },
  },
});
