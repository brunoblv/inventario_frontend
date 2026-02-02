/** @format */

import { IUnidade } from '@/types/unidade';

export async function listarUnidades(
	access_token: string,
	status?: string,
): Promise<{ ok: boolean; data: IUnidade[] | null; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const url = status
			? `${baseURL}unidades?status=${encodeURIComponent(status)}`
			: `${baseURL}unidades`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['unidades'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok) return { ok: true, data: data as IUnidade[], error: null };
		return {
			ok: false,
			data: null,
			error: data.message ?? 'Erro ao listar unidades',
		};
	} catch (e) {
		return {
			ok: false,
			data: null,
			error: 'Não foi possível listar unidades.',
		};
	}
}
