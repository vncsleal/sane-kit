import { studioConfig } from '../config'

const isPortuguese = studioConfig.language === 'pt-BR'

export const sanityOptions = {
  // Social media platforms
  socialPlatforms: [
    { 
      title: isPortuguese ? 'Twitter' : 'Twitter', 
      value: 'twitter' 
    },
    { 
      title: isPortuguese ? 'LinkedIn' : 'LinkedIn', 
      value: 'linkedin' 
    },
    { 
      title: isPortuguese ? 'GitHub' : 'GitHub', 
      value: 'github' 
    },
    { 
      title: isPortuguese ? 'Instagram' : 'Instagram', 
      value: 'instagram' 
    },
    { 
      title: isPortuguese ? 'Site Pessoal' : 'Personal Website', 
      value: 'website' 
    },
    { 
      title: isPortuguese ? 'YouTube' : 'YouTube', 
      value: 'youtube' 
    },
  ],
  // BlogPage layout options
  blogLayouts: [
    { 
      title: isPortuguese ? 'Grade Padrão' : 'Default Grid', 
      value: 'grid' 
    },
    { 
      title: isPortuguese ? 'Posts em Destaque' : 'Featured Posts', 
      value: 'featured' 
    },
    { 
      title: isPortuguese ? 'Lista Compacta' : 'Compact List', 
      value: 'compact' 
    },
  ],
  // Yes/No options
  yesNo: [
    { 
      title: isPortuguese ? 'Sim' : 'Yes', 
      value: 'true' 
    },
    { 
      title: isPortuguese ? 'Não' : 'No', 
      value: 'false' 
    },
  ],
  // BlogSection variant options
  blogSectionVariants: [
    { 
      title: isPortuguese ? 'Padrão com Post em Destaque' : 'Default with Featured Post', 
      value: 'default' 
    },
    { 
      title: isPortuguese ? 'Layout em Grade (4 colunas)' : 'Grid Layout (4 columns)', 
      value: 'grid' 
    },
  ],
  // CasesSection variant options
  casesSectionVariants: [
    { 
      title: isPortuguese ? 'Carrossel de Logos' : 'Logo Carousel', 
      value: 'logoCarousel' 
    },
    { 
      title: isPortuguese ? 'Slider Compacto' : 'Compact Slider', 
      value: 'compactSlider' 
    },
  ],
  // CompareFeaturesSection options
  featureValueOptions: [
    { 
      title: isPortuguese ? '✓ Incluído' : '✓ Included', 
      value: 'true' 
    },
    { 
      title: isPortuguese ? '✗ Não incluído' : '✗ Not included', 
      value: 'false' 
    },
    { 
      title: isPortuguese ? 'Texto Personalizado' : 'Custom Text', 
      value: 'custom' 
    },
  ],
  buttonIconOptions: [
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Telefone' : 'Phone', 
      value: 'phone' 
    },
    { 
      title: isPortuguese ? 'Mais' : 'Plus', 
      value: 'plus' 
    },
  ],
  buttonVariantOptions: [
    { 
      title: isPortuguese ? 'Padrão' : 'Default', 
      value: 'default' 
    },
    { 
      title: isPortuguese ? 'Secundário' : 'Secondary', 
      value: 'secondary' 
    },
    { 
      title: isPortuguese ? 'Contorno' : 'Outline', 
      value: 'outline' 
    },
    { 
      title: isPortuguese ? 'Fantasma' : 'Ghost', 
      value: 'ghost' 
    },
    { 
      title: isPortuguese ? 'Link' : 'Link', 
      value: 'link' 
    },
  ],
  // ContactSection options
  contactButtonIconOptions: [
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Telefone' : 'Phone', 
      value: 'phone' 
    },
    { 
      title: isPortuguese ? 'Nenhum' : 'None', 
      value: 'none' 
    },
  ],
  // CtaSection options
  ctaSectionVariants: [
    { 
      title: isPortuguese ? 'Padrão' : 'Default', 
      value: 'default' 
    },
    { 
      title: isPortuguese ? 'Destaque' : 'Highlight', 
      value: 'highlight' 
    },
    { 
      title: isPortuguese ? 'Mínima' : 'Minimal', 
      value: 'minimal' 
    },
    { 
      title: isPortuguese ? 'Completa' : 'Full', 
      value: 'full' 
    },
  ],
  ctaButtonIconOptions: [
    { 
      title: isPortuguese ? 'Nenhum' : 'None', 
      value: 'none' 
    },
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Telefone' : 'Phone', 
      value: 'phone' 
    },
    { 
      title: isPortuguese ? 'Mais' : 'Plus', 
      value: 'plus' 
    },
  ],
  // FaqSection options
  faqLayoutVariants: [
    { 
      title: isPortuguese ? 'Lado a Lado' : 'Side by Side', 
      value: 'sideBySide' 
    },
    { 
      title: isPortuguese ? 'Centralizado' : 'Centered', 
      value: 'centered' 
    },
  ],
  faqButtonIconOptions: [
    { 
      title: isPortuguese ? 'Nenhum' : 'None', 
      value: 'none' 
    },
    { 
      title: isPortuguese ? 'Telefone' : 'Phone', 
      value: 'phone' 
    },
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Mais' : 'Plus', 
      value: 'plus' 
    },
    { 
      title: isPortuguese ? 'Verificar' : 'Check', 
      value: 'check' 
    },
  ],
  // FeatureSection options
  featureLayoutVariants: [
    { 
      title: isPortuguese ? 'Padrão' : 'Default', 
      value: 'default' 
    },
    { 
      title: isPortuguese ? 'Com Imagem' : 'With Image', 
      value: 'withImage' 
    },
    { 
      title: isPortuguese ? 'Imagem à Esquerda' : 'Left Image', 
      value: 'leftImage' 
    },
    { 
      title: isPortuguese ? 'Imagem à Direita' : 'Right Image', 
      value: 'rightImage' 
    },
    { 
      title: isPortuguese ? 'Cartões com Imagem' : 'Image Cards', 
      value: 'imageCards' 
    },
    { 
      title: isPortuguese ? 'Grade Masonry' : 'Masonry Grid', 
      value: 'masonryGrid' 
    },
    { 
      title: isPortuguese ? 'Grade Masonry Grande' : 'Big Masonry Grid', 
      value: 'bigMasonryGrid' 
    },
    { 
      title: isPortuguese ? 'Recurso em Carrossel' : 'Carousel Feature', 
      value: 'carouselFeature' 
    },
    { 
      title: isPortuguese ? 'Comparação Deslizante' : 'Sliding Comparison', 
      value: 'slidingComparison' 
    },
  ],
  featureIconOptions: [
    { 
      title: isPortuguese ? 'Usuário' : 'User', 
      value: 'user' 
    },
    { 
      title: isPortuguese ? 'Configurações' : 'Settings', 
      value: 'settings' 
    },
    { 
      title: isPortuguese ? 'Cadeado' : 'Lock', 
      value: 'lock' 
    },
    { 
      title: isPortuguese ? 'Estrela' : 'Star', 
      value: 'star' 
    },
    { 
      title: isPortuguese ? 'Coração' : 'Heart', 
      value: 'heart' 
    },
    { 
      title: isPortuguese ? 'Gráfico' : 'Bar Chart', 
      value: 'barChart' 
    },
    { 
      title: isPortuguese ? 'Dólar' : 'Dollar', 
      value: 'dollar' 
    },
    { 
      title: isPortuguese ? 'Calendário' : 'Calendar', 
      value: 'calendar' 
    },
    { 
      title: isPortuguese ? 'Relógio' : 'Clock', 
      value: 'clock' 
    },
    { 
      title: isPortuguese ? 'Email' : 'Mail', 
      value: 'mail' 
    },
  ],
  // HeroSection options
  heroVariants: [
    { 
      title: isPortuguese ? 'Banner com Botão' : 'Button Banner', 
      value: 'buttonBanner' 
    },
    { 
      title: isPortuguese ? 'Banner com Emblema' : 'Badge Banner', 
      value: 'badgeBanner' 
    },
    { 
      title: isPortuguese ? 'Galeria em Grade' : 'Grid Gallery', 
      value: 'gridGallery' 
    },
  ],
  heroButtonIconOptions: [
    { 
      title: isPortuguese ? 'Telefone' : 'Phone', 
      value: 'phone' 
    },
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Mais' : 'Plus', 
      value: 'plus' 
    },
    { 
      title: isPortuguese ? 'Verificar' : 'Check', 
      value: 'check' 
    },
    { 
      title: isPortuguese ? 'Coração' : 'Heart', 
      value: 'heart' 
    },
    { 
      title: isPortuguese ? 'Estrela' : 'Star', 
      value: 'star' 
    },
    { 
      title: isPortuguese ? 'Pesquisar' : 'Search', 
      value: 'search' 
    },
    { 
      title: isPortuguese ? 'Configurações' : 'Settings', 
      value: 'settings' 
    },
    { 
      title: isPortuguese ? 'Email' : 'Mail', 
      value: 'mail' 
    },
    { 
      title: isPortuguese ? 'Calendário' : 'Calendar', 
      value: 'calendar' 
    },
  ],
  heroMediaTypes: [
    { 
      title: isPortuguese ? 'Imagem' : 'Image', 
      value: 'image' 
    },
    { 
      title: isPortuguese ? 'Vídeo' : 'Video', 
      value: 'video' 
    },
    { 
      title: isPortuguese ? 'Placeholder' : 'Placeholder', 
      value: 'placeholder' 
    },
  ],
  // NewsletterSection options
  newsletterVariants: [
    { 
      title: isPortuguese ? 'Padrão' : 'Default', 
      value: 'default' 
    },
    { 
      title: isPortuguese ? 'Destaque' : 'Highlight', 
      value: 'highlight' 
    },
    { 
      title: isPortuguese ? 'Mínima' : 'Minimal', 
      value: 'minimal' 
    },
    { 
      title: isPortuguese ? 'Completa' : 'Full', 
      value: 'full' 
    },
  ],
  newsletterButtonIconOptions: [
    { 
      title: isPortuguese ? 'Nenhum' : 'None', 
      value: 'none' 
    },
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Mais' : 'Plus', 
      value: 'plus' 
    },
    { 
      title: isPortuguese ? 'Email' : 'Mail', 
      value: 'mail' 
    },
  ],
  // PricingSection options
  pricingButtonIconOptions: [
    { 
      title: isPortuguese ? 'Seta para Direita' : 'Arrow Right', 
      value: 'arrowRight' 
    },
    { 
      title: isPortuguese ? 'Telefone' : 'Phone', 
      value: 'phone' 
    },
    { 
      title: isPortuguese ? 'Mais' : 'Plus', 
      value: 'plus' 
    },
  ],
  pricingButtonVariantOptions: [
    { 
      title: isPortuguese ? 'Padrão' : 'Default', 
      value: 'default' 
    },
    { 
      title: isPortuguese ? 'Contorno' : 'Outline', 
      value: 'outline' 
    },
    { 
      title: isPortuguese ? 'Secundário' : 'Secondary', 
      value: 'secondary' 
    },
  ],
  // StatsSection options
  statsVariants: [
    { 
      title: isPortuguese ? 'Grade de Estatísticas' : 'Statistics Grid', 
      value: 'grid' 
    },
    { 
      title: isPortuguese ? 'Estatísticas com Conteúdo' : 'Statistics with Content', 
      value: 'withContent' 
    },
  ],
  trendDirections: [
    { 
      title: isPortuguese ? 'Para Cima' : 'Up', 
      value: 'up' 
    },
    { 
      title: isPortuguese ? 'Para Baixo' : 'Down', 
      value: 'down' 
    },
    { 
      title: isPortuguese ? 'Nenhuma' : 'None', 
      value: 'none' 
    },
  ],
  iconColors: [
    { 
      title: isPortuguese ? 'Primária' : 'Primary', 
      value: 'primary' 
    },
    { 
      title: isPortuguese ? 'Sucesso' : 'Success', 
      value: 'success' 
    },
    { 
      title: isPortuguese ? 'Aviso' : 'Warning', 
      value: 'warning' 
    },
    { 
      title: isPortuguese ? 'Destrutiva' : 'Destructive', 
      value: 'destructive' 
    },
    { 
      title: isPortuguese ? 'Suave' : 'Muted', 
      value: 'muted' 
    },
  ],
  // TestimonialsSection options
  testimonialsVariants: [
    { 
      title: isPortuguese ? 'Carrossel' : 'Carousel', 
      value: 'carousel' 
    },
    { 
      title: isPortuguese ? 'Grade' : 'Grid', 
      value: 'grid' 
    },
    { 
      title: isPortuguese ? 'Grade Masonry' : 'Masonry Grid', 
      value: 'masonry-grid' 
    },
  ],
  // CodeBlock options
  codeLanguages: [
    { title: 'TypeScript', value: 'typescript' },
    { title: 'JavaScript', value: 'javascript' },
    { title: 'HTML', value: 'html' },
    { title: 'CSS', value: 'css' },
    { title: 'SCSS', value: 'scss' },
    { title: 'JSX', value: 'jsx' },
    { title: 'TSX', value: 'tsx' },
    { title: 'Shell', value: 'shell' },
    { title: 'Markdown', value: 'markdown' },
    { title: 'JSON', value: 'json' },
    { title: 'Python', value: 'python' },
    { title: 'Ruby', value: 'ruby' },
    { title: 'PHP', value: 'php' },
    { title: 'Go', value: 'go' },
    { title: 'Java', value: 'java' },
    { title: 'C', value: 'c' },
    { title: 'C++', value: 'cpp' },
    { title: 'C#', value: 'csharp' },
    { 
      title: isPortuguese ? 'Texto Simples' : 'Plain Text', 
      value: 'text' 
    },
  ],
  // PortableText options
  blockStyles: [
    { title: isPortuguese ? 'Normal' : 'Normal', value: 'normal' },
    { title: isPortuguese ? 'Título 1' : 'Heading 1', value: 'h1' },
    { title: isPortuguese ? 'Título 2' : 'Heading 2', value: 'h2' },
    { title: isPortuguese ? 'Título 3' : 'Heading 3', value: 'h3' },
    { title: isPortuguese ? 'Título 4' : 'Heading 4', value: 'h4' },
    { title: isPortuguese ? 'Citação' : 'Quote', value: 'blockquote' },
  ],
  listStyles: [
    { title: isPortuguese ? 'Marcadores' : 'Bullet', value: 'bullet' },
    { title: isPortuguese ? 'Numeração' : 'Numbered', value: 'number' },
  ],
  textDecorators: [
    { title: isPortuguese ? 'Negrito' : 'Strong', value: 'strong' },
    { title: isPortuguese ? 'Ênfase' : 'Emphasis', value: 'em' },
    { title: isPortuguese ? 'Código' : 'Code', value: 'code' },
    { title: isPortuguese ? 'Sublinhado' : 'Underline', value: 'underline' },
    { title: isPortuguese ? 'Riscado' : 'Strike-through', value: 'strike-through' },
  ],
  // Header options
  headerVariants: [
    { title: isPortuguese ? 'Padrão' : 'Default', value: 'default' },
    { title: isPortuguese ? 'Centralizado' : 'Centered', value: 'centered' },
    { title: isPortuguese ? 'Mínimo' : 'Minimal', value: 'minimal' },
    { title: isPortuguese ? 'Transparente' : 'Transparent', value: 'transparent' },
  ],
  headerButtonVariants: [
    { title: isPortuguese ? 'Padrão' : 'Default', value: 'default' },
    { title: isPortuguese ? 'Contorno' : 'Outline', value: 'outline' },
    { title: isPortuguese ? 'Secundário' : 'Secondary', value: 'secondary' },
    { title: isPortuguese ? 'Fantasma' : 'Ghost', value: 'ghost' },
    { title: isPortuguese ? 'Link' : 'Link', value: 'link' },
  ],
  // Footer options
  footerVariants: [
    { title: isPortuguese ? 'Simples' : 'Simple', value: 'simple' },
    { title: isPortuguese ? 'Mínimo' : 'Minimal', value: 'minimal' },
    { title: isPortuguese ? 'Minúsculo' : 'Tiny', value: 'tiny' },
  ],
}