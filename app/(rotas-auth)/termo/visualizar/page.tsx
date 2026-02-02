/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { ITermoData, TERMO_STORAGE_KEY } from '@/types/termo';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function formatarData(iso: string): string {
	if (!iso) return '';
	const [y, m, d] = iso.split('-');
	return `${d}/${m}/${y}`;
}

export default function TermoVisualizarPage() {
	const router = useRouter();
	const [dados, setDados] = useState<ITermoData | null>(null);
	const printRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const raw = sessionStorage.getItem(TERMO_STORAGE_KEY);
		if (!raw) {
			router.replace('/termo');
			return;
		}
		try {
			const parsed = JSON.parse(raw) as ITermoData;
			setDados(parsed);
		} catch {
			router.replace('/termo');
		}
	}, [router]);

	function imprimir() {
		if (typeof window === 'undefined' || !printRef.current) return;
		const conteudo = printRef.current.innerHTML;
		const janela = window.open('', '_blank');
		if (!janela) return;
		janela.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<title>Termo de Entrega e Retirada</title>
				<style>
					body { font-family: system-ui, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; }
					h1 { text-align: center; font-size: 1.25rem; margin-bottom: 1.5rem; }
					table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
					th, td { border: 1px solid #333; padding: 8px; text-align: left; }
					th { background: #f0f0f0; }
					.secao { margin-top: 1.5rem; }
					.secao-titulo { font-weight: 600; margin-bottom: 0.5rem; }
					.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 0.75rem; }
					.campo { font-size: 0.9rem; }
					.campo-label { color: #555; }
					@media print { body { padding: 0; } .no-print { display: none !important; } }
				</style>
			</head>
			<body>
				${conteudo}
			</body>
			</html>
		`);
		janela.document.close();
		janela.focus();
		setTimeout(() => {
			janela.print();
			janela.close();
		}, 300);
	}

	if (dados === null) {
		return (
			<div className="w-full px-0 md:px-8 pb-10 flex items-center justify-center min-h-[200px]">
				<p className="text-muted-foreground">Carregando termo...</p>
			</div>
		);
	}

	const n = Math.max(
		dados.itensPatrimonio.length,
		dados.itensDescricao.length,
		1,
	);

	return (
		<div className="w-full px-0 md:px-8 pb-10">
			<div className="no-print flex flex-wrap gap-2 mb-6">
				<Button onClick={imprimir}>Imprimir</Button>
				<Button variant="outline" onClick={() => router.push('/termo')}>
					Voltar
				</Button>
			</div>

			<div
				ref={printRef}
				className="bg-background border rounded-lg p-6 md:p-8 max-w-3xl mx-auto print:border-0 print:shadow-none">
				<h1 className="text-center text-xl font-bold mb-6">
					Termo de Entrega e Retirada
				</h1>

				<table className="w-full border-collapse border border-input text-sm">
					<thead>
						<tr>
							<th className="border border-input p-2 text-left bg-muted w-12">
								#
							</th>
							<th className="border border-input p-2 text-left bg-muted">
								Nº Patrimonial / Nº de Série
							</th>
							<th className="border border-input p-2 text-left bg-muted">
								Descrição do Bem
							</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: n }, (_, i) => (
							<tr key={i}>
								<td className="border border-input p-2">{i + 1}</td>
								<td className="border border-input p-2">
									{dados.itensPatrimonio[i] ?? '-'}
								</td>
								<td className="border border-input p-2">
									{dados.itensDescricao[i] ?? '-'}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="secao mt-6">
					<div className="secao-titulo">Entregue em</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
						<div>
							<span className="text-muted-foreground">Data: </span>
							{formatarData(dados.dataEntregue)}
						</div>
						<div>
							<span className="text-muted-foreground">Unidade: </span>
							{dados.unidadeEntregue}
						</div>
						<div>
							<span className="text-muted-foreground">Nome: </span>
							{dados.nomeEntrega}
						</div>
						<div>
							<span className="text-muted-foreground">RF: </span>
							{dados.rfEntrega}
						</div>
					</div>
				</div>

				<div className="secao mt-6">
					<div className="secao-titulo">Recebido em</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
						<div>
							<span className="text-muted-foreground">Data: </span>
							{formatarData(dados.dataRecebimento)}
						</div>
						<div>
							<span className="text-muted-foreground">Unidade: </span>
							{dados.unidadeRecebimento}
						</div>
						<div>
							<span className="text-muted-foreground">Nome: </span>
							{dados.nomeRecebimento}
						</div>
						<div>
							<span className="text-muted-foreground">RF: </span>
							{dados.rfRecebimento}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
