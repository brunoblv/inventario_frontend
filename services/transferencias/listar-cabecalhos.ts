/** @format */

import { ITransferenciasCabecalhoListResponse } from '@/types/transferencia';

export async function listarTransferenciasCabecalhos(
	access_token: string,
	params?: { pagina?: number; limite?: number },
): Promise<{
	ok: boolean;
	data: ITransferenciasCabecalhoListResponse | null;
	error: string | null;
}> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const search = new URLSearchParams();
		if (params?.pagina != null) search.set('pagina', String(params.pagina));
		if (params?.limite != null) search.set('limite', String(params.limite));
		const query = search.toString();
		const url = query
			? `${baseURL}transferencias/cabecalhos?${query}`
			: `${baseURL}transferencias/cabecalhos`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['transferencias'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok)
			return { ok: true, data: data as ITransferenciasCabecalhoListResponse, error: null };
		return {
			ok: false,
			data: null,
			error: data.message ?? 'Erro ao listar movimentações',
		};
	} catch (e) {
		return {
			ok: false,
			data: null,
			error: 'Não foi possível listar movimentações.',
		};
	}
}
