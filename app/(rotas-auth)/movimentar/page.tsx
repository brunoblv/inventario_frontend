/** @format */

import { TableSkeleton } from '@/components/data-table';
import Pagination from '@/components/pagination';
import { auth } from '@/lib/auth/auth';
import * as transferenciasService from '@/services/transferencias';
import * as unidadesService from '@/services/unidades';
import * as usuariosService from '@/services/usuarios';
import { ITransferenciaCabecalhoListItem } from '@/types/transferencia';
import { IUsuario } from '@/types/usuario';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import BotaoNovaMovimentacao from './_components/botao-nova-movimentacao';
import TabelaMovimentacoesAccordion from './_components/tabela-movimentacoes-accordion';

export default function MovimentarPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<TableSkeleton />}>
			<MovimentarInner searchParams={searchParams} />
		</Suspense>
	);
}

async function MovimentarInner({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const pagina = typeof params.pagina === 'string' ? parseInt(params.pagina, 10) : 1;
	const limite = typeof params.limite === 'string' ? parseInt(params.limite, 10) : 10;

	const session = await auth();
	if (!session?.access_token) redirect('/login');

	const [res, unidadesRes, usuariosRes] = await Promise.all([
		transferenciasService.listarTransferenciasCabecalhos(
			session.access_token,
			{
				pagina: Number.isNaN(pagina) ? 1 : pagina,
				limite: Number.isNaN(limite) ? 10 : limite,
			},
		),
		unidadesService.listarUnidades(session.access_token),
		usuariosService.listaCompleta(session.access_token),
	]);

	const dados: ITransferenciaCabecalhoListItem[] =
		res.ok && res.data ? res.data.data : [];
	const total = res.ok && res.data ? res.data.total : 0;
	const paginaAtual = res.ok && res.data ? res.data.pagina : 1;
	const limiteAtual = res.ok && res.data ? res.data.limite : 10;
	const unidades = unidadesRes.ok && unidadesRes.data ? unidadesRes.data : [];
	const usuarios: IUsuario[] =
		usuariosRes.ok && Array.isArray(usuariosRes.data) ? (usuariosRes.data as IUsuario[]) : [];
	const userLogin = (session as { usuario?: { login?: string } })?.usuario?.login ?? '';

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h1 className="text-xl md:text-4xl font-bold">Movimentar Bens</h1>
					<p className="text-muted-foreground mt-1">
						Lista das movimentações registradas. Cadastre uma nova movimentação para transferir bens entre unidades.
					</p>
				</div>
				<BotaoNovaMovimentacao unidades={unidades} usuarios={usuarios} userLogin={userLogin} />
			</div>
			<div className="flex flex-col gap-3 my-5 w-full">
				{dados.length === 0 ? (
					<div className="rounded-md border bg-muted/30 p-8 text-center text-muted-foreground">
						Nenhuma movimentação registrada. Clique em &quot;Nova movimentação&quot; para cadastrar.
					</div>
				) : (
					<>
						<TabelaMovimentacoesAccordion dados={dados} />
						<Pagination total={total} pagina={paginaAtual} limite={limiteAtual} />
					</>
				)}
			</div>
		</div>
	);
}
