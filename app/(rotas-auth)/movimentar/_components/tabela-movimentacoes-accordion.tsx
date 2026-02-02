/** @format */

'use client';

import { ITransferenciaCabecalhoListItem } from '@/types/transferencia';
import { useState, Fragment } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import DetalhesTransferencia from './detalhes-transferencia';

function formatarData(val: string | null): string {
	if (!val) return '-';
	try {
		const d = new Date(val);
		if (isNaN(d.getTime())) return val;
		const dia = String(d.getDate()).padStart(2, '0');
		const mes = String(d.getMonth() + 1).padStart(2, '0');
		const ano = d.getFullYear();
		const h = String(d.getHours()).padStart(2, '0');
		const min = String(d.getMinutes()).padStart(2, '0');
		return `${dia}/${mes}/${ano} ${h}:${min}`;
	} catch {
		return val;
	}
}

interface TabelaMovimentacoesAccordionProps {
	dados: ITransferenciaCabecalhoListItem[];
}

export default function TabelaMovimentacoesAccordion({
	dados,
}: TabelaMovimentacoesAccordionProps) {
	const [expandedId, setExpandedId] = useState<number | null>(null);

	function toggle(id: number) {
		setExpandedId((prev) => (prev === id ? null : id));
	}

	return (
		<div className="rounded-md">
			<Table className="bg-background dark:bg-muted/50 border">
				<TableHeader className="bg-primary hover:bg-primary">
					<TableRow className="hover:bg-primary">
						<TableHead className="text-white text-xs text-nowrap w-10" />
						<TableHead className="text-white text-xs text-nowrap">Data</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Unidade destino</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Usuário</TableHead>
						<TableHead className="text-white text-xs text-nowrap text-center">Qtd. itens</TableHead>
						<TableHead className="text-white text-xs text-nowrap">CIMBPM</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{dados.map((row) => (
						<Fragment key={row.id}>
							<TableRow
								key={row.id}
								className={cn(
									'px-4 cursor-pointer hover:bg-muted/50',
									expandedId === row.id && 'bg-muted/30',
								)}
								onClick={() => toggle(row.id)}
							>
								<TableCell className="text-sm px-2 w-10">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										onClick={(e) => {
											e.stopPropagation();
											toggle(row.id);
										}}
									>
										{expandedId === row.id ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</Button>
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{formatarData(row.dataTransferencia)}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.unidadeDestino ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.usuario ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light text-center">
									{row.qtdItens}
								</TableCell>
								<TableCell className="text-sm px-4 text-nowrap font-light">
									{row.cimbpm ?? '-'}
								</TableCell>
							</TableRow>
							{expandedId === row.id && (
								<TableRow className="bg-muted/20">
									<TableCell colSpan={6} className="p-0 align-top">
										<div className="px-4 pb-3 pt-1">
											<DetalhesTransferencia id={row.id} />
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
