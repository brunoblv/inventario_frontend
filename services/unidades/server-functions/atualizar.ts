/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { IUnidade, IUpdateUnidade } from '@/types/unidade';

export async function atualizarUnidade(
	id: number,
	data: IUpdateUnidade,
): Promise<{
	ok: boolean;
	error: string | null;
	data: IUnidade | null;
	status: number;
}> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const response = await fetch(`${baseURL}unidades/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.ok) {
			revalidateTag('unidades');
			return { ok: true, error: null, data: dataResponse as IUnidade, status: response.status };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao atualizar unidade',
			data: null,
			status: response.status,
		};
	} catch (e) {
		return {
			ok: false,
			error: 'Erro ao atualizar unidade',
			data: null,
			status: 500,
		};
	}
}
