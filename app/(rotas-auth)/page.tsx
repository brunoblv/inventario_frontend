/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as transferenciasService from '@/services/transferencias';
import { ITransferenciaListItem } from '@/types/transferencia';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { columnsTransferencias } from './_components/columns-transferencias';

export default function HomePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Home searchParams={searchParams} />
		</Suspense>
	);
}

async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const pagina = typeof params.pagina === 'string' ? parseInt(params.pagina, 10) : 1;
	const limite = typeof params.limite === 'string' ? parseInt(params.limite, 10) : 14;

	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const res = await transferenciasService.listarTransferencias(
		session.access_token,
		{
			pagina: Number.isNaN(pagina) ? 1 : pagina,
			limite: Number.isNaN(limite) ? 14 : limite,
		},
	);

	const dados: ITransferenciaListItem[] =
		res.ok && res.data ? res.data.data : [];
	const total = res.ok && res.data ? res.data.total : 0;
	const paginaAtual = res.ok && res.data ? res.data.pagina : 1;
	const limiteAtual = res.ok && res.data ? res.data.limite : 14;

	return (
		<div className="w-full relative px-0 md:px-8 pb-10 md:pb-14">
			<h1 className="text-xl md:text-4xl font-bold">Home</h1>
			<p className="text-muted-foreground mt-4 mb-5">
				Últimas movimentações de bens (transferências).
			</p>
			<div className="flex flex-col gap-3 my-5 w-full">
				<DataTable columns={columnsTransferencias} data={dados} />
				{dados.length > 0 && (
					<Pagination
						total={total}
						pagina={paginaAtual}
						limite={limiteAtual}
					/>
				)}
			</div>
		</div>
	);
}
