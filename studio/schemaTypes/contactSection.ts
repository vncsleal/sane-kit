import {
  UserIcon,
  InfoOutlineIcon,
  ComponentIcon,
  CogIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const contactSection = defineType({
  name: "contactSection",
  title: documents.contactSection,
  type: "object",
  icon: UserIcon,
  groups: [
    {
      name: "content",
      title: groups.content,
      icon: InfoOutlineIcon,
      default: true,
    },
    {
      name: "features",
      title: groups.features,
      icon: ComponentIcon,
    },
    {
      name: "form",
      title: groups.form,
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      initialValue: descriptions.defaultContact,
      validation: (rule) =>
        rule
          .required()
          .error(validation.badgeTextRequired)
          .max(30)
          .warning(validation.badgeTextWarning),
      group: "content",
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .error(validation.contactTitleRequired)
          .max(100)
          .warning(validation.contactTitleWarning),
      group: "content",
    }),
    defineField({
      name: "description",
      title: fields.description,
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) =>
        rule.max(300).warning(validation.contactDescriptionWarning),
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
          title: fields.feature,
          fields: [
            defineField({
              name: "title",
              title: fields.title,
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.featureTitleRequiredContact)
                  .max(80)
                  .warning(validation.featureTitleWarningContact),
            }),
            defineField({
              name: "description",
              title: fields.description,
              type: "text",
              rows: 2,
              validation: (rule) =>
                rule.max(150).warning(validation.featureDescriptionWarningContact),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.featuresMinRequiredContact),
    }),
    defineField({
      name: "formTitle",
      title: fields.formTitle,
      type: "string",
      initialValue: descriptions.defaultScheduleMeeting,
      group: "form",
      validation: (rule) =>
        rule.max(80).warning(validation.formTitleWarning),
    }),
    defineField({
      name: "formFields",
      title: fields.formFields,
      type: "object",
      group: "form",
      fields: [
        defineField({
          name: "showDate",
          title: fields.showDate,
          type: "string",
          options: {
            list: sanityOptions.yesNo,
            layout: "radio",
          },
          initialValue: "true",
        }),
        defineField({
          name: "showFirstName",
          title: fields.showFirstName,
          type: "string",
          options: {
            list: sanityOptions.yesNo,
            layout: "radio",
          },
          initialValue: "true",
        }),
        defineField({
          name: "showLastName",
          title: fields.showLastName,
          type: "string",
          options: {
            list: sanityOptions.yesNo,
            layout: "radio",
          },
          initialValue: "true",
        }),
        defineField({
          name: "showFileUpload",
          title: fields.showFileUpload,
          type: "string",
          options: {
            list: sanityOptions.yesNo,
            layout: "radio",
          },
          initialValue: "true",
        }),
        defineField({
          name: "fileUploadLabel",
          title: fields.fileUploadLabel,
          type: "string",
          initialValue: descriptions.defaultUploadResume,
          hidden: ({ parent }) => parent?.showFileUpload === "false",
          validation: (rule) =>
            rule.max(50).warning(validation.fileUploadLabelWarning),
        }),
      ],
    }),
    defineField({
      name: "buttonText",
      title: fields.buttonText,
      type: "string",
      initialValue: descriptions.defaultScheduleButton,
      validation: (rule) =>
        rule
          .required()
          .error(validation.formButtonTextRequired)
          .max(50)
          .warning(validation.planButtonTextWarning),
      group: "form",
    }),
    defineField({
      name: "buttonIcon",
      title: fields.buttonIcon,
      type: "string",
      options: {
        list: sanityOptions.contactButtonIconOptions,
        layout: "radio",
      },
      initialValue: "arrowRight",
      group: "form",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "badgeText",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || descriptions.defaultContactSection,
        subtitle: subtitle ? `${descriptions.badgeContact}${subtitle}` : descriptions.defaultContactSection,
        media: UserIcon,
      };
    },
  },
});
