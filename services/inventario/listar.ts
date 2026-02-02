/** @format */

import { IInventarioPaginado } from '@/types/inventario';

export async function listarInventario(
	access_token: string,
	params: {
		ano?: string;
		unidade?: string;
		pesquisar?: string;
		pagina?: number;
		limite?: number;
	},
): Promise<{ ok: boolean; data: IInventarioPaginado | null; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const search = new URLSearchParams();
		if (params.ano) search.set('ano', params.ano);
		if (params.unidade) search.set('unidade', params.unidade);
		if (params.pesquisar) search.set('pesquisar', params.pesquisar);
		if (params.pagina != null) search.set('pagina', String(params.pagina));
		if (params.limite != null) search.set('limite', String(params.limite));
		const query = search.toString();
		const url = query ? `${baseURL}inventario?${query}` : `${baseURL}inventario`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['inventario'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok) return { ok: true, data: data as IInventarioPaginado, error: null };
		return {
			ok: false,
			data: null,
			error: data.message ?? 'Erro ao listar inventário',
		};
	} catch (e) {
		return {
			ok: false,
			data: null,
			error: 'Não foi possível listar inventário.',
		};
	}
}
