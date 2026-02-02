/** @format */

'use client';

import { IItem } from '@/types/item';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTransfer } from '@/app/(rotas-auth)/listar-movimentar/_components/transfer-context';

function BotaoAdicionarItem({ item }: { item: IItem }) {
	const { addItem, itens } = useTransfer();
	const jaAdicionado = itens.some((x) => x.item.idbem === item.idbem);
	return (
		<Button
			size="sm"
			variant="outline"
			className="gap-1"
			title="Adicionar à transferência"
			onClick={() => addItem(item)}
			disabled={jaAdicionado}
		>
			<Plus className="h-4 w-4" />
			{jaAdicionado ? 'Adicionado' : 'Adicionar'}
		</Button>
	);
}

export function getColumnsMovimentar(): ColumnDef<IItem>[] {
	return [
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
			accessorKey: 'tipo',
			header: 'Tipo',
			cell: ({ row }) => row.original.tipo ?? '-',
		},
		{
			accessorKey: 'localizacao',
			header: 'Localização',
			cell: ({ row }) => row.original.localizacao ?? '-',
		},
		{
			id: 'actions',
			header: () => <span className="text-center block">Ação</span>,
			cell: ({ row }) => (
				<div className="flex justify-center">
					<BotaoAdicionarItem item={row.original} />
				</div>
			),
		},
	];
}
