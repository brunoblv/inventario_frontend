/** @format */

'use client';

import { ITransferenciaListItem } from '@/types/transferencia';
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

interface TabelaTransferenciasAccordionProps {
	dados: ITransferenciaListItem[];
}

function formatarData(val: string | null): string {
	if (!val) return '-';
	try {
		const d = new Date(val);
		if (isNaN(d.getTime())) return String(val);
		return d.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	} catch {
		return String(val);
	}
}

export default function TabelaTransferenciasAccordion({
	dados,
}: TabelaTransferenciasAccordionProps) {
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
						<TableHead className="text-white text-xs text-nowrap">Nº Patrimônio</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Descrição do Bem</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Local anterior</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Local novo</TableHead>
						<TableHead className="text-white text-xs text-nowrap">Usuário</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{dados.map((row) => (
						<Fragment key={row.id}>
							<TableRow
								className={cn(
									'cursor-pointer hover:bg-muted/50',
									expandedId === row.id && 'bg-muted/30',
								)}
								onClick={() => toggle(row.id)}
							>
								<TableCell className="text-sm px-2 w-10">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
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
								<TableCell className="text-sm px-2">
									{formatarData(row.datatransf)}
								</TableCell>
								<TableCell className="text-sm px-2">
									{row.patrimonio ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-2">
									{row.descricaoBem ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-2">
									{row.localanterior ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-2">
									{row.localnovo ?? '-'}
								</TableCell>
								<TableCell className="text-sm px-2">
									{row.usuario ?? '-'}
								</TableCell>
							</TableRow>
							{expandedId === row.id && (
								<TableRow className="bg-muted/20 hover:bg-muted/20">
									<TableCell colSpan={7} className="p-0">
										<div className="px-4 py-3 border-t border-border">
											<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
												<div>
													<span className="text-muted-foreground font-medium">Data: </span>
													{formatarData(row.datatransf)}
												</div>
												<div>
													<span className="text-muted-foreground font-medium">Nº Patrimônio: </span>
													{row.patrimonio ?? '-'}
												</div>
												<div>
													<span className="text-muted-foreground font-medium">Descrição do Bem: </span>
													{row.descricaoBem ?? '-'}
												</div>
												<div>
													<span className="text-muted-foreground font-medium">Local anterior: </span>
													{row.localanterior ?? '-'}
												</div>
												<div>
													<span className="text-muted-foreground font-medium">Local novo: </span>
													{row.localnovo ?? '-'}
												</div>
												<div>
													<span className="text-muted-foreground font-medium">Usuário (registrado por): </span>
													{row.usuario ?? '-'}
												</div>
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
