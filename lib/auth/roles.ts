export const STAFF_ROLES = ['admin','compliance','kyc_reviewer','project_manager','due_diligence','legal','finance','relationship_manager','supervisor','developer','procurement','accounting','treasury','hr','it','risk_manager','internal_audit','contract_manager','hse_manager','vendor_manager','executive','cfo','operations_manager'] as const
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
  supervisor: 'Supervisor de Obras',
  developer: 'Developer / Desarrollador',
  procurement: 'Compras / Procurement',
  accounting: 'Contabilidad',
  treasury: 'Tesorería',
  hr: 'Recursos Humanos',
  it: 'Tecnología / IT',
  risk_manager: 'Gestión de Riesgos',
  internal_audit: 'Auditoría Interna',
  contract_manager: 'Administración de Contratos',
  hse_manager: 'HSE / Seguridad',
  vendor_manager: 'Gestión de Suplidores',
  executive: 'Dirección Ejecutiva',
  cfo: 'CFO / Dirección Financiera',
  operations_manager: 'Gerencia de Operaciones',
}

export const ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  admin: 'Acceso total y administración del staff.',
  compliance: 'Cumplimiento, KYC, AML y controles.',
  kyc_reviewer: 'Revisión de expedientes y documentos KYC.',
  project_manager: 'Gestión de proyectos y solicitudes de financiamiento.',
  due_diligence: 'Investigación y revisión de due diligence.',
  legal: 'Documentos legales, NDA y contratos.',
  finance: 'Análisis financiero, fondos y operaciones.',
  relationship_manager: 'Atención y gestión de inversionistas/clientes.',
  supervisor: 'Inspección técnica, avance físico y aprobación de cubicaciones.',
  developer: 'Originación, documentación y ejecución del proyecto por el desarrollador.',
  procurement: 'Compras, cotizaciones y órdenes de compra.',
  accounting: 'Contabilidad, cuentas por pagar y validación de desembolsos.',
  treasury: 'Liquidez y ejecución de pagos.',
  hr: 'Gestión de personal y procesos de recursos humanos.',
  it: 'Sistemas, infraestructura, seguridad y soporte tecnológico.',
  risk_manager: 'Identificación, evaluación y mitigación de riesgos.',
  internal_audit: 'Auditoría, controles y trazabilidad.',
  contract_manager: 'Administración, vencimientos y cumplimiento contractual.',
  hse_manager: 'Seguridad, salud ocupacional y ambiente.',
  vendor_manager: 'Alta, evaluación y gestión de suplidores.',
  executive: 'Dirección ejecutiva y aprobaciones estratégicas.',
  cfo: 'Supervisión financiera y aprobaciones financieras superiores.',
  operations_manager: 'Operación corporativa transversal.',
}

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role)
}

export function canReviewKyc(role: string | null | undefined) {
  return role === 'admin' || role === 'compliance' || role === 'kyc_reviewer'
}

export function canReviewCubicaciones(role: string | null | undefined) {
  return role === 'admin' || role === 'supervisor'
}

export function canProcessDisbursements(role: string | null | undefined) {
  return role === 'admin' || role === 'accounting' || role === 'finance' || role === 'cfo' || role === 'treasury'
}
