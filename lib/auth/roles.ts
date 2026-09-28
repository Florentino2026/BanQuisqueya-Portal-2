export const STAFF_ROLES = ['admin','compliance','kyc_reviewer','project_manager','due_diligence','legal','finance','relationship_manager'] as const
export type StaffRole = typeof STAFF_ROLES[number]

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Administrador',
  compliance: 'Cumplimiento / Compliance',
  kyc_reviewer: 'Analista KYC',
  project_manager: 'Gerente de Proyectos',
  due_diligence: 'Due Diligence',
  legal: 'Legal',
  finance: 'Finanzas',
  relationship_manager: 'Relaciones con Inversionistas',
}

export const ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  admin: 'Acceso total y administración del staff.',
  compliance: 'Cumplimiento, KYC, riesgos y controles.',
  kyc_reviewer: 'Revisión de expedientes y documentos KYC.',
  project_manager: 'Gestión de proyectos y solicitudes de financiamiento.',
  due_diligence: 'Investigación y revisión de due diligence.',
  legal: 'Documentos legales, NDA y contratos.',
  finance: 'Términos financieros, fondos y operaciones.',
  relationship_manager: 'Atención y gestión de inversionistas/clientes.',
}

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role)
}

export function canReviewKyc(role: string | null | undefined) {
  return role === 'admin' || role === 'compliance' || role === 'kyc_reviewer'
}
