import { useEffect, useMemo, useState } from 'react'
import {
  ChildrenApiError,
  createChild,
  createGuardian,
  fetchChildDetails,
  fetchChildren,
  fetchGuardians,
  fetchGuardiansForChild,
  linkGuardianToChild,
  updateChild,
} from '../api/childrenApi'
import type {
  ChildDetails,
  ChildGuardianContact,
  ChildSummary,
  ChildUpsertPayload,
  GuardianSummary,
  GuardianUpsertPayload,
  LifecycleStatus,
} from '../model/Children'
import type { ManagementOperationalContext, OrganizationContext, SiteContext } from '../model/OperationalContext'

type ChildFormMode = 'create' | 'edit'

interface ChildFormState {
  firstName: string
  lastName: string
  preferredName: string
  dateOfBirth: string
  organizationId: string
  siteId: string
  roomId: string
  status: LifecycleStatus
  notes: string
}

interface GuardianFormState {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  status: LifecycleStatus
}

interface LinkGuardianFormState {
  guardianId: string
  relationshipToChild: string
  primaryContact: boolean
  emergencyContact: boolean
  status: LifecycleStatus
}

interface ChildrenManagementPanelProps {
  authorizationHeader: string | null
  operationalContext: ManagementOperationalContext | null
}

const EMPTY_CHILD_FORM: ChildFormState = {
  firstName: '',
  lastName: '',
  preferredName: '',
  dateOfBirth: '',
  organizationId: '',
  siteId: '',
  roomId: '',
  status: 'ACTIVE',
  notes: '',
}

const EMPTY_GUARDIAN_FORM: GuardianFormState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  status: 'ACTIVE',
}

const EMPTY_LINK_FORM: LinkGuardianFormState = {
  guardianId: '',
  relationshipToChild: '',
  primaryContact: false,
  emergencyContact: false,
  status: 'ACTIVE',
}

function formatStatusLabel(value: string): string {
  return value.toLowerCase().replace('_', ' ')
}

function toRequiredText(value: string): string {
  return value.trim()
}

function toOptionalText(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function toChildPayload(formState: ChildFormState): ChildUpsertPayload {
  return {
    firstName: toRequiredText(formState.firstName),
    lastName: toRequiredText(formState.lastName),
    preferredName: toOptionalText(formState.preferredName),
    dateOfBirth: formState.dateOfBirth,
    organizationId: formState.organizationId,
    siteId: formState.siteId,
    roomId: formState.roomId || null,
    status: formState.status,
    notes: toOptionalText(formState.notes),
  }
}

function toGuardianPayload(formState: GuardianFormState): GuardianUpsertPayload {
  return {
    firstName: toRequiredText(formState.firstName),
    lastName: toRequiredText(formState.lastName),
    phoneNumber: toRequiredText(formState.phoneNumber),
    email: toRequiredText(formState.email),
    status: formState.status,
  }
}

function buildDefaultChildForm(context: ManagementOperationalContext | null): ChildFormState {
  const organization = context?.organizations[0]
  const site = organization?.sites[0]

  return {
    ...EMPTY_CHILD_FORM,
    organizationId: organization?.id ?? '',
    siteId: site?.id ?? '',
  }
}

function buildEditChildForm(details: ChildDetails): ChildFormState {
  return {
    firstName: details.firstName,
    lastName: details.lastName,
    preferredName: details.preferredName ?? '',
    dateOfBirth: details.dateOfBirth,
    organizationId: details.organizationId,
    siteId: details.siteId,
    roomId: details.roomId ?? '',
    status: details.status,
    notes: details.notes ?? '',
  }
}

function resolveSites(organizations: OrganizationContext[], organizationId: string): SiteContext[] {
  return organizations.find((organization) => organization.id === organizationId)?.sites ?? []
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ChildrenApiError) {
    return error.message
  }

  return fallback
}

function formatDate(value: string): string {
  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString()
}

export function ChildrenManagementPanel({
  authorizationHeader,
  operationalContext,
}: ChildrenManagementPanelProps) {
  const [children, setChildren] = useState<ChildSummary[]>([])
  const [isChildrenLoading, setIsChildrenLoading] = useState<boolean>(true)
  const [childrenError, setChildrenError] = useState<string | null>(null)
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [selectedChild, setSelectedChild] = useState<ChildDetails | null>(null)
  const [linkedGuardians, setLinkedGuardians] = useState<ChildGuardianContact[]>([])
  const [isChildContextLoading, setIsChildContextLoading] = useState<boolean>(false)
  const [childContextError, setChildContextError] = useState<string | null>(null)
  const [guardians, setGuardians] = useState<GuardianSummary[]>([])
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [refreshSeed, setRefreshSeed] = useState<number>(0)

  const [isChildFormOpen, setIsChildFormOpen] = useState<boolean>(false)
  const [childFormMode, setChildFormMode] = useState<ChildFormMode>('create')
  const [childForm, setChildForm] = useState<ChildFormState>(() => buildDefaultChildForm(operationalContext))
  const [isChildSaving, setIsChildSaving] = useState<boolean>(false)

  const [isGuardianFormOpen, setIsGuardianFormOpen] = useState<boolean>(false)
  const [guardianForm, setGuardianForm] = useState<GuardianFormState>(EMPTY_GUARDIAN_FORM)
  const [isGuardianSaving, setIsGuardianSaving] = useState<boolean>(false)

  const [isLinkFormOpen, setIsLinkFormOpen] = useState<boolean>(false)
  const [linkForm, setLinkForm] = useState<LinkGuardianFormState>(EMPTY_LINK_FORM)
  const [isLinkSaving, setIsLinkSaving] = useState<boolean>(false)

  const organizations = useMemo(
    () => operationalContext?.organizations ?? [],
    [operationalContext],
  )
  const siteOptions = useMemo(
    () => resolveSites(organizations, childForm.organizationId),
    [childForm.organizationId, organizations],
  )
  const roomOptions = useMemo(
    () => siteOptions.find((site) => site.id === childForm.siteId)?.rooms ?? [],
    [childForm.siteId, siteOptions],
  )

  const selectedChildSummary = useMemo(
    () => children.find((child) => child.id === selectedChildId) ?? null,
    [children, selectedChildId],
  )
  const unlinkedGuardians = useMemo(
    () => guardians.filter((guardian) => !linkedGuardians.some((link) => link.guardianId === guardian.id)),
    [guardians, linkedGuardians],
  )

  useEffect(() => {
    if (!authorizationHeader) {
      setChildren([])
      setSelectedChildId(null)
      setSelectedChild(null)
      setLinkedGuardians([])
      setGuardians([])
      setChildrenError(null)
      setChildContextError(null)
      setIsChildrenLoading(false)
      return
    }

    let isCurrent = true
    setIsChildrenLoading(true)
    setChildrenError(null)

    Promise.all([fetchChildren(authorizationHeader), fetchGuardians(authorizationHeader)])
      .then(([childrenResponse, guardiansResponse]) => {
        if (!isCurrent) {
          return
        }

        setChildren(childrenResponse)
        setGuardians(guardiansResponse)

        if (childrenResponse.length === 0) {
          setSelectedChildId(null)
          setSelectedChild(null)
          setLinkedGuardians([])
          return
        }

        setSelectedChildId((currentSelection) => {
          const hasCurrentSelection = childrenResponse.some((child) => child.id === currentSelection)
          return hasCurrentSelection ? currentSelection : childrenResponse[0].id
        })
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return
        }

        setChildrenError(toErrorMessage(error, 'Child records could not be loaded.'))
      })
      .finally(() => {
        if (isCurrent) {
          setIsChildrenLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [authorizationHeader, refreshSeed])

  useEffect(() => {
    if (!authorizationHeader || !selectedChildId) {
      setSelectedChild(null)
      setLinkedGuardians([])
      setChildContextError(null)
      return
    }

    let isCurrent = true
    setIsChildContextLoading(true)
    setChildContextError(null)

    Promise.all([
      fetchChildDetails(authorizationHeader, selectedChildId),
      fetchGuardiansForChild(authorizationHeader, selectedChildId),
    ])
      .then(([childDetailsResponse, linkedGuardianResponse]) => {
        if (!isCurrent) {
          return
        }

        setSelectedChild(childDetailsResponse)
        setLinkedGuardians(linkedGuardianResponse)
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return
        }

        setChildContextError(toErrorMessage(error, 'Selected child profile could not be loaded.'))
      })
      .finally(() => {
        if (isCurrent) {
          setIsChildContextLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [authorizationHeader, selectedChildId])

  const handleRefresh = () => {
    setActionMessage(null)
    setActionError(null)
    setRefreshSeed((previousValue) => previousValue + 1)
  }

  const handleOpenCreateChild = () => {
    setChildFormMode('create')
    setChildForm(buildDefaultChildForm(operationalContext))
    setIsChildFormOpen(true)
    setActionMessage(null)
    setActionError(null)
  }

  const handleOpenEditChild = () => {
    if (!selectedChild) {
      return
    }

    setChildFormMode('edit')
    setChildForm(buildEditChildForm(selectedChild))
    setIsChildFormOpen(true)
    setActionMessage(null)
    setActionError(null)
  }

  const handleSaveChild = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authorizationHeader) {
      return
    }

    if (!childForm.organizationId || !childForm.siteId) {
      setActionError('Organization and site are required.')
      return
    }

    setIsChildSaving(true)
    setActionMessage(null)
    setActionError(null)

    try {
      const payload = toChildPayload(childForm)
      const childResponse =
        childFormMode === 'create' || !selectedChildId
          ? await createChild(authorizationHeader, payload)
          : await updateChild(authorizationHeader, selectedChildId, payload)

      setIsChildFormOpen(false)
      setSelectedChildId(childResponse.id)
      setActionMessage(childFormMode === 'create' ? 'Child created successfully.' : 'Child updated successfully.')
      setRefreshSeed((previousValue) => previousValue + 1)
    } catch (error) {
      setActionError(toErrorMessage(error, 'Child profile could not be saved.'))
    } finally {
      setIsChildSaving(false)
    }
  }

  const handleCreateGuardian = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authorizationHeader) {
      return
    }

    setIsGuardianSaving(true)
    setActionMessage(null)
    setActionError(null)

    try {
      await createGuardian(authorizationHeader, toGuardianPayload(guardianForm))
      setIsGuardianFormOpen(false)
      setGuardianForm(EMPTY_GUARDIAN_FORM)
      setActionMessage('Guardian created successfully.')
      setRefreshSeed((previousValue) => previousValue + 1)
    } catch (error) {
      setActionError(toErrorMessage(error, 'Guardian could not be created.'))
    } finally {
      setIsGuardianSaving(false)
    }
  }

  const handleLinkGuardian = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!authorizationHeader || !selectedChildId || !linkForm.guardianId) {
      return
    }

    setIsLinkSaving(true)
    setActionMessage(null)
    setActionError(null)

    try {
      await linkGuardianToChild(authorizationHeader, selectedChildId, linkForm.guardianId, {
        relationshipToChild: toRequiredText(linkForm.relationshipToChild),
        primaryContact: linkForm.primaryContact,
        emergencyContact: linkForm.emergencyContact,
        status: linkForm.status,
      })

      setIsLinkFormOpen(false)
      setLinkForm(EMPTY_LINK_FORM)
      setActionMessage('Guardian link saved successfully.')
      setRefreshSeed((previousValue) => previousValue + 1)
    } catch (error) {
      setActionError(toErrorMessage(error, 'Guardian link could not be saved.'))
    } finally {
      setIsLinkSaving(false)
    }
  }

  if (!authorizationHeader) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">Management authentication is required to access child records.</p>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-white/80 bg-white/84 p-5 shadow-[0_14px_30px_rgba(43,51,47,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/55">Children</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight text-ink">Child and guardian records</h2>
            <p className="mt-2 text-sm text-ink/70">
              Management-facing profile and contact foundation for PT04.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-xl border border-sand bg-cream px-3 py-2 text-sm font-semibold text-ink"
              onClick={handleRefresh}
            >
              Refresh
            </button>
            <button
              type="button"
              className="rounded-xl border border-pine/20 bg-pine px-3 py-2 text-sm font-semibold text-cream"
              onClick={handleOpenCreateChild}
            >
              Add child
            </button>
          </div>
        </div>
        {actionMessage ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {actionMessage}
          </p>
        ) : null}
        {actionError ? (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {actionError}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-[330px_1fr]">
        <aside className="rounded-3xl border border-white/80 bg-white/82 p-4 shadow-[0_12px_26px_rgba(43,51,47,0.07)]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/55">Children list</p>
            <span className="rounded-full border border-sand bg-cream px-2.5 py-1 text-xs font-semibold text-ink/70">
              {children.length}
            </span>
          </div>
          {isChildrenLoading ? <p className="mt-4 text-sm text-ink/70">Loading children...</p> : null}
          {childrenError ? <p className="mt-4 text-sm text-rose-700">{childrenError}</p> : null}
          {!isChildrenLoading && !childrenError && children.length === 0 ? (
            <p className="mt-4 text-sm text-ink/70">No child profiles available yet.</p>
          ) : null}
          {!isChildrenLoading && !childrenError && children.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {children.map((child) => {
                const isSelected = child.id === selectedChildId
                return (
                  <li key={child.id}>
                    <button
                      type="button"
                      className={`w-full rounded-2xl border px-3 py-2.5 text-left ${
                        isSelected
                          ? 'border-pine/35 bg-pine text-cream'
                          : 'border-sand/80 bg-cream/70 text-ink hover:bg-cream'
                      }`}
                      onClick={() => setSelectedChildId(child.id)}
                    >
                      <p className="text-sm font-semibold">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className={`mt-1 text-xs ${isSelected ? 'text-cream/80' : 'text-ink/60'}`}>
                        {child.siteName}
                        {child.roomName ? ` - ${child.roomName}` : ''}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </aside>

        <div className="space-y-4">
          <section className="rounded-3xl border border-white/80 bg-white/84 p-4 shadow-[0_12px_26px_rgba(43,51,47,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/55">Child profile</p>
              {selectedChild ? (
                <button
                  type="button"
                  className="rounded-xl border border-sand bg-cream px-3 py-2 text-sm font-semibold text-ink"
                  onClick={handleOpenEditChild}
                >
                  Edit child
                </button>
              ) : null}
            </div>

            {isChildContextLoading ? <p className="mt-3 text-sm text-ink/70">Loading selected child...</p> : null}
            {childContextError ? <p className="mt-3 text-sm text-rose-700">{childContextError}</p> : null}
            {!isChildContextLoading && !childContextError && !selectedChildSummary ? (
              <p className="mt-3 text-sm text-ink/70">Select a child to view details.</p>
            ) : null}
            {!isChildContextLoading && selectedChild ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-sand/75 bg-cream/75 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/55">Name</p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {selectedChild.firstName} {selectedChild.lastName}
                  </p>
                </div>
                <div className="rounded-2xl border border-sand/75 bg-cream/75 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/55">Preferred</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{selectedChild.preferredName ?? 'Not set'}</p>
                </div>
                <div className="rounded-2xl border border-sand/75 bg-cream/75 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/55">Date of birth</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{formatDate(selectedChild.dateOfBirth)}</p>
                </div>
                <div className="rounded-2xl border border-sand/75 bg-cream/75 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/55">Status</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{formatStatusLabel(selectedChild.status)}</p>
                </div>
                <div className="rounded-2xl border border-sand/75 bg-cream/75 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/55">Organization</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{selectedChild.organizationName}</p>
                </div>
                <div className="rounded-2xl border border-sand/75 bg-cream/75 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/55">Site / Room</p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {selectedChild.siteName}
                    {selectedChild.roomName ? ` - ${selectedChild.roomName}` : ''}
                  </p>
                </div>
              </div>
            ) : null}
            {selectedChild?.notes ? (
              <p className="mt-3 rounded-2xl border border-sand/80 bg-oat/70 px-3 py-2 text-sm text-ink/75">
                {selectedChild.notes}
              </p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-white/80 bg-white/84 p-4 shadow-[0_12px_26px_rgba(43,51,47,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/55">Guardian contacts</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-sand bg-cream px-3 py-2 text-sm font-semibold text-ink"
                  onClick={() => setIsGuardianFormOpen((value) => !value)}
                >
                  Add guardian
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-sand bg-cream px-3 py-2 text-sm font-semibold text-ink disabled:opacity-60"
                  disabled={!selectedChildId || unlinkedGuardians.length === 0}
                  onClick={() => {
                    setIsLinkFormOpen((value) => !value)
                    setLinkForm((previousState) => ({
                      ...previousState,
                      guardianId: previousState.guardianId || unlinkedGuardians[0]?.id || '',
                    }))
                  }}
                >
                  Link guardian
                </button>
              </div>
            </div>
            {selectedChildId && linkedGuardians.length === 0 ? (
              <p className="mt-3 text-sm text-ink/70">No guardian linked to this child yet.</p>
            ) : null}
            {linkedGuardians.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {linkedGuardians.map((link) => (
                  <li key={`${link.childId}-${link.guardianId}`} className="rounded-2xl border border-sand/80 bg-cream/75 px-3 py-2.5">
                    <p className="text-sm font-semibold text-ink">
                      {link.firstName} {link.lastName}
                    </p>
                    <p className="mt-1 text-xs text-ink/65">
                      {link.relationshipToChild} | {link.phoneNumber}
                    </p>
                    <p className="text-xs text-ink/65">{link.email}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </section>

      {isChildFormOpen ? (
        <section className="rounded-3xl border border-pine/20 bg-cream/86 p-4 shadow-[0_12px_26px_rgba(43,51,47,0.07)]">
          <h3 className="font-display text-2xl tracking-tight text-ink">
            {childFormMode === 'create' ? 'Create child' : 'Edit child'}
          </h3>
          <form className="mt-3 space-y-3" onSubmit={handleSaveChild}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-ink/80">
                First name
                <input
                  required
                  value={childForm.firstName}
                  onChange={(event) => setChildForm((state) => ({ ...state, firstName: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                />
              </label>
              <label className="text-sm text-ink/80">
                Last name
                <input
                  required
                  value={childForm.lastName}
                  onChange={(event) => setChildForm((state) => ({ ...state, lastName: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                />
              </label>
              <label className="text-sm text-ink/80">
                Preferred name
                <input
                  value={childForm.preferredName}
                  onChange={(event) => setChildForm((state) => ({ ...state, preferredName: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                />
              </label>
              <label className="text-sm text-ink/80">
                Date of birth
                <input
                  required
                  type="date"
                  value={childForm.dateOfBirth}
                  onChange={(event) => setChildForm((state) => ({ ...state, dateOfBirth: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                />
              </label>
              <label className="text-sm text-ink/80">
                Organization
                <select
                  required
                  value={childForm.organizationId}
                  onChange={(event) => {
                    const organizationId = event.target.value
                    const nextSiteId = resolveSites(organizations, organizationId)[0]?.id ?? ''
                    setChildForm((state) => ({
                      ...state,
                      organizationId,
                      siteId: nextSiteId,
                      roomId: '',
                    }))
                  }}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                >
                  {organizations.map((organization) => (
                    <option key={organization.id} value={organization.id}>
                      {organization.displayName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-ink/80">
                Site
                <select
                  required
                  value={childForm.siteId}
                  onChange={(event) =>
                    setChildForm((state) => ({
                      ...state,
                      siteId: event.target.value,
                      roomId: '',
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                >
                  {siteOptions.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-ink/80">
                Room
                <select
                  value={childForm.roomId}
                  onChange={(event) => setChildForm((state) => ({ ...state, roomId: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                >
                  <option value="">Unassigned</option>
                  {roomOptions.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-ink/80">
                Status
                <select
                  value={childForm.status}
                  onChange={(event) =>
                    setChildForm((state) => ({ ...state, status: event.target.value as LifecycleStatus }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
            </div>
            <label className="block text-sm text-ink/80">
              Notes
              <textarea
                rows={3}
                value={childForm.notes}
                onChange={(event) => setChildForm((state) => ({ ...state, notes: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-sand bg-white px-3 py-2 text-sm font-semibold text-ink"
                onClick={() => setIsChildFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isChildSaving}
                className="rounded-xl border border-pine/20 bg-pine px-3 py-2 text-sm font-semibold text-cream disabled:opacity-60"
              >
                {isChildSaving ? 'Saving...' : 'Save child'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {isGuardianFormOpen ? (
        <section className="rounded-3xl border border-pine/20 bg-cream/86 p-4 shadow-[0_12px_26px_rgba(43,51,47,0.07)]">
          <h3 className="font-display text-2xl tracking-tight text-ink">Create guardian</h3>
          <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={handleCreateGuardian}>
            <label className="text-sm text-ink/80">
              First name
              <input
                required
                value={guardianForm.firstName}
                onChange={(event) => setGuardianForm((state) => ({ ...state, firstName: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-ink/80">
              Last name
              <input
                required
                value={guardianForm.lastName}
                onChange={(event) => setGuardianForm((state) => ({ ...state, lastName: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-ink/80">
              Phone number
              <input
                required
                value={guardianForm.phoneNumber}
                onChange={(event) => setGuardianForm((state) => ({ ...state, phoneNumber: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-ink/80">
              Email
              <input
                required
                type="email"
                value={guardianForm.email}
                onChange={(event) => setGuardianForm((state) => ({ ...state, email: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
              />
            </label>
            <label className="text-sm text-ink/80">
              Status
              <select
                value={guardianForm.status}
                onChange={(event) =>
                  setGuardianForm((state) => ({ ...state, status: event.target.value as LifecycleStatus }))
                }
                className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>
            <div className="col-span-full flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-sand bg-white px-3 py-2 text-sm font-semibold text-ink"
                onClick={() => setIsGuardianFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGuardianSaving}
                className="rounded-xl border border-pine/20 bg-pine px-3 py-2 text-sm font-semibold text-cream disabled:opacity-60"
              >
                {isGuardianSaving ? 'Saving...' : 'Save guardian'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {isLinkFormOpen ? (
        <section className="rounded-3xl border border-pine/20 bg-cream/86 p-4 shadow-[0_12px_26px_rgba(43,51,47,0.07)]">
          <h3 className="font-display text-2xl tracking-tight text-ink">Link guardian</h3>
          <form className="mt-3 space-y-3" onSubmit={handleLinkGuardian}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-ink/80">
                Guardian
                <select
                  required
                  value={linkForm.guardianId}
                  onChange={(event) => setLinkForm((state) => ({ ...state, guardianId: event.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                >
                  {unlinkedGuardians.map((guardian) => (
                    <option key={guardian.id} value={guardian.id}>
                      {guardian.firstName} {guardian.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-ink/80">
                Relationship
                <input
                  required
                  value={linkForm.relationshipToChild}
                  onChange={(event) =>
                    setLinkForm((state) => ({ ...state, relationshipToChild: event.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm text-ink"
                />
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-sand/80 bg-white/80 px-3 py-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={linkForm.primaryContact}
                  onChange={(event) => setLinkForm((state) => ({ ...state, primaryContact: event.target.checked }))}
                />
                Primary contact
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-sand/80 bg-white/80 px-3 py-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={linkForm.emergencyContact}
                  onChange={(event) =>
                    setLinkForm((state) => ({ ...state, emergencyContact: event.target.checked }))
                  }
                />
                Emergency contact
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-sand bg-white px-3 py-2 text-sm font-semibold text-ink"
                onClick={() => setIsLinkFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLinkSaving}
                className="rounded-xl border border-pine/20 bg-pine px-3 py-2 text-sm font-semibold text-cream disabled:opacity-60"
              >
                {isLinkSaving ? 'Saving...' : 'Save link'}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
