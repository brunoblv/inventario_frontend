/** @format */

'use client';

import { IItem } from '@/types/item';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import ModalItem from './modal-item';
import ModalDeleteItem from './modal-delete-item';

function ItemActions({ item }: { item: IItem }) {
	const router = useRouter();
	return (
		<ModalItem
			isUpdating
			item={item}
			onSuccess={() => router.refresh()}
		/>
	);
}

export const columns: ColumnDef<IItem>[] = [
	{
		accessorKey: 'patrimonio',
		header: 'Patrimônio',
		cell: ({ row }) => row.original.patrimonio ?? '-',
	},
	{
		accessorKey: 'tipo',
		header: 'Tipo',
		cell: ({ row }) => (
			<Badge variant="secondary" className="font-normal">
				{row.original.tipo ?? '-'}
			</Badge>
		),
	},
	{
		accessorKey: 'marca',
		header: 'Marca',
		cell: ({ row }) => row.original.marca ?? '-',
	},
	{
		accessorKey: 'modelo',
		header: 'Modelo',
		cell: ({ row }) => row.original.modelo ?? '-',
	},
	{
		accessorKey: 'localizacao',
		header: 'Localização',
		cell: ({ row }) => row.original.localizacao ?? '-',
	},
	{
		accessorKey: 'statusitem',
		header: () => <p className="text-center">Status</p>,
		cell: ({ row }) => {
			const status = row.original.statusitem;
			const isAtivo = status?.toUpperCase() === 'ATIVO';
			return (
				<div className="flex items-center justify-center">
					<Badge variant={isAtivo ? 'default' : 'secondary'}>
						{status ?? '-'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className="text-center">Ações</p>,
		cell: ({ row }) => (
			<div
				className="flex gap-2 items-center justify-center"
				key={row.original.idbem}>
				<ItemActions item={row.original} />
				<ModalDeleteItem id={row.original.idbem} />
			</div>
		),
	},
];
