/** @format */

import { TableSkeleton } from '@/components/data-table';
import { Filtros } from '@/components/filtros';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as itensService from '@/services/itens';
import { IItem } from '@/types/item';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import TabelaBensAccordion from './_components/tabela-bens-accordion';
import FloatCreateItem from './_components/float-create-item';

const LIMITE_PADRAO = 14;

export default async function CadastroDeBensPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<CadastroDeBens searchParams={searchParams} />
		</Suspense>
	);
}

async function CadastroDeBens({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const status = typeof params.status === 'string' ? params.status : '';
	const excluido = typeof params.excluido === 'string' ? params.excluido : 'false';
	const tipo = typeof params.tipo === 'string' ? params.tipo : '';
	const pesquisar = typeof params.pesquisar === 'string' ? params.pesquisar : '';
	const pagina = typeof params.pagina === 'string' ? parseInt(params.pagina, 10) : 1;
	const limite = typeof params.limite === 'string' ? parseInt(params.limite, 10) : LIMITE_PADRAO;

	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const { ok, data: resposta } = await itensService.listarItensPaginado(
		session.access_token,
		{
			status: status || undefined,
			excluido: excluido !== 'false' ? excluido : undefined,
			tipo: tipo || undefined,
			pesquisar: pesquisar.trim() || undefined,
			pagina: Number.isNaN(pagina) ? 1 : pagina,
			limite: Number.isNaN(limite) ? LIMITE_PADRAO : limite,
		},
	);

	const statusSelect = [
		{ label: 'Ativo', value: 'ATIVO' },
		{ label: 'Inativo', value: 'INATIVO' },
	];

	const excluidoSelect = [
		{ label: 'Não excluídos', value: 'false' },
		{ label: 'Excluídos', value: 'true' },
	];

	const dados: IItem[] = ok && resposta ? resposta.data : [];
	const total = ok && resposta ? resposta.total : 0;
	const paginaAtual = ok && resposta ? resposta.pagina : 1;
	const limiteAtual = ok && resposta ? resposta.limite : LIMITE_PADRAO;

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Cadastro de Bens</h1>
			<div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<Filtros
					camposFiltraveis={[
						{
							nome: 'Nº Patrimônio',
							tag: 'pesquisar',
							tipo: 0,
							placeholder: 'Pesquisar por número de patrimônio',
						},
						{
							nome: 'Status',
							tag: 'status',
							tipo: 2,
							valores: statusSelect,
						},
						{
							nome: 'Excluídos',
							tag: 'excluido',
							tipo: 2,
							valores: excluidoSelect,
							default: 'false',
						},
						{
							nome: 'Tipo',
							tag: 'tipo',
							tipo: 0,
							placeholder: 'Filtrar por tipo',
						},
					]}
				/>
				<TabelaBensAccordion dados={dados} accessToken={session.access_token} />
				{dados.length > 0 && (
					<Pagination
						total={total}
						pagina={paginaAtual}
						limite={limiteAtual}
					/>
				)}
			</div>
			<div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
				<FloatCreateItem />
			</div>
		</div>
	);
}
