/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import * as itensService from '@/services/itens';
import { IItem } from '@/types/item';

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
