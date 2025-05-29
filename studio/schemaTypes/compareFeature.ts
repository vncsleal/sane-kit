import { ComposeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { fields, documents, descriptions, validation } from "../dictionary";

export const compareFeature = defineType({
  name: "compareFeature",
  title: documents.compareFeature,
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
			name: 'language',
			type: 'string',
			hidden: true,
			readOnly: true,
		}),
    defineField({
      name: "title",
      title: fields.featureTitle,
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .error(validation.featureTitleRequired)
          .max(80)
          .warning(validation.featureTitleWarning),
    }),
    defineField({
      name: "description",
      title: fields.description,
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule.max(200).warning(validation.featureDescriptionWarning),
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title: title || descriptions.defaultCompareFeature,
        subtitle:
          description && description.length > 0
            ? `${description.substring(0, 80)}${
                description.length > 80 ? "..." : ""
              }`
            : descriptions.noDescription,
        media: ComposeIcon,
      };
    },
  },
});
