/** @format */

import { IHistoricoItemMovimentacao } from '@/types/transferencia';

export async function listarHistoricoPorItem(
	access_token: string,
	idbem: number,
): Promise<{ ok: boolean; data: IHistoricoItemMovimentacao[]; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${baseURL}transferencias/historico-item/${idbem}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		});
		const data = await res.json();
		if (res.ok && Array.isArray(data))
			return { ok: true, data: data as IHistoricoItemMovimentacao[], error: null };
		return {
			ok: false,
			data: [],
			error: data.message ?? 'Erro ao carregar histórico',
		};
	} catch {
		return { ok: false, data: [], error: 'Não foi possível carregar o histórico.' };
	}
}
