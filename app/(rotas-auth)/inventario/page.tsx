/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as inventarioService from '@/services/inventario';
import * as unidadesService from '@/services/unidades';
import { IInventarioItem } from '@/types/inventario';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { columns } from './_components/columns';

const ANO_PADRAO = new Date().getFullYear().toString();

export default async function InventarioPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<Inventario searchParams={searchParams} />
		</Suspense>
	);
}

async function Inventario({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const ano = typeof params.ano === 'string' ? params.ano : '';
	const unidade = typeof params.unidade === 'string' ? params.unidade : '';
	const pesquisar = typeof params.pesquisar === 'string' ? params.pesquisar : '';
	const pagina = typeof params.pagina === 'string' ? parseInt(params.pagina, 10) : 1;
	const limite = typeof params.limite === 'string' ? parseInt(params.limite, 10) : 14;

	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const [inventarioRes, unidadesRes] = await Promise.all([
		inventarioService.listarInventario(session.access_token, {
			ano: ano || ANO_PADRAO,
			unidade: unidade || undefined,
			pesquisar: pesquisar || undefined,
			pagina: Number.isNaN(pagina) ? 1 : pagina,
			limite: Number.isNaN(limite) ? 14 : limite,
		}),
		unidadesService.listarUnidades(session.access_token),
	]);

	const unidadeSelect =
		unidadesRes.ok && unidadesRes.data
			? unidadesRes.data.map((u) => ({
					label: u.sigla,
					value: u.sigla,
				}))
			: [];

	const dados: IInventarioItem[] =
		inventarioRes.ok && inventarioRes.data ? inventarioRes.data.data : [];
	const total = inventarioRes.ok && inventarioRes.data ? inventarioRes.data.total : 0;
	const paginaAtual = inventarioRes.ok && inventarioRes.data ? inventarioRes.data.pagina : 1;
	const limiteAtual = inventarioRes.ok && inventarioRes.data ? inventarioRes.data.limite : 14;

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Inventário</h1>
			<div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Ano',
							tag: 'ano',
							tipo: 0,
							placeholder: 'ex: 2024',
							default: ANO_PADRAO,
						},
						{
							nome: 'Unidade',
							tag: 'unidade',
							tipo: 2,
							valores: unidadeSelect,
						},
						{
							nome: 'Buscar',
							tag: 'pesquisar',
							tipo: 0,
							placeholder: 'Patrimônio, nome, localização...',
						},
					]}
				/>
				<DataTable columns={columns} data={dados} />
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
