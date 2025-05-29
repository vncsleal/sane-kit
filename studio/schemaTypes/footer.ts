import {
  MenuIcon,
  InfoOutlineIcon,
  ComponentIcon,
  LinkIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember, type Reference, type ValidationContext } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const footer = defineType({
  name: "footer",
  title: documents.footer,
  type: "document",
  icon: MenuIcon,
  groups: [
    {
      name: "basic",
      title: groups.basic,
      icon: InfoOutlineIcon,
      default: true,
    },
    {
      name: "appearance",
      title: groups.appearance,
      icon: ComponentIcon,
    },
    {
      name: "content",
      title: groups.content,
      icon: MenuIcon,
    },
    {
      name: "navigation",
      title: "Navegação",
      icon: LinkIcon,
    },
  ],
  fields: [
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "title",
      title: fields.siteName,
      type: "string",
      description: descriptions.footerSiteNameDescription,
      validation: (rule) =>
        rule.required().error(validation.footerSiteNameRequired),
      group: "basic",
    }),
    defineField({
      name: "logo",
      title: fields.logo,
      type: "image",
      description: descriptions.footerLogoDescription,
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: fields.alt,
          type: "string",
          description: descriptions.logoAltDescription,
          validation: (rule) =>
            rule.custom((value, context: ValidationContext) => {
              const parent = context.parent as { asset?: Reference };
              if (parent?.asset && !value) {
                return validation.logoAltRequiredFooter;
              }
              return true;
            }),
        }),
      ],
      group: "basic",
    }),
    defineField({
      name: "variant",
      title: fields.variant,
      type: "string",
      options: {
        list: sanityOptions.footerVariants,
        layout: "radio", 
      },
      initialValue: "simple",
      group: "appearance",
    }),
    defineField({
      name: "description",
      title: fields.footerDescription,
      type: "text",
      description: descriptions.footerDescriptionDescription,
      rows: 2,
      group: "content",
      validation: (rule) =>
        rule.max(200).warning(validation.footerDescriptionWarning),
    }),
    defineField({
      name: "address",
      title: fields.address,
      type: "array",
      of: [{ type: "string" }],
      description: descriptions.addressDescription,
      group: "content",
    }),
    defineField({
      name: "legalLinks",
      title: fields.legalLinks,
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "object",
          name: "link",
          title: descriptions.defaultLegalLink,
          fields: [
            defineField({
              name: "title",
              title: fields.title,
              type: "string",
              validation: (rule) =>
                rule.required().error(validation.legalLinkTitleRequired),
            }),
            defineField({
              name: "url",
              title: fields.url,
              type: "url", 
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.legalLinkUrlRequired)
                  .uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  })
                  .error(validation.legalLinkUrlInvalid),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "url",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || descriptions.defaultLegalLink,
                subtitle: subtitle || descriptions.urlNotDefinedHeader,
                media: LinkIcon,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "navigationItems",
      title: fields.navigationItems,
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "object",
          name: "navigationItem",
          title: descriptions.defaultNavigationItem,
          fields: [
            defineField({
              name: "title",
              title: fields.title,
              type: "string",
              validation: (rule) =>
                rule.required().error(validation.footerNavigationTitleRequired),
            }),
            defineField({
              name: "href",
              title: fields.href,
              type: "url", 
              description: descriptions.footerNavigationDescription,
              validation: (rule) =>
                rule
                  .uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  })
                  .error(validation.footerNavigationUrlInvalid),
            }),
            defineField({
              name: "description",
              title: fields.description,
              type: "text",
              description: descriptions.footerCategoryDescription,
              validation: (rule) =>
                rule.max(150).warning(validation.footerCategoryDescriptionWarning),
            }),
            defineField({
              name: "items",
              title: fields.subItems,
              type: "array",
              description: descriptions.sublinkDescription,
              of: [
                defineArrayMember({
                  type: "object",
                  name: "subItem",
                  title: descriptions.defaultSublink,
                  fields: [
                    defineField({
                      name: "title",
                      title: fields.title,
                      type: "string",
                      validation: (rule) =>
                        rule.required().error(validation.sublinkTitleRequired),
                    }),
                    defineField({
                      name: "href",
                      title: fields.href,
                      type: "url", 
                      validation: (rule) =>
                        rule
                          .required()
                          .error(validation.sublinkUrlRequired)
                          .uri({
                            allowRelative: true,
                            scheme: ["http", "https", "mailto", "tel"],
                          })
                          .error(validation.sublinkUrlInvalid),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "title",
                      subtitle: "href",
                    },
                    prepare({ title, subtitle }) {
                      return {
                        title: title || descriptions.defaultSublink,
                        subtitle: subtitle || descriptions.linkNotDefined,
                        media: LinkIcon,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "href",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || descriptions.defaultNavigationItem,
                subtitle: subtitle || descriptions.noDirectLink,
                media: MenuIcon,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.footerVariants.find((v) => v.value === variant);
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultFooter,
        subtitle: `Variante: ${variantTitle || descriptions.defaultVariant}`,
        media: MenuIcon,
      };
    },
  },
});
