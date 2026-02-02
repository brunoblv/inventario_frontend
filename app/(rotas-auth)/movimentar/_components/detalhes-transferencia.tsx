/** @format */

'use client';

import { useEffect, useState } from 'react';
import { getTransferenciaDetalhes } from '../actions';
import { ITransferenciaCabecalhoDetalhe } from '@/types/transferencia';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

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

interface DetalhesTransferenciaProps {
	id: number;
}

export default function DetalhesTransferencia({ id }: DetalhesTransferenciaProps) {
	const [detalhe, setDetalhe] = useState<ITransferenciaCabecalhoDetalhe | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		getTransferenciaDetalhes(id).then((data) => {
			if (!cancelled) {
				setDetalhe(data ?? null);
				setLoading(false);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
				<Loader2 className="h-5 w-5 animate-spin" />
				<span>Carregando detalhes...</span>
			</div>
		);
	}

	if (!detalhe) {
		return (
			<div className="py-4 text-center text-muted-foreground text-sm">
				Não foi possível carregar os detalhes da transferência.
			</div>
		);
	}

	return (
		<div className="py-3 px-2 bg-muted/30 rounded-md">
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
				<div>
					<span className="text-muted-foreground">Data: </span>
					{formatarData(detalhe.dataTransferencia)}
				</div>
				<div>
					<span className="text-muted-foreground">Unidade destino: </span>
					{detalhe.unidadeDestino ?? '-'}
				</div>
				<div>
					<span className="text-muted-foreground">Usuário: </span>
					{detalhe.usuario ?? '-'}
				</div>
				<div>
					<span className="text-muted-foreground">CIMBPM: </span>
					{detalhe.cimbpm ?? '-'}
				</div>
				{detalhe.observacao && (
					<div className="col-span-2 sm:col-span-4">
						<span className="text-muted-foreground">Observação: </span>
						{detalhe.observacao}
					</div>
				)}
			</div>
			{detalhe.itens.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow className="border-muted hover:bg-muted/50">
							<TableHead className="text-xs">Patrimônio</TableHead>
							<TableHead className="text-xs">Tipo do item</TableHead>
							<TableHead className="text-xs">Marca</TableHead>
							<TableHead className="text-xs">Número de série</TableHead>
							<TableHead className="text-xs">Servidor responsável</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{detalhe.itens.map((item, idx) => (
							<TableRow key={idx} className="border-muted">
								<TableCell className="text-xs py-2">
									{item.patrimonio ?? '-'}
								</TableCell>
								<TableCell className="text-xs py-2">
									{item.tipo ?? '-'}
								</TableCell>
								<TableCell className="text-xs py-2">
									{item.marca ?? '-'}
								</TableCell>
								<TableCell className="text-xs py-2">
									{item.numserie ?? '-'}
								</TableCell>
								<TableCell className="text-xs py-2">
									{item.servidorAtual ?? '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<p className="text-sm text-muted-foreground">Nenhum item nesta transferência.</p>
			)}
		</div>
	);
}
