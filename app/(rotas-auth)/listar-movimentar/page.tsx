/** @format */

import DataTable, { TableSkeleton } from '@/components/data-table';
import { auth } from '@/lib/auth/auth';
import * as itensService from '@/services/itens';
import * as unidadesService from '@/services/unidades';
import * as tiposService from '@/services/tipos';
import { IItem } from '@/types/item';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ListarMovimentarTable from './_components/listar-movimentar-table';

const STATUS_OPCOES = [
	{ label: 'Ativo', value: 'ATIVO' },
	{ label: 'Baixado', value: 'BAIXADO' },
	{ label: 'Para doação', value: 'PARA DOAÇÃO' },
	{ label: 'Para descarte', value: 'PARA DESCARTE' },
	{ label: 'Doado', value: 'DOADO' },
	{ label: 'Descartado', value: 'DESCARTADO' },
	{ label: 'Estoque', value: 'ESTOQUE' },
	{ label: 'Todos', value: 'TODOS' },
];

export default async function ListarMovimentarPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<ListarMovimentar searchParams={searchParams} />
		</Suspense>
	);
}

async function ListarMovimentar({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const status = typeof params.status === 'string' ? params.status : 'ATIVO';
	const unidade = typeof params.unidade === 'string' ? params.unidade : '';
	const tipo = typeof params.tipo === 'string' ? params.tipo : '';
	const pesquisar = typeof params.pesquisar === 'string' ? params.pesquisar : '';
	const pagina = typeof params.pagina === 'string' ? parseInt(params.pagina, 10) : 1;
	const limite = typeof params.limite === 'string' ? parseInt(params.limite, 10) : 10;

	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const [paginadoRes, unidadesRes, tiposRes] = await Promise.all([
		itensService.listarItensPaginado(session.access_token, {
			status: status || 'ATIVO',
			excluido: 'false',
			tipo: tipo || undefined,
			unidade: unidade || undefined,
			pesquisar: pesquisar || undefined,
			pagina: Number.isNaN(pagina) ? 1 : pagina,
			limite: Number.isNaN(limite) ? 10 : limite,
		}),
		unidadesService.listarUnidades(session.access_token),
		tiposService.listarTipos(session.access_token),
	]);

	const dados: IItem[] =
		paginadoRes.ok && paginadoRes.data ? paginadoRes.data.data : [];
	const total = paginadoRes.ok && paginadoRes.data ? paginadoRes.data.total : 0;
	const paginaAtual = paginadoRes.ok && paginadoRes.data ? paginadoRes.data.pagina : 1;
	const limiteAtual = paginadoRes.ok && paginadoRes.data ? paginadoRes.data.limite : 10;
	const unidades = unidadesRes.ok && unidadesRes.data ? unidadesRes.data : [];
	const tipos = tiposRes.ok && tiposRes.data ? tiposRes.data : [];

	const unidadeSelect = unidades.map((u) => ({ label: u.sigla, value: u.sigla }));
	const tipoSelect = tipos.map((t) => ({ label: t.tipo, value: t.tipo }));

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Listar Bens</h1>
			<p className="text-muted-foreground mt-1">
				Consulte, edite ou exclua os bens cadastrados. Para movimentar bens, use a tela Movimentar Bens.
			</p>
			<div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<ListarMovimentarTable
					dados={dados}
					total={total}
					pagina={paginaAtual}
					limite={limiteAtual}
					unidades={unidades}
					statusSelect={STATUS_OPCOES}
					unidadeSelect={unidadeSelect}
					tipoSelect={tipoSelect}
				/>
			</div>
		</div>
	);
}
