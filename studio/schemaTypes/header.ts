import {
  MenuIcon,
  InfoOutlineIcon,
  ComponentIcon,
  LinkIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember, type ValidationContext, type Reference } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const header = defineType({
  name: "header",
  title: documents.header,
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
      name: "navigation",
      title: "Navegação",
      icon: MenuIcon,
    },
    {
      name: "actions",
      title: groups.actions,
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
      description: descriptions.siteNameDescription,
      validation: (rule) =>
        rule.required().error(validation.siteNameRequired),
      group: "basic",
    }),
    defineField({
      name: "logo",
      title: fields.logo,
      type: "image",
      description: descriptions.logoDescription,
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
                return validation.logoAltRequiredHeader;
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
      description: descriptions.headerVariantDescription,
      options: {
        list: sanityOptions.headerVariants,
        layout: "radio",
      },
      initialValue: "default",
      group: "appearance",
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
                rule.required().error(validation.navigationTitleRequired),
            }),
            defineField({
              name: "href",
              title: fields.href,
              type: "url",
              description: descriptions.navigationItemsDescription,
              validation: (rule) =>
                rule
                  .uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  })
                  .error(validation.navigationUrlInvalid),
            }),
            defineField({
              name: "description",
              title: fields.description,
              type: "text",
              description: descriptions.navigationDescriptionText,
              validation: (rule) =>
                rule.max(150).warning(validation.navigationDescriptionWarning),
            }),
            defineField({
              name: "items",
              title: fields.items,
              type: "array",
              description: descriptions.dropdownItemsDescription,
              of: [
                defineArrayMember({
                  type: "object",
                  name: "subItem",
                  title: descriptions.defaultSubitem,
                  fields: [
                    defineField({
                      name: "title",
                      title: fields.title,
                      type: "string",
                      validation: (rule) =>
                        rule.required().error(validation.subitemTitleRequired),
                    }),
                    defineField({
                      name: "href",
                      title: fields.href,
                      type: "url",
                      validation: (rule) =>
                        rule
                          .required()
                          .error(validation.subitemUrlRequired)
                          .uri({
                            allowRelative: true,
                            scheme: ["http", "https", "mailto", "tel"],
                          })
                          .error(validation.subitemUrlInvalid),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "title",
                      subtitle: "href",
                    },
                    prepare({ title, subtitle }) {
                      return {
                        title: title || descriptions.defaultSubitem,
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
              href: "href",
              itemCount: "items.length",
            },
            prepare({ title, href, itemCount = 0 }) {
              const isDropdown = itemCount > 0;
              let subtitle = "";
              
              if (isDropdown) {
                const plural = itemCount === 1 ? "" : "s";
                subtitle = descriptions.dropdownWithItems
                  .replace("{count}", itemCount.toString())
                  .replace("{plural}", plural);
              } else if (href) {
                subtitle = descriptions.linkTo.replace("{url}", href);
              } else {
                subtitle = descriptions.noLinkDropdownOnly;
              }
              
              return {
                title: title || descriptions.defaultNavigationItem,
                subtitle,
                media: MenuIcon,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "ctaButtons",
      title: fields.ctaButtons,
      type: "array",
      description: descriptions.ctaButtonsDescription,
      group: "actions",
      of: [
        defineArrayMember({
          type: "object",
          name: "button",
          title: descriptions.defaultCtaButton,
          fields: [
            defineField({
              name: "label",
              title: fields.label,
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.ctaButtonLabelRequired)
                  .max(30)
                  .warning(validation.ctaButtonLabelWarning),
            }),
            defineField({
              name: "url",
              title: fields.url,
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.ctaButtonUrlRequired)
                  .uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  })
                  .error(validation.ctaButtonUrlInvalid),
            }),
            defineField({
              name: "variant",
              title: fields.buttonVariant,
              type: "string",
              options: {
                list: sanityOptions.headerButtonVariants,
              },
              initialValue: "default",
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "url",
              variant: "variant",
            },
            prepare({ title, subtitle, variant }) {
              const selectedVariant = sanityOptions.headerButtonVariants.find(v => v.value === variant);
              const variantTitle = selectedVariant ? selectedVariant.title : variant;
              return {
                title: title || descriptions.defaultCtaButton,
                subtitle: `${variantTitle || descriptions.defaultLayout} | ${subtitle || descriptions.urlNotDefinedHeader}`,
                media: LinkIcon,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "dropdownCTALabel",
      title: fields.dropdownCTALabel,
      type: "string",
      description: descriptions.dropdownCtaLabelDescription,
      initialValue: descriptions.defaultScheduleCall,
      group: "actions",
      validation: (rule) =>
        rule.max(40).warning(validation.dropdownCtaLabelWarning),
    }),
    defineField({
      name: "dropdownCTAUrl",
      title: fields.dropdownCTAUrl,
      type: "url",
      description: descriptions.dropdownCtaUrlDescription,
      initialValue: descriptions.defaultContactPath,
      group: "actions",
      validation: (rule) =>
        rule
          .uri({
            allowRelative: true,
            scheme: ["http", "https", "mailto", "tel"],
          })
          .error(validation.dropdownCtaUrlInvalid),
    }),
  ],
  preview: {
    select: {
      title: "title",
      variant: "variant",
    },
    prepare({ title, variant }) {
      const selectedVariant = sanityOptions.headerVariants.find(v => v.value === variant);
      const variantTitle = selectedVariant ? selectedVariant.title : variant;
      return {
        title: title || descriptions.defaultHeader,
        subtitle: variantTitle || descriptions.defaultLayout,
        media: MenuIcon,
      };
    },
  },
});
