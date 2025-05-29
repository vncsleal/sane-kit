import { CodeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  fields,
  documents,
  descriptions,
  validation,
  sanityOptions,
} from "../dictionary";

export const codeBlock = defineType({
  name: "codeBlock",
  title: documents.codeBlock,
  type: "object",
  icon: CodeIcon,
  fields: [
    defineField({
      name: "title",
      title: fields.title,
      type: "string",
      description: descriptions.codeBlockTitleDescription,
      validation: (rule) =>
        rule.max(80).warning(validation.codeBlockTitleWarning),
    }),
    defineField({
      name: "code",
      title: fields.code,
      type: "code",
      options: {
        language: "typescript",
        languageAlternatives: sanityOptions.codeLanguages,
        withFilename: true,
      },
      validation: (rule) =>
        rule.required().error(validation.codeRequired),
    }),
    defineField({
      name: "highlightLines",
      title: fields.highlightLines,
      type: "string",
      description: descriptions.highlightLinesDescription,
    }),
    defineField({
      name: "showLineNumbers",
      title: fields.showLineNumbers,
      type: "string",
      options: {
        list: sanityOptions.yesNo,
        layout: "radio",
      },
      initialValue: "true",
    }),
    defineField({
      name: "caption",
      title: fields.caption,
      type: "string",
      description: descriptions.captionDescription,
      validation: (rule) =>
        rule.max(150).warning(validation.captionWarning),
    }),
  ],
  preview: {
    select: {
      title: "title",
      code: "code",
    },
    prepare({ title, code }) {
      const language = code?.language || "text";
      const shortCode = code?.code
        ? code.code.length > 50
          ? `${code.code.slice(0, 50)}...`
          : code.code
        : "";
      return {
        title: title || descriptions.defaultCodeBlock,
        subtitle: `${language}: ${shortCode}`,
        media: CodeIcon,
      };
    },
  },
});
