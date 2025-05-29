import { studioConfig } from '../config'

const isPortuguese = studioConfig.language === 'pt-BR'

// Re-export everything from modular files
export { fields, groups, sections, documents } from './fields'
export { validation } from './validation'
export { descriptions } from './descriptions'
export { sanityOptions } from './options'
