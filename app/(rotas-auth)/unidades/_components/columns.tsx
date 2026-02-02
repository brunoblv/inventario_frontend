/** @format */

'use client';

import { IUnidade } from '@/types/unidade';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import ModalUnidade from './modal-unidade';
import ModalDeleteUnidade from './modal-delete-unidade';

function UnidadeActions({ unidade }: { unidade: IUnidade }) {
	const router = useRouter();
	return (
		<ModalUnidade
			isUpdating
			unidade={unidade}
			onSuccess={() => router.refresh()}
		/>
	);
}

export const columns: ColumnDef<IUnidade>[] = [
	{
		accessorKey: 'unidades',
		header: 'Unidade',
	},
	{
		accessorKey: 'sigla',
		header: 'Sigla',
	},
	{
		accessorKey: 'codigo',
		header: 'Código',
	},
	{
		accessorKey: 'statusunidade',
		header: () => <p className="text-center">Status</p>,
		cell: ({ row }) => {
			const status = row.original.statusunidade;
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
				key={row.original.id}>
				<UnidadeActions unidade={row.original} />
				<ModalDeleteUnidade id={row.original.id} />
			</div>
		),
	},
];
