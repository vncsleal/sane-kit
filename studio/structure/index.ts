import { StructureBuilder } from 'sanity/structure'
import { studioConfig } from '../config'

const isPortuguese = studioConfig.language === 'pt-BR'

const labels = {
  content: isPortuguese ? 'Conteúdo' : 'Content',
  pages: isPortuguese ? 'Páginas' : 'Pages',
  pagesByLanguage: isPortuguese ? 'Páginas por Idioma' : 'Pages by Language',
  portuguese: 'Português (Brasil)',
  english: 'English',
  blog: 'Blog',
  blogContent: isPortuguese ? 'Conteúdo do Blog' : 'Blog Content',
  posts: isPortuguese ? 'Posts' : 'Posts',
  postsByLanguage: isPortuguese ? 'Posts por Idioma' : 'Posts by Language',
  authors: isPortuguese ? 'Autores' : 'Authors',
  authorsByLanguage: isPortuguese ? 'Autores por Idioma' : 'Authors by Language',
  categories: isPortuguese ? 'Categorias' : 'Categories',
  categoriesByLanguage: isPortuguese ? 'Categorias por Idioma' : 'Categories by Language',
  blogSettings: isPortuguese ? 'Configurações do Blog' : 'Blog Settings',
  blogSettingsByLanguage: isPortuguese ? 'Configurações do Blog por Idioma' : 'Blog Settings by Language',
  siteConfiguration: isPortuguese ? 'Configuração do Site' : 'Site Configuration',
  headers: isPortuguese ? 'Cabeçalhos' : 'Headers',
  headersByLanguage: isPortuguese ? 'Cabeçalhos por Idioma' : 'Headers by Language',
  footers: isPortuguese ? 'Rodapés' : 'Footers',
  footersByLanguage: isPortuguese ? 'Rodapés por Idioma' : 'Footers by Language',
  reusableContent: isPortuguese ? 'Conteúdo Reutilizável' : 'Reusable Content',
  compareFeatures: isPortuguese ? 'Comparar Recursos' : 'Compare Features'
}

export const structure = (S: StructureBuilder) =>
  S.list()
    .title(labels.content)
    .items([
      // Pages
      S.listItem()
        .title(labels.pages)
        .child(
          S.list()
            .title(labels.pagesByLanguage)
            .items([
              S.listItem()
                .title(labels.portuguese)
                .child(
                  S.documentList()
                    .title(`${labels.pages} (PT-BR)`)
                    .filter('_type == "page" && language == "pt-BR"')
                ),
              S.listItem()
                .title(labels.english)
                .child(
                  S.documentList()
                    .title(`${labels.pages} (EN)`)
                    .filter('_type == "page" && language == "en"')
                )
            ])
        ),

      S.divider(),

      // Blog
      S.listItem()
        .title(labels.blog)
        .child(
          S.list()
            .title(labels.blogContent)
            .items([
              S.listItem()
                .title(labels.posts)
                .child(
                  S.list()
                    .title(labels.postsByLanguage)
                    .items([
                      S.listItem()
                        .title(labels.portuguese)
                        .child(
                          S.documentList()
                            .title(`${labels.posts} (PT-BR)`)
                            .filter('_type == "blogPost" && language == "pt-BR"')
                        ),
                      S.listItem()
                        .title(labels.english)
                        .child(
                          S.documentList()
                            .title(`${labels.posts} (EN)`)
                            .filter('_type == "blogPost" && language == "en"')
                        )
                    ])
                ),
              S.listItem()
                .title(labels.authors)
                .child(
                  S.list()
                    .title(labels.authorsByLanguage)
                    .items([
                      S.listItem()
                        .title(labels.portuguese)
                        .child(
                          S.documentList()
                            .title(`${labels.authors} (PT-BR)`)
                            .filter('_type == "author" && language == "pt-BR"')
                        ),
                      S.listItem()
                        .title(labels.english)
                        .child(
                          S.documentList()
                            .title(`${labels.authors} (EN)`)
                            .filter('_type == "author" && language == "en"')
                        )
                    ])
                ),
              S.listItem()
                .title(labels.categories)
                .child(
                  S.list()
                    .title(labels.categoriesByLanguage)
                    .items([
                      S.listItem()
                        .title(labels.portuguese)
                        .child(
                          S.documentList()
                            .title(`${labels.categories} (PT-BR)`)
                            .filter('_type == "category" && language == "pt-BR"')
                        ),
                      S.listItem()
                        .title(labels.english)
                        .child(
                          S.documentList()
                            .title(`${labels.categories} (EN)`)
                            .filter('_type == "category" && language == "en"')
                        )
                    ])
                ),
              S.listItem()
                .title(labels.blogSettings)
                .child(
                  S.list()
                    .title(labels.blogSettingsByLanguage)
                    .items([
                      S.listItem()
                        .title(labels.portuguese)
                        .child(
                          S.documentList()
                            .title(`${labels.blogSettings} (PT-BR)`)
                            .filter('_type == "blogPage" && language == "pt-BR"')
                        ),
                      S.listItem()
                        .title(labels.english)
                        .child(
                          S.documentList()
                            .title(`${labels.blogSettings} (EN)`)
                            .filter('_type == "blogPage" && language == "en"')
                        )
                    ])
                )
            ])
        ),

      S.divider(),

      // Site Configuration
      S.listItem()
        .title(labels.siteConfiguration)
        .child(
          S.list()
            .title(labels.siteConfiguration)
            .items([
              S.listItem()
                .title(labels.headers)
                .child(
                  S.list()
                    .title(labels.headersByLanguage)
                    .items([
                      S.listItem()
                        .title(labels.portuguese)
                        .child(
                          S.documentList()
                            .title(`${labels.headers} (PT-BR)`)
                            .filter('_type == "header" && language == "pt-BR"')
                        ),
                      S.listItem()
                        .title(labels.english)
                        .child(
                          S.documentList()
                            .title(`${labels.headers} (EN)`)
                            .filter('_type == "header" && language == "en"')
                        )
                    ])
                ),
              S.listItem()
                .title(labels.footers)
                .child(
                  S.list()
                    .title(labels.footersByLanguage)
                    .items([
                      S.listItem()
                        .title(labels.portuguese)
                        .child(
                          S.documentList()
                            .title(`${labels.footers} (PT-BR)`)
                            .filter('_type == "footer" && language == "pt-BR"')
                        ),
                      S.listItem()
                        .title(labels.english)
                        .child(
                          S.documentList()
                            .title(`${labels.footers} (EN)`)
                            .filter('_type == "footer" && language == "en"')
                        )
                    ])
                )
            ])
        ),

      S.divider(),

      // Reusable Content
      S.listItem()
        .title(labels.reusableContent)
        .child(
          S.documentTypeList('compareFeature')
            .title(labels.compareFeatures)
        )
    ])
