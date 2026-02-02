/** @format */

'use client';

import DataTable from '@/components/data-table';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IItem } from '@/types/item';
import { IUnidade } from '@/types/unidade';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowRightLeft } from 'lucide-react';
import { useTransfer } from '@/app/(rotas-auth)/listar-movimentar/_components/transfer-context';
import { ListarMovimentarUserProvider } from '@/app/(rotas-auth)/listar-movimentar/_components/user-context';
import PainelTransferencia from '@/app/(rotas-auth)/listar-movimentar/_components/painel-transferencia';
import { TransferProvider } from '@/app/(rotas-auth)/listar-movimentar/_components/transfer-context';
import { getColumnsMovimentar } from './columns-movimentar';
import { useTransition, useState, useEffect } from 'react';

interface MovimentarConteudoProps {
	dados: IItem[];
	total: number;
	pagina: number;
	limite: number;
	unidades: IUnidade[];
	user: { nome: string; login: string };
	pesquisarInicial: string;
	/** Se definido, após registrar a transferência redireciona para esta URL (ex: /movimentar) */
	redirectOnSuccess?: string;
}

function BotaoAbrirTransferencia() {
	const { itens, setPanelOpen } = useTransfer();
	if (itens.length === 0) return null;
	return (
		<Button
			variant="default"
			size="sm"
			onClick={() => setPanelOpen(true)}
			className="gap-2"
		>
			<ArrowRightLeft className="h-4 w-4" />
			Transferência ({itens.length})
		</Button>
	);
}

function Conteudo({
	dados,
	total,
	pagina,
	limite,
	unidades,
	user,
	pesquisarInicial,
	redirectOnSuccess,
}: MovimentarConteudoProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [pesquisar, setPesquisar] = useState(pesquisarInicial);
	const [isPending, startTransition] = useTransition();
	useEffect(() => {
		setPesquisar(pesquisarInicial);
	}, [pesquisarInicial]);

	function handleBuscar(e: React.FormEvent) {
		e.preventDefault();
		const params = new URLSearchParams(searchParams.toString());
		if (pesquisar.trim()) params.set('pesquisar', pesquisar.trim());
		else params.delete('pesquisar');
		params.set('pagina', '1');
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`);
		});
	}

	function handleSuccess() {
		router.refresh();
		if (redirectOnSuccess) router.push(redirectOnSuccess);
	}

	return (
		<ListarMovimentarUserProvider value={user}>
			<div className="flex flex-col gap-4 my-5 w-full">
				<form onSubmit={handleBuscar} className="flex flex-wrap items-end gap-2">
					<div className="space-y-2 flex-1 min-w-[200px]">
						<Label htmlFor="mov-pesquisar">Patrimônio ou descrição</Label>
						<Input
							id="mov-pesquisar"
							value={pesquisar}
							onChange={(e) => setPesquisar(e.target.value)}
							placeholder="Buscar bens ativos..."
						/>
					</div>
					<Button type="submit" disabled={isPending}>
						{isPending ? 'Buscando...' : 'Buscar'}
					</Button>
					<BotaoAbrirTransferencia />
				</form>

				{dados.length === 0 ? (
					<div className="rounded-md border bg-muted/30 p-8 text-center text-muted-foreground">
						Nenhum bem ativo encontrado. Ajuste o filtro ou cadastre novos bens.
					</div>
				) : (
					<>
						<DataTable columns={getColumnsMovimentar()} data={dados} />
						<Pagination total={total} pagina={pagina} limite={limite} />
					</>
				)}
			</div>
			<PainelTransferencia
				unidades={unidades}
				onSuccess={handleSuccess}
			/>
		</ListarMovimentarUserProvider>
	);
}

export default function MovimentarConteudo(props: MovimentarConteudoProps) {
	return (
		<TransferProvider>
			<Conteudo {...props} />
		</TransferProvider>
	);
}
