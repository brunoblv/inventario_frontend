/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export interface IItemTransferenciaLote {
	idItem: number;
	servidorAtual?: string;
	nome?: string;
}

export interface ICriarTransferenciaLote {
	localnovo: string;
	cimbpm?: string;
	observacao?: string;
	idusuario?: string;
	itens: IItemTransferenciaLote[];
}

export async function criarTransferenciaLote(
	data: ICriarTransferenciaLote,
): Promise<{ ok: boolean; error: string | null; status: number }> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const response = await fetch(`${baseURL}transferencias/lote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			revalidateTag('itens');
			revalidateTag('transferencias');
			return { ok: true, error: null, status: response.status };
		}
		const dataResponse = await response.json();
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao registrar transferência',
			status: response.status,
		};
	} catch (e) {
		return {
			ok: false,
			error: 'Erro ao registrar transferência',
			status: 500,
		};
	}
}
