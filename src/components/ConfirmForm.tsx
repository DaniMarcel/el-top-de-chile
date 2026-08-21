'use client';

/** Formulario con confirmación (para acciones destructivas en /admin). */
export default function ConfirmForm({
  action,
  id,
  verified,
  confirmText,
  children,
}: {
  action: string;
  id?: number;
  verified?: number;
  confirmText: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action="/api/admin/actions"
      method="post"
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="action" value={action} />
      {id !== undefined && <input type="hidden" name="id" value={id} />}
      {verified !== undefined && <input type="hidden" name="verified" value={verified} />}
      {children}
    </form>
  );
}
