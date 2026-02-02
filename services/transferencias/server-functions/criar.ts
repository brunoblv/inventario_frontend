/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ICriarTransferencia {
	iditem: number;
	localnovo: string;
	servidoratual?: string;
	cimbpm?: string;
	nome?: string;
	statusitem?: string;
	usuario?: string;
	idusuario?: string;
}

export async function criarTransferencia(
	data: ICriarTransferencia,
): Promise<{ ok: boolean; error: string | null; status: number }> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const response = await fetch(`${baseURL}transferencias`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			revalidateTag('itens');
			return { ok: true, error: null, status: response.status };
		}
		const dataResponse = await response.json();
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao movimentar bem',
			status: response.status,
		};
	} catch (e) {
		return {
			ok: false,
			error: 'Erro ao movimentar bem',
			status: 500,
		};
	}
}
