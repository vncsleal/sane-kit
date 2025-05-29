import { DocumentTextIcon } from "@sanity/icons";
import { defineType, defineArrayMember, defineField } from "sanity";
import { fields, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const portableText = defineType({
  name: "portableText",
  title: documents.portableText,
  type: "array",
  icon: DocumentTextIcon,
  of: [
    defineArrayMember({
      type: "block",
      title: descriptions.defaultBlock,
      styles: sanityOptions.blockStyles,
      lists: sanityOptions.listStyles,
      marks: {
        decorators: sanityOptions.textDecorators,
        annotations: [
          {
            name: "link",
            type: "object",
            title: descriptions.defaultLink,
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: fields.href,
                validation: (rule) => 
                  rule.required().error(validation.linkUrlRequired)
                  .uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"]
                  }).error(validation.linkUrlInvalid),
              }),
              defineField({
                name: "blank",
                title: fields.blank,
                type: "string",
                options: {
                  list: sanityOptions.yesNo,
                  layout: "radio",
                },
                initialValue: "true",
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "codeBlock",
      title: descriptions.defaultCodeBlock,
    }),
    defineArrayMember({
      type: "image",
      title: descriptions.defaultImage,
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: fields.alt,
          validation: (rule) => 
            rule.required().error(validation.imageAltRequired),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: fields.caption,
        }),
      ],
    }),
  ],
});
