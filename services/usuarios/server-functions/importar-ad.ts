/** @format */

'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { IImportarADResponse } from '@/types/usuario';

export async function importarUsuariosAD(): Promise<{
	ok: boolean;
	error: string | null;
	data: IImportarADResponse | null;
}> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const res = await fetch(`${baseURL}usuarios/importar-ad`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
		});
		const data = await res.json();
		if (res.ok) {
			revalidateTag('users');
			return { ok: true, error: null, data: data as IImportarADResponse };
		}
		return {
			ok: false,
			error: data.message ?? 'Erro ao importar usuários do AD.',
			data: null,
		};
	} catch {
		return {
			ok: false,
			error: 'Não foi possível conectar ao servidor.',
			data: null,
		};
	}
}
