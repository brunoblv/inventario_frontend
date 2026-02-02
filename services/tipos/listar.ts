/** @format */

import { ITipo } from '@/types/tipo';

export async function listarTipos(
	access_token: string,
	status?: string,
): Promise<{ ok: boolean; data: ITipo[] | null; error: string | null }> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const url = status
			? `${baseURL}tipos?status=${encodeURIComponent(status)}`
			: `${baseURL}tipos`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			next: { tags: ['tipos'], revalidate: 60 },
		});
		const data = await res.json();
		if (res.ok) return { ok: true, data: data as ITipo[], error: null };
		return {
			ok: false,
			data: null,
			error: data.message ?? 'Erro ao listar tipos',
		};
	} catch (e) {
		return {
			ok: false,
			data: null,
			error: 'Não foi possível listar tipos.',
		};
	}
}
