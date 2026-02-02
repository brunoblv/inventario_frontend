/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { ITipo, IUpdateTipo } from '@/types/tipo';

export async function atualizarTipo(
	id: number,
	data: IUpdateTipo,
): Promise<{
	ok: boolean;
	error: string | null;
	data: ITipo | null;
	status: number;
}> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const response = await fetch(`${baseURL}tipos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.ok) {
			revalidateTag('tipos');
			return { ok: true, error: null, data: dataResponse as ITipo, status: response.status };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar tipo',
			data: null,
			status: response.status,
		};
	} catch (e) {
		return {
			ok: false,
			error: 'Erro ao atualizar tipo',
			data: null,
			status: 500,
		};
	}
}
