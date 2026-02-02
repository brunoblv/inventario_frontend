/** @format */

import { IItem } from '@/types/item';

export interface IItensPaginado {
	data: IItem[];
	total: number;
	pagina: number;
	limite: number;
}

export async function listarItensPaginado(
	access_token: string,
	params: {
		status?: string;
		excluido?: string;
		tipo?: string;
		unidade?: string;
		pesquisar?: string;
		pagina?: number;
		limite?: number;
	},
): Promise<{ ok: boolean; data: IItensPaginado | null; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const search = new URLSearchParams();
		if (params.status) search.set('status', params.status);
		if (params.excluido !== undefined) search.set('excluido', params.excluido);
		if (params.tipo) search.set('tipo', params.tipo);
		if (params.unidade) search.set('unidade', params.unidade);
		if (params.pesquisar) search.set('pesquisar', params.pesquisar);
		if (params.pagina != null) search.set('pagina', String(params.pagina));
		if (params.limite != null) search.set('limite', String(params.limite));
		const query = search.toString();
		const url = `${baseURL}itens?${query}`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['itens'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok) return { ok: true, data: data as IItensPaginado, error: null };
		return {
			ok: false,
			data: null,
			error: data.message ?? 'Erro ao listar bens',
		};
	} catch (e) {
		return {
			ok: false,
			data: null,
			error: 'Não foi possível listar bens.',
		};
	}
}
