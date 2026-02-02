/** @format */

'use client';

import { ITipo } from '@/types/tipo';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import ModalTipo from './modal-tipo';
import ModalDeleteTipo from './modal-delete-tipo';

function TipoActions({ tipo }: { tipo: ITipo }) {
	const router = useRouter();
	return (
		<ModalTipo isUpdating tipo={tipo} onSuccess={() => router.refresh()} />
	);
}

export const columns: ColumnDef<ITipo>[] = [
	{
		accessorKey: 'tipo',
		header: 'Tipo',
	},
	{
		accessorKey: 'statustipo',
		header: () => <p className="text-center">Status</p>,
		cell: ({ row }) => {
			const status = row.original.statustipo;
			const isAtivo = status?.toLowerCase() === 'ativo';
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
				key={row.original.idtipos}>
				<TipoActions tipo={row.original} />
				<ModalDeleteTipo id={row.original.idtipos} />
			</div>
		),
	},
];
