import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import ConfirmForm from '@/components/ConfirmForm';
import { getAllStores, getCategories, getStats } from '@/lib/board';
import { clp } from '@/lib/format';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authed = cookieStore.get('eltrono_admin')?.value === '1';

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm pt-20">
        <form action="/api/admin/login" method="post" className="card space-y-4 p-6">
          <h1 className="text-center text-2xl font-bold">Admin</h1>
          <input
            type="password"
            name="token"
            required
            placeholder="ADMIN_TOKEN"
            className="input"
          />
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const stats = await getStats();
  const stores = await getAllStores();
  const cats = await getCategories();
  const catName = (id: number) => cats.find((c) => c.id === id)?.name ?? '?';

  return (
    <div className="mx-auto max-w-5xl space-y-8 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin</h1>
        <ConfirmForm action="purge" confirmText="¿Borrar todas las tiendas demo? (los pagos reales no se tocan)">
          <input type="hidden" name="confirm" value="si" />
          <button
            type="submit"
            className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors"
          >
            Purgar demo
          </button>
        </ConfirmForm>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ['Recaudado', clp(stats.revenue)],
          ['Pagos', String(stats.paidCount)],
          ['Pendientes', String(stats.pendingCount)],
          ['Tiendas', `${stats.storeCount} (${stats.onBoardCount} en ranking)`],
        ].map(([label, value]) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-mut">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line px-5 py-3 text-xs font-bold uppercase tracking-wider text-mut">
          Tiendas
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-mut">
                <th className="px-5 py-3">Tienda</th>
                <th className="px-3 py-3">Rubro</th>
                <th className="px-3 py-3">Pos</th>
                <th className="px-3 py-3">Precio</th>
                <th className="px-3 py-3">Verif</th>
                <th className="px-3 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-card2 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={'/tienda/' + s.slug} className="font-semibold hover:text-accent transition-colors">
                      {s.name}
                    </Link>
                    {!!s.is_demo && (
                      <span className="badge-demo ml-2">demo</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-mut">{catName(s.category_id)}</td>
                  <td className="px-3 py-3">{s.position ?? '—'}</td>
                  <td className="px-3 py-3 font-semibold">
                    {s.current_price ? clp(s.current_price) : '—'}
                  </td>
                  <td className="px-3 py-3">
                    {!!s.verified ? (
                      <span className="font-semibold text-lime">✓ sí</span>
                    ) : (
                      <span className="text-mut">no</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <form action="/api/admin/actions" method="post">
                        <input type="hidden" name="action" value="verify" />
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="verified" value={s.verified ? '0' : '1'} />
                        <button
                          type="submit"
                          className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium hover:border-lime hover:text-lime transition-colors"
                        >
                          {s.verified ? 'Quitar ✓' : 'Verificar'}
                        </button>
                      </form>
                      <ConfirmForm
                        action="delete"
                        id={s.id}
                        confirmText={'¿Borrar ' + s.name + ' y su historial?'}
                      >
                        <button
                          type="submit"
                          className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-red-500 hover:border-red-400 transition-colors"
                        >
                          🗑
                        </button>
                      </ConfirmForm>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-mut">
        La verificación es manual: revisa que la URL sea real y dale ✓. El badge «verificada» se
        muestra en el ranking, la ficha de la tienda y el widget.
      </p>
    </div>
  );
}
