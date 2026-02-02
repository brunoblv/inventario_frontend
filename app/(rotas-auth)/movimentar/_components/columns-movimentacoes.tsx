/** @format */

'use client';

import { ITransferenciaCabecalhoListItem } from '@/types/transferencia';
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

export const columnsMovimentacoes: ColumnDef<ITransferenciaCabecalhoListItem>[] = [
	{
		accessorKey: 'dataTransferencia',
		header: 'Data',
		cell: ({ row }) => formatarData(row.original.dataTransferencia),
	},
	{
		accessorKey: 'unidadeDestino',
		header: 'Unidade destino',
		cell: ({ row }) => row.original.unidadeDestino ?? '-',
	},
	{
		accessorKey: 'usuario',
		header: 'Usuário',
		cell: ({ row }) => row.original.usuario ?? '-',
	},
	{
		accessorKey: 'qtdItens',
		header: () => <span className="text-center block">Qtd. itens</span>,
		cell: ({ row }) => (
			<div className="text-center">{row.original.qtdItens}</div>
		),
	},
	{
		accessorKey: 'cimbpm',
		header: 'CIMBPM',
		cell: ({ row }) => row.original.cimbpm ?? '-',
	},
];
