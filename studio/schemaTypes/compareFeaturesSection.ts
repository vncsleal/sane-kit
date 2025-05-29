import {
  CheckmarkCircleIcon,
  CloseCircleIcon,
  InfoOutlineIcon,
  TagIcon,
  ComposeIcon,
} from "@sanity/icons";
import { defineField, defineType, defineArrayMember, type ValidationContext } from "sanity";
import { fields, groups, documents, descriptions, validation, sanityOptions } from "../dictionary";

export const compareFeaturesSection = defineType({
  name: "compareFeaturesSection",
  title: documents.compareFeaturesSection,
  type: "object",
  icon: ComposeIcon,
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
      icon: CheckmarkCircleIcon,
    },
    {
      name: "plans",
      title: fields.plans,
      icon: TagIcon,
    },
  ],
  fields: [
    defineField({
      name: "badgeText",
      title: fields.badgeText,
      type: "string",
      initialValue: descriptions.defaultPricing,
      group: "content",
      validation: (rule) =>
        rule.max(30).warning(validation.badgeTextWarning),
    }),
    defineField({
      name: "heading",
      title: fields.heading,
      type: "string",
      validation: (rule) =>
        rule.required().error(validation.comparisonTitleRequired),
      group: "content",
    }),
    defineField({
      name: "subheading",
      title: fields.subheading,
      type: "text",
      rows: 2,
      group: "content",
      validation: (rule) =>
        rule.max(200).warning(validation.comparisonSubheadingWarning),
    }),
    defineField({
      name: "features",
      title: fields.features,
      type: "array",
      description: descriptions.featuresSelectDescription,
      group: "features",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "compareFeature" }],
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.featuresMinRequired),
    }),
    defineField({
      name: "plans",
      title: fields.plans,
      type: "array",
      group: "plans",
      of: [
        defineArrayMember({
          type: "object",
          name: "plan",
          title: descriptions.defaultPlan,
          fields: [
            defineField({
              name: "title",
              title: fields.planTitle,
              type: "string",
              validation: (rule) =>
                rule.required().error(validation.planTitleRequired),
            }),
            defineField({
              name: "description",
              title: fields.planDescription,
              type: "text",
              rows: 3,
              validation: (rule) =>
                rule.max(250).warning(validation.planDescriptionWarning),
            }),
            defineField({
              name: "price",
              title: fields.price,
              type: "string",
              description: descriptions.priceExample,
              validation: (rule) =>
                rule.required().error(validation.planPriceRequired),
            }),
            defineField({
              name: "billingPeriod",
              title: fields.billingPeriod,
              type: "string",
              description: descriptions.billingPeriodExample,
              validation: (rule) =>
                rule.max(20).warning(validation.billingPeriodWarning),
            }),
            defineField({
              name: "highlighted",
              title: fields.highlighted,
              type: "string",
              description: descriptions.highlightPlanDescription,
              options: {
                list: sanityOptions.yesNo,
                layout: "radio",
              },
              initialValue: "false",
            }),
            defineField({
              name: "featureValues",
              title: fields.featureValues,
              type: "array",
              description: descriptions.featureValuesDescription,
              of: [
                defineArrayMember({
                  type: "object",
                  name: "featureValue",
                  title: fields.feature,
                  fields: [
                    defineField({
                      name: "featureRef",
                      title: fields.feature,
                      type: "reference",
                      to: [{ type: "compareFeature" }],
                      validation: (rule) =>
                        rule.required().error(validation.featureRefRequired),
                      options: {
                        filter: ({ document, parent }) => {
                          if (!document || !Array.isArray(parent)) {
                            return { filter: "" };
                          }

                          const existingRefs = parent
                            .filter(item => {
                              return item && typeof item === 'object' && 
                                     'featureRef' in item && 
                                     item.featureRef && 
                                     typeof item.featureRef === 'object' && 
                                     '_ref' in item.featureRef;
                            })
                            .map(item => {
                              const typedItem = item as { featureRef: { _ref: string } };
                              return typedItem.featureRef._ref;
                            });

                          return {
                            filter: existingRefs.length > 0 ? "!(_id in $existingRefs)" : "",
                            params: { existingRefs },
                          };
                        },
                      },
                    }),
                    defineField({
                      name: "value",
                      title: fields.valueStatus,
                      type: "string",
                      description: descriptions.featureValueDescription,
                      options: {
                        list: sanityOptions.featureValueOptions,
                        layout: "radio",
                      },
                      initialValue: "true",
                      validation: (rule) =>
                        rule.required().error(validation.featureValueRequired),
                    }),
                    defineField({
                      name: "customText",
                      title: fields.customText,
                      type: "string",
                      description: descriptions.customTextDescription,
                      hidden: ({ parent }) => parent?.value !== "custom",
                      validation: (rule) =>
                        rule.max(100).warning(validation.customTextWarning),
                    }),
                  ],
                  preview: {
                    select: {
                      featureTitle: "featureRef.title",
                      value: "value",
                      customText: "customText",
                    },
                    prepare({ featureTitle, value, customText }) {
                      let subtitle = "";
                      let media = InfoOutlineIcon;

                      const selectedOption = sanityOptions.featureValueOptions.find(opt => opt.value === value);

                      if (selectedOption) {
                        subtitle = selectedOption.title;
                        if (value === "true") media = CheckmarkCircleIcon;
                        else if (value === "false") media = CloseCircleIcon;
                        else if (value === "custom") subtitle = customText || selectedOption.title;
                      } else {
                        subtitle = customText || descriptions.valueNotSpecified;
                      }

                      return {
                        title: featureTitle || descriptions.defaultCompareFeature,
                        subtitle: subtitle,
                        media: media,
                      };
                    },
                  },
                }),
              ],
              validation: (rule) =>
                rule
                  .required()
                  .min(1)
                  .error(validation.featureValuesMinRequired)
                  .unique()
                  .custom((featureValues, context: ValidationContext) => {
                    const pageBuilder = context.document?.pageBuilder as unknown;
                    const currentPath = context.path;

                    if (!Array.isArray(pageBuilder) || !currentPath || currentPath.length < 2) {
                      return true;
                    }

                    const parentPathSegment = currentPath[1];
                    const parentSectionKey =
                      typeof parentPathSegment === "object" &&
                      parentPathSegment !== null &&
                      "_key" in parentPathSegment
                        ? parentPathSegment._key
                        : undefined;

                    if (!parentSectionKey) {
                      return true;
                    }

                    const parentSection = pageBuilder.find(
                      (section: unknown): section is {
                        _key?: string;
                        _type?: string;
                        features?: { _ref: string }[];
                      } =>
                        typeof section === "object" &&
                        section !== null &&
                        "_key" in section &&
                        section._key === parentSectionKey,
                    );

                    const allFeaturesRefs = parentSection?.features?.map((f) => f._ref) || [];

                    if (allFeaturesRefs.length === 0) return true;

                    const definedFeatureRefs = (
                      featureValues as { featureRef?: { _ref: string } }[] | undefined
                    )?.map((fv) => fv.featureRef?._ref);

                    const missingRefs = allFeaturesRefs.filter(
                      (ref) => !definedFeatureRefs?.includes(ref),
                    );

                    if (missingRefs.length > 0) {
                      return `${validation.featureValuesMissing} Refs de características ausentes: ${missingRefs.join(", ")}`;
                    }

                    const refs = definedFeatureRefs?.filter(Boolean) as string[];
                    if (new Set(refs).size !== refs.length) {
                      return validation.featureValuesDuplicate;
                    }

                    return true;
                  }),
            }),
            defineField({
              name: "buttonText",
              title: fields.buttonText,
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.planButtonTextRequired)
                  .max(40)
                  .warning(validation.planButtonTextWarning),
            }),
            defineField({
              name: "buttonUrl",
              title: fields.buttonUrl,
              type: "url",
              validation: (rule) =>
                rule
                  .required()
                  .error(validation.planButtonUrlRequired)
                  .uri({ allowRelative: true, scheme: ['http', 'https'] })
                  .error(validation.planButtonUrlInvalid),
            }),
            defineField({
              name: "buttonIcon",
              title: fields.buttonIcon,
              type: "string",
              options: {
                list: sanityOptions.buttonIconOptions,
                layout: "radio",
              },
              initialValue: "arrowRight",
            }),
            defineField({
              name: "buttonVariant",
              title: fields.buttonVariant,
              type: "string",
              options: {
                list: sanityOptions.buttonVariantOptions,
              },
              initialValue: "default",
            }),
          ],
          preview: {
            select: {
              title: "title",
              price: "price",
              highlighted: "highlighted",
            },
            prepare({ title, price, highlighted }) {
              return {
                title: `${highlighted === "true" ? "🌟 " : ""}${title || descriptions.defaultPlan}`,
                subtitle: price ? `${price}` : descriptions.noPrice,
              };
            },
          },
        }),
      ],
      validation: (rule) =>
        rule.min(1).error(validation.plansMinRequired),
    }),
    defineField({
      name: "footnote",
      title: fields.footnote,
      type: "text",
      rows: 2,
      description: descriptions.footnoteDescription,
      group: "content",
      validation: (rule) =>
        rule.max(300).warning(validation.footnoteWarning),
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title || descriptions.defaultCompareFeaturesSection,
        media: ComposeIcon,
      };
    },
  },
});
