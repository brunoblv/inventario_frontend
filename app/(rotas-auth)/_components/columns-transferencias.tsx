/** @format */

'use client';

import { ITransferenciaListItem } from '@/types/transferencia';
import { ColumnDef } from '@tanstack/react-table';

function formatarData(val: string | null): string {
	if (!val) return '-';
	try {
		const d = new Date(val);
		if (isNaN(d.getTime())) return val;
		const dia = String(d.getDate()).padStart(2, '0');
		const mes = String(d.getMonth() + 1).padStart(2, '0');
		const ano = d.getFullYear();
		const h = String(d.getHours()).padStart(2, '0');
		const min = String(d.getMinutes()).padStart(2, '0');
		return `${dia}/${mes}/${ano} ${h}:${min}`;
	} catch {
		return val;
	}
}

export const columnsTransferencias: ColumnDef<ITransferenciaListItem>[] = [
	{
		accessorKey: 'datatransf',
		header: 'Data',
		cell: ({ row }) => formatarData(row.original.datatransf),
	},
	{
		accessorKey: 'patrimonio',
		header: 'Nº Patrimônio',
		cell: ({ row }) => row.original.patrimonio ?? '-',
	},
	{
		accessorKey: 'descricaoBem',
		header: 'Descrição do Bem',
		cell: ({ row }) => row.original.descricaoBem ?? '-',
	},
	{
		accessorKey: 'localanterior',
		header: 'Local anterior',
		cell: ({ row }) => row.original.localanterior ?? '-',
	},
	{
		accessorKey: 'localnovo',
		header: 'Local novo',
		cell: ({ row }) => row.original.localnovo ?? '-',
	},
	{
		accessorKey: 'usuario',
		header: 'Usuário',
		cell: ({ row }) => row.original.usuario ?? '-',
	},
];
