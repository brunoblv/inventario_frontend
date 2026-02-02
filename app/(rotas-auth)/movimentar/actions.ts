/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import * as itensService from '@/services/itens';
import { IItem } from '@/types/item';
import { ITransferenciaCabecalhoDetalhe } from '@/types/transferencia';

export async function buscarItensPorPatrimonio(
	patrimonio: string,
): Promise<IItem[]> {
	const session = await auth();
	if (!session?.access_token || !patrimonio?.trim()) return [];
	const res = await itensService.listarItensPaginado(session.access_token, {
		status: 'ATIVO',
		excluido: 'false',
		pesquisar: patrimonio.trim(),
		pagina: 1,
		limite: 10,
	});
	if (!res.ok || !res.data) return [];
	return res.data.data;
}

export async function getTransferenciaDetalhes(
	id: number,
): Promise<ITransferenciaCabecalhoDetalhe | null> {
	const session = await auth();
	if (!session?.access_token) return null;
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${baseURL}transferencias/cabecalhos/${id}`, {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
			cache: 'no-store',
		});
		if (!res.ok) return null;
		const data = await res.json();
		return data as ITransferenciaCabecalhoDetalhe;
	} catch {
		return null;
	}
}
