/** @format */

import { IItem } from '@/types/item';

export async function listarItens(
	access_token: string,
	params?: { status?: string; excluido?: string; tipo?: string },
): Promise<{ ok: boolean; data: IItem[] | null; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const search = new URLSearchParams();
		if (params?.status) search.set('status', params.status);
		if (params?.excluido !== undefined) search.set('excluido', params.excluido);
		if (params?.tipo) search.set('tipo', params.tipo);
		const query = search.toString();
		const url = query ? `${baseURL}itens?${query}` : `${baseURL}itens`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['itens'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok) return { ok: true, data: data as IItem[], error: null };
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
