export const LOCALES = ['es','en','pt','fr'] as const
export type Locale = typeof LOCALES[number]
export const LOCALE_LABELS: Record<Locale,string> = { es:'Español', en:'English', pt:'Português', fr:'Français' }
export const LOCALE_FLAGS: Record<Locale,string> = { es:'ES', en:'EN', pt:'PT', fr:'FR' }

export const translations = {
  es: {
    language:'Idioma', corporate:'Centro corporativo', investorPortal:'Portal inversionista',
    management:'GESTIÓN', control:'CONTROL', portfolio:'PORTAFOLIO', account:'CUENTA',
    executiveDashboard:'Dashboard ejecutivo', applications:'Solicitudes de financiamiento',
    projects:'Proyectos', jointVentures:'Joint Ventures & Develop', capitalSources:'Fuentes de capital',
    procurement:'Procurement y compras', budgets:'Presupuestos', quotes:'Cotizaciones',
    purchaseOrders:'Órdenes de compra', contracts:'Contratos', disbursements:'Cubicaciones y desembolsos',
    humanResources:'Recursos Humanos', capitalDesk:'Capital Desk · Dashboard',
    communications:'Capital Desk · Communications', executiveReporting:'Executive Reporting',
    investmentAnalysis:'Investment Analysis', transactionControl:'Transaction Control',
    boardReport:'Executive / Board Report', controlCenter:'Executive Control Center',
    auditCompliance:'Audit & Compliance', complianceCenter:'Compliance Control Center',
    corporateStructure:'Estructura corporativa', investorsKyc:'Inversionistas / KYC',
    staffRoles:'Staff y roles', dashboard:'Dashboard', myApplications:'Mis solicitudes',
    myInvestments:'Mis inversiones', documents:'Documentos', myProfile:'Mi perfil y KYC',
    clientView:'Vista cliente', adminPanel:'Panel administrativo', secureAccess:'Acceso interno'
  },
  en: {
    language:'Language', corporate:'Corporate Center', investorPortal:'Investor Portal',
    management:'MANAGEMENT', control:'CONTROL', portfolio:'PORTFOLIO', account:'ACCOUNT',
    executiveDashboard:'Executive Dashboard', applications:'Funding Applications',
    projects:'Projects', jointVentures:'Joint Ventures & Development', capitalSources:'Capital Sources',
    procurement:'Procurement & Purchasing', budgets:'Budgets', quotes:'Quotes',
    purchaseOrders:'Purchase Orders', contracts:'Contracts', disbursements:'Progress Claims & Disbursements',
    humanResources:'Human Resources', capitalDesk:'Capital Desk · Dashboard',
    communications:'Capital Desk · Communications', executiveReporting:'Executive Reporting',
    investmentAnalysis:'Investment Analysis', transactionControl:'Transaction Control',
    boardReport:'Executive / Board Report', controlCenter:'Executive Control Center',
    auditCompliance:'Audit & Compliance', complianceCenter:'Compliance Control Center',
    corporateStructure:'Corporate Structure', investorsKyc:'Investors / KYC',
    staffRoles:'Staff & Roles', dashboard:'Dashboard', myApplications:'My Applications',
    myInvestments:'My Investments', documents:'Documents', myProfile:'My Profile & KYC',
    clientView:'Client View', adminPanel:'Administrative Panel', secureAccess:'Internal Access'
  },
  pt: {
    language:'Idioma', corporate:'Centro Corporativo', investorPortal:'Portal do Investidor',
    management:'GESTÃO', control:'CONTROLE', portfolio:'PORTFÓLIO', account:'CONTA',
    executiveDashboard:'Painel Executivo', applications:'Solicitações de Financiamento',
    projects:'Projetos', jointVentures:'Joint Ventures & Desenvolvimento', capitalSources:'Fontes de Capital',
    procurement:'Compras e Suprimentos', budgets:'Orçamentos', quotes:'Cotações',
    purchaseOrders:'Ordens de Compra', contracts:'Contratos', disbursements:'Medições e Desembolsos',
    humanResources:'Recursos Humanos', capitalDesk:'Capital Desk · Dashboard',
    communications:'Capital Desk · Comunicações', executiveReporting:'Relatórios Executivos',
    investmentAnalysis:'Análise de Investimentos', transactionControl:'Controle de Transações',
    boardReport:'Relatório Executivo / Conselho', controlCenter:'Centro de Controle Executivo',
    auditCompliance:'Auditoria e Compliance', complianceCenter:'Centro de Compliance',
    corporateStructure:'Estrutura Corporativa', investorsKyc:'Investidores / KYC',
    staffRoles:'Equipe e Funções', dashboard:'Dashboard', myApplications:'Minhas Solicitações',
    myInvestments:'Meus Investimentos', documents:'Documentos', myProfile:'Meu Perfil e KYC',
    clientView:'Visão do Cliente', adminPanel:'Painel Administrativo', secureAccess:'Acesso Interno'
  },
  fr: {
    language:'Langue', corporate:'Centre Corporatif', investorPortal:'Portail Investisseur',
    management:'GESTION', control:'CONTRÔLE', portfolio:'PORTEFEUILLE', account:'COMPTE',
    executiveDashboard:'Tableau de Bord Exécutif', applications:'Demandes de Financement',
    projects:'Projets', jointVentures:'Joint Ventures & Développement', capitalSources:'Sources de Capitaux',
    procurement:'Achats et Approvisionnement', budgets:'Budgets', quotes:'Devis',
    purchaseOrders:'Bons de Commande', contracts:'Contrats', disbursements:'Situations et Décaissements',
    humanResources:'Ressources Humaines', capitalDesk:'Capital Desk · Tableau de Bord',
    communications:'Capital Desk · Communications', executiveReporting:'Reporting Exécutif',
    investmentAnalysis:'Analyse des Investissements', transactionControl:'Contrôle des Transactions',
    boardReport:'Rapport Exécutif / Conseil', controlCenter:'Centre de Contrôle Exécutif',
    auditCompliance:'Audit & Compliance', complianceCenter:'Centre de Compliance',
    corporateStructure:'Structure Corporative', investorsKyc:'Investisseurs / KYC',
    staffRoles:'Équipe et Rôles', dashboard:'Tableau de Bord', myApplications:'Mes Demandes',
    myInvestments:'Mes Investissements', documents:'Documents', myProfile:'Mon Profil et KYC',
    clientView:'Vue Client', adminPanel:'Panneau Administratif', secureAccess:'Accès Interne'
  }
} as const

export type TranslationKey = keyof typeof translations.es

export function getTranslations(locale: Locale) {
  return translations[locale]
}
export async function getServerLocale(): Promise<Locale> {
  const { cookies } = await import('next/headers')
  const value = (await cookies()).get('bqt_locale')?.value
  return isLocale(value) ? value : 'es'
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}
