/** @format */

import { IDashboardEstatisticas } from '@/types/dashboard';

export async function getEstatisticasDashboard(
	access_token: string,
	tipo: string,
): Promise<{ ok: boolean; data: IDashboardEstatisticas | null; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const url = `${baseURL}dashboard/estatisticas?tipo=${encodeURIComponent(tipo)}`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['dashboard'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok) return { ok: true, data: data as IDashboardEstatisticas, error: null };
		return {
			ok: false,
			data: null,
			error: data.message ?? 'Erro ao carregar estatísticas',
		};
	} catch (e) {
		return {
			ok: false,
			data: null,
			error: 'Não foi possível carregar estatísticas.',
		};
	}
}
