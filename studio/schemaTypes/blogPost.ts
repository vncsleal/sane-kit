import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {ImageIcon} from '@sanity/icons/Image'
import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType, defineArrayMember} from 'sanity'
import {isUniqueOtherThanLanguage} from '../utils/isUniqueOtherThanLanguage'
import {fields, groups, documents, descriptions, validation} from '../dictionary'

// Define field groups
const blogPostGroups = [
  {
    name: 'basic',
    title: groups.basic,
    icon: InfoOutlineIcon,
    default: true,
  },
  {
    name: 'content',
    title: groups.content,
    icon: DocumentTextIcon,
  },
  {
    name: 'metadata',
    title: groups.metadata,
    icon: TagIcon,
  },
  {
    name: 'media',
    title: groups.media,
    icon: ImageIcon,
  },
]

export const blogPost = defineType({
  name: 'blogPost',
  title: documents.blogPost,
  type: 'document',
  icon: DocumentTextIcon,
  groups: blogPostGroups,
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'title',
      title: fields.title,
      type: 'string',
      validation: (rule) => rule.required().error(validation.postTitleRequired),
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: fields.slug,
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: isUniqueOtherThanLanguage,
      },
      validation: (rule) => rule.required().error(validation.postSlugRequired),
      group: 'basic',
    }),
    defineField({
      name: 'publishedAt',
      title: fields.publishedAt,
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'basic',
    }),
    defineField({
      name: 'excerpt',
      title: fields.excerpt,
      type: 'text',
      description: descriptions.excerpt,
      validation: (rule) => [
        rule.max(300).error(validation.excerptMaxLength),
        rule.min(50).warning(validation.excerptMinLength),
      ],
      group: 'basic',
    }),
    defineField({
      name: 'author',
      title: fields.postAuthor,
      type: 'reference',
      to: [{type: 'author'}],
      validation: (rule) => rule.required().error(validation.authorRequired),
      group: 'metadata',
    }),
    defineField({
      name: 'mainImage',
      title: fields.mainImage,
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: fields.alt,
          type: 'string',
          validation: (rule) => rule.required().error(validation.altRequiredForImage),
        }),
        defineField({
          name: 'caption',
          title: fields.caption,
          type: 'string',
        }),
      ],
      group: 'media',
    }),
    defineField({
      name: 'categories',
      title: fields.categories,
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
      group: 'metadata',
    }),
    defineField({
      name: 'body',
      title: fields.body,
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'featured',
      title: fields.featured,
      type: 'boolean',
      description: descriptions.featuredPost,
      initialValue: false,
      group: 'metadata',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'metadata',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authorName: 'author.name',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare(selection) {
      const {title, authorName, media, date} = selection
      const formattedDate = date
        ? new Date(date).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : descriptions.notPublished

      return {
        title,
        subtitle: `Por ${authorName || descriptions.unknownAuthor} · ${formattedDate}`,
        media: media || DocumentTextIcon,
      }
    },
  },
})
