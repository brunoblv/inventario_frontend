/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import { auth } from '@/lib/auth/auth';
import * as tiposService from '@/services/tipos';
import { ITipo } from '@/types/tipo';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import FloatCreateTipo from './_components/float-create-tipo';

export default async function TiposDeBensPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<TiposDeBens searchParams={searchParams} />
		</Suspense>
	);
}

async function TiposDeBens({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { status = '' } = await searchParams;
	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const { ok, data: tipos } = await tiposService.listarTipos(
		session.access_token,
		typeof status === 'string' ? status : '',
	);

	const statusSelect = [
		{ label: 'Ativo', value: 'Ativo' },
		{ label: 'Inativo', value: 'Inativo' },
	];

	const dados: ITipo[] = ok && tipos ? tipos : [];

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Tipos de Bens</h1>
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
				<FloatCreateTipo />
			</div>
		</div>
	);
}
