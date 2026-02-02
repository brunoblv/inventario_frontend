/** @format */

'use client';

import { IInventarioItem } from '@/types/inventario';
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

export const columns: ColumnDef<IInventarioItem>[] = [
	{
		accessorKey: 'patrimonio',
		header: 'Nº Patrimônio',
		cell: ({ row }) => row.original.patrimonio ?? '-',
	},
	{
		accessorKey: 'nome',
		header: 'Nome',
		cell: ({ row }) => row.original.nome ?? '-',
	},
	{
		accessorKey: 'descricaoBem',
		header: 'Descrição do Bem',
		cell: ({ row }) => row.original.descricaoBem ?? '-',
	},
	{
		accessorKey: 'localizacao',
		header: 'Localização',
		cell: ({ row }) => row.original.localizacao ?? '-',
	},
	{
		accessorKey: 'servidor',
		header: 'Servidor',
		cell: ({ row }) => row.original.servidor ?? '-',
	},
	{
		accessorKey: 'responsavel',
		header: 'Responsável',
		cell: ({ row }) => row.original.responsavel ?? '-',
	},
	{
		accessorKey: 'cimbpm',
		header: 'CIMBPM',
		cell: ({ row }) => row.original.cimbpm ?? '-',
	},
	{
		accessorKey: 'dataTransf',
		header: 'Data',
		cell: ({ row }) => formatarData(row.original.dataTransf),
	},
];
