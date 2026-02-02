/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function excluirTipo(id: number): Promise<{
	ok: boolean;
	error: string | null;
	status: number;
}> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const response = await fetch(`${baseURL}tipos/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		});
		if (response.ok) {
			revalidateTag('tipos');
			return { ok: true, error: null, status: response.status };
		}
		const dataResponse = await response.json();
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao excluir tipo',
			status: response.status,
		};
	} catch (e) {
		return {
			ok: false,
			error: 'Erro ao excluir tipo',
			status: 500,
		};
	}
}
