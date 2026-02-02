/** @format */

'use client';

import { IItem } from '@/types/item';
import { useState, Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ModalItem from './modal-item';
import ModalDeleteItem from './modal-delete-item';
import { listarHistoricoPorItem } from '@/services/transferencias';
import { IHistoricoItemMovimentacao } from '@/types/transferencia';

interface TabelaBensAccordionProps {
	dados: IItem[];
	accessToken: string;
}

export default function TabelaBensAccordion({ dados, accessToken }: TabelaBensAccordionProps) {
	const router = useRouter();
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [historico, setHistorico] = useState<IHistoricoItemMovimentacao[]>([]);
	const [historicoLoading, setHistoricoLoading] = useState(false);

	useEffect(() => {
		if (!expandedId || !accessToken) {
			setHistorico([]);
			setHistoricoLoading(false);
			return;
		}
		let cancelled = false;
		setHistoricoLoading(true);
		listarHistoricoPorItem(accessToken, expandedId).then(({ ok, data }) => {
			if (!cancelled) setHistorico(ok && data ? data : []);
			setHistoricoLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [expandedId, accessToken]);

	function toggle(id: number) {
		setExpandedId((prev) => (prev === id ? null : id));
	}

	function formatarData(s: string | null) {
		if (!s) return '-';
		try {
			const d = new Date(s);
			return d.toLocaleDateString('pt-BR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return s;
		}
	}

	return (
		<div className="rounded-md">
			<Table className="bg-background dark:bg-muted/50 border">
				<TableHeader className="bg-primary hover:bg-primary">
					<TableRow className="hover:bg-primary">
						<TableHead className="text-white text-xs text-nowrap w-10" />
						<TableHead className="text-white text-xs text-nowrap">Patrimônio</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Tipo</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Marca</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Modelo</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Localização</TableHead>
						<TableHead className="text-white text-xs text-nowrap text-center">Status</TableHead>
						<TableHead className="text-white text-xs text-nowrap text-center">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{dados.map((row) => (
						<Fragment key={row.idbem}>
							<TableRow
								className={cn(
									'px-4 cursor-pointer hover:bg-muted/50',
									expandedId === row.idbem && 'bg-muted/30',
								)}
								onClick={() => toggle(row.idbem)}
							>
								<TableCell className="text-sm px-2 w-10">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={(e) => {
											e.stopPropagation();
											toggle(row.idbem);
										}}
									>
										{expandedId === row.idbem ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</Button>
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.patrimonio ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									<Badge variant="secondary" className="font-normal">
										{row.tipo ?? '-'}
									</Badge>
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.marca ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.modelo ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.localizacao ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light text-center">
									<Badge
										variant={row.statusitem?.toUpperCase() === 'ATIVO' ? 'default' : 'secondary'}
									>
										{row.statusitem ?? '-'}
									</Badge>
								</TableCell>
								<TableCell className="text-sm px-4" onClick={(e) => e.stopPropagation()}>
									<div className="flex gap-2 items-center justify-center">
										<ModalItem isUpdating item={row} onSuccess={() => router.refresh()} />
										<ModalDeleteItem id={row.idbem} />
									</div>
								</TableCell>
							</TableRow>
							{expandedId === row.idbem && (
								<TableRow className="bg-muted/20">
									<TableCell colSpan={8} className="p-0 align-top">
										<div className="px-4 pb-3 pt-1 space-y-3">
											<div className="py-3 px-2 bg-muted/30 rounded-md">
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
													<div>
														<span className="text-muted-foreground">Nome: </span>
														{row.nome ?? '-'}
													</div>
													<div>
														<span className="text-muted-foreground">Desc. SBPM: </span>
														{row.descsbpm ?? '-'}
													</div>
													<div>
														<span className="text-muted-foreground">Nº série: </span>
														{row.numserie ?? '-'}
													</div>
													<div>
														<span className="text-muted-foreground">Tipo SBPM: </span>
														{row.tiposbpm ?? '-'}
													</div>
													<div>
														<span className="text-muted-foreground">Nº processo: </span>
														{row.numprocesso ?? '-'}
													</div>
													<div>
														<span className="text-muted-foreground">CIMBPM: </span>
														{row.cimbpm ?? '-'}
													</div>
													<div>
														<span className="text-muted-foreground">Servidor: </span>
														{row.servidor ?? '-'}
													</div>
												</div>
											</div>
											<div className="py-3 px-2 bg-muted/30 rounded-md">
												<h4 className="text-sm font-semibold mb-2">Histórico de movimentações</h4>
												{historicoLoading ? (
													<p className="text-sm text-muted-foreground">Carregando...</p>
												) : historico.length === 0 ? (
													<p className="text-sm text-muted-foreground">Nenhuma movimentação registrada.</p>
												) : (
													<div className="space-y-2">
														{historico.map((mov) => (
															<div
																key={mov.id}
																className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1 text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
																<div>
																	<span className="text-muted-foreground">Data: </span>
																	{formatarData(mov.dataTransferencia)}
																</div>
																<div>
																	<span className="text-muted-foreground">Unidade destino: </span>
																	{mov.unidadeDestino ?? '-'}
																</div>
																<div>
																	<span className="text-muted-foreground">Registrado por: </span>
																	{mov.usuarioRegistro ?? '-'}
																</div>
																<div>
																	<span className="text-muted-foreground">Servidor anterior: </span>
																	{mov.servidorAnterior ?? '-'}
																</div>
																<div>
																	<span className="text-muted-foreground">Servidor atual: </span>
																	{mov.servidorAtual ?? '-'}
																</div>
																{mov.cimbpm && (
																	<div className="sm:col-span-2">
																		<span className="text-muted-foreground">CIMBPM: </span>
																		{mov.cimbpm}
																	</div>
																)}
																{mov.nomeResponsavel && (
																	<div className="sm:col-span-2">
																		<span className="text-muted-foreground">Responsável: </span>
																		{mov.nomeResponsavel}
																	</div>
																)}
															</div>
														))}
													</div>
												)}
											</div>
										</div>
									</TableCell>
								</TableRow>
							)}
						</Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
