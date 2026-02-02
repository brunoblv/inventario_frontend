/** @format */

'use client';

import { IItem } from '@/types/item';
import { IUnidade } from '@/types/unidade';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import ModalItem from '@/app/(rotas-auth)/cadastro-de-bens/_components/modal-item';
import ModalDeleteItem from '@/app/(rotas-auth)/cadastro-de-bens/_components/modal-delete-item';

function ItemActions({ item, unidades }: { item: IItem; unidades: IUnidade[] }) {
	const router = useRouter();
	return (
		<div className="flex gap-2 items-center justify-center">
			<ModalItem isUpdating item={item} onSuccess={() => router.refresh()} />
			{item.statusitem?.toUpperCase() === 'ATIVO' && (
				<ModalDeleteItem id={item.idbem} />
			)}
		</div>
	);
}

export function getColumns(unidades: IUnidade[]): ColumnDef<IItem>[] {
	return [
	{ accessorKey: 'patrimonio', header: 'Nº Patrimônio', cell: ({ row }) => row.original.patrimonio ?? '-' },
	{ accessorKey: 'nome', header: 'Nome', cell: ({ row }) => row.original.nome ?? '-' },
	{ accessorKey: 'marca', header: 'Marca', cell: ({ row }) => row.original.marca ?? '-' },
	{ accessorKey: 'tipo', header: 'Tipo', cell: ({ row }) => row.original.tipo ?? '-' },
	{ accessorKey: 'descsbpm', header: 'Desc. SBPM', cell: ({ row }) => row.original.descsbpm ?? '-' },
	{ accessorKey: 'modelo', header: 'Modelo', cell: ({ row }) => row.original.modelo ?? '-' },
	{ accessorKey: 'numserie', header: 'Núm. Série', cell: ({ row }) => row.original.numserie ?? '-' },
	{ accessorKey: 'localizacao', header: 'Localização', cell: ({ row }) => row.original.localizacao ?? '-' },
	{ accessorKey: 'servidor', header: 'Servidor', cell: ({ row }) => row.original.servidor ?? '-' },
	{ accessorKey: 'numprocesso', header: 'Num. Processo', cell: ({ row }) => row.original.numprocesso ?? '-' },
	{ accessorKey: 'cimbpm', header: 'CIMBPM', cell: ({ row }) => row.original.cimbpm ?? '-' },
	{
		accessorKey: 'statusitem',
		header: () => <p className="text-center">Status</p>,
		cell: ({ row }) => {
			const status = row.original.statusitem;
			const isAtivo = status?.toUpperCase() === 'ATIVO';
			return (
				<div className="flex items-center justify-center">
					<Badge variant={isAtivo ? 'default' : 'secondary'}>{status ?? '-'}</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className="text-center">Ações</p>,
		cell: ({ row }) => (
			<ItemActions item={row.original} unidades={unidades} />
		),
	},
	];
}
