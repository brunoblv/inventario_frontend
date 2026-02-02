/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import { auth } from '@/lib/auth/auth';
import * as unidadesService from '@/services/unidades';
import { IUnidade } from '@/types/unidade';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import FloatCreateUnidade from './_components/float-create-unidade';
import { redirect } from 'next/navigation';

export default async function UnidadesPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Unidades searchParams={searchParams} />
		</Suspense>
	);
}

async function Unidades({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { status = '' } = await searchParams;
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const { ok, data: unidades } = await unidadesService.listarUnidades(
		session.access_token,
		typeof status === 'string' ? status : '',
	);

	const statusSelect = [
		{ label: 'Ativo', value: 'ATIVO' },
		{ label: 'Inativo', value: 'INATIVO' },
	];

	const dados: IUnidade[] = ok && unidades ? unidades : [];

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Unidades</h1>
			<div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Status',
							tag: 'status',
							tipo: 2,
							valores: statusSelect,
						},
					]}
				/>
				<DataTable columns={columns} data={dados} />
			</div>
			<div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
				<FloatCreateUnidade />
			</div>
		</div>
	);
}
