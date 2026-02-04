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

function formatarDataHoraCabecalho(): string {
	const now = new Date();
	const d = String(now.getDate()).padStart(2, '0');
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const a = now.getFullYear();
	const h = String(now.getHours()).padStart(2, '0');
	const min = String(now.getMinutes()).padStart(2, '0');
	return `${d}/${m}/${a}, ${h}:${min}`;
}

export default function TermoVisualizarPage() {
	const router = useRouter();
	const [dados, setDados] = useState<ITermoData | null>(null);
	const printRef = useRef<HTMLDivElement>(null);
	const rodapeDataRef = useRef<HTMLSpanElement>(null);

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
		if (typeof window === 'undefined') return;
		const dataHora = formatarDataHoraCabecalho();
		if (rodapeDataRef.current) {
			rodapeDataRef.current.textContent = dataHora;
		}
		window.print();
	}

	if (dados === null) {
		return (
			<div className="w-full px-0 md:px-8 pb-10 flex items-center justify-center min-h-[200px]">
				<p className="text-muted-foreground">Carregando termo...</p>
			</div>
		);
	}

	// Exatamente os itens digitados na página anterior (quantos forem)
	const n = Math.max(dados.itensPatrimonio?.length ?? 0, 1);

	return (
		<div className="w-full px-0 md:px-8 pb-10">
			<style dangerouslySetInnerHTML={{ __html: `
				@media print {
					body * { visibility: hidden; }
					.termo-print-area, .termo-print-area * { visibility: visible; }
					.termo-print-area { position: absolute !important; left: 0; top: 0; width: 100%; box-shadow: none !important; }
					.no-print { display: none !important; }
				}
			`}} />
			<div className="no-print flex flex-wrap gap-2 mb-6">
				<Button onClick={imprimir}>Imprimir</Button>
				<Button variant="outline" onClick={() => router.push('/termo')}>
					Voltar
				</Button>
			</div>

			<div
				ref={printRef}
				className="termo-print-area bg-background border rounded-lg p-6 md:p-8 mx-auto print:border-0 print:shadow-none print:p-0 shadow-md flex flex-col"
				style={{ fontFamily: "Calibri, sans-serif", width: "21cm", minHeight: "29.7cm" }}>
				<div className="flex-1 flex flex-col">
				<div className="termo-cabecalho flex items-center justify-center gap-4 mb-12 text-sm">
					<img
						src="/escudopmsp.png"
						alt="Brasão da Prefeitura de São Paulo"
						className="h-16 w-auto flex-shrink-0 print:h-14"
					/>
					<div className="text-center font-bold">
						<p className="mb-0.5">SECRETARIA MUNICIPAL DE URBANISMO E LICENCIAMENTO</p>
						<p className="mb-0">ATIC – ASSESSORIA DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÃO</p>
					</div>
				</div>
				<h1 className="text-center text-base font-bold uppercase tracking-wide mb-4 print:text-sm underline">
					Termo de Entrega
				</h1>

				<p className="text-justify text-sm mb-4 print:text-xs">
					Recebi nesta data os Bens Patrimoniais descritos no presente termo de
					responsabilidade e recebimento, cujas movimentações, transferências/
					aceites serão registrados no Sistema de Bens Patrimoniais – SBPM via
					processo SEI, nos termos da legislação que rege a matéria.
				</p>

				<table className="w-full border-collapse border border-black text-sm print:text-xs">
					<thead>
						<tr>
							<th className="border border-black p-1.5 text-left bg-muted w-10">
								Nº
							</th>
							<th className="border border-black p-1.5 text-left bg-muted">
								Nº Patrimonial
							</th>
							<th className="border border-black p-1.5 text-left bg-muted">
								Nº de Série
							</th>
							<th className="border border-black p-1.5 text-left bg-muted">
								Descrição do Bem
							</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: n }, (_, i) => (
							<tr key={i}>
								<td className="border border-black p-1.5 text-center">
									{i + 1}
								</td>
								<td className="border border-black p-1.5">
									{(dados.itensPatrimonio?.[i] ?? '').trim() || '-'}
								</td>
								<td className="border border-black p-1.5">
									{(dados.itensNumSerie?.[i] ?? '').trim() || '-'}
								</td>
								<td className="border border-black p-1.5">
									{(dados.itensDescricao?.[i] ?? '').trim() || '-'}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="mt-8 space-y-8 text-sm print:text-xs">
					<div>
						<p className="mb-1">
							<span className="font-medium">Entregue em: </span>
							{formatarData(dados.dataEntregue)}
						</p>
						<p className="mb-1">
							<span className="font-medium">Unidade: </span>
							{dados.unidadeEntregue}
						</p>
						<p className="mb-1">
							<span className="font-medium">Nome: </span>
							{dados.nomeEntrega}
						</p>
						<p className="mb-1">
							<span className="font-medium">RF: </span>
							{dados.rfEntrega}
						</p>
						<div className="termo-linha-assinatura mt-4 border-t border-black w-full max-w-xs" />
						<p className="mt-2 text-left text-muted-foreground text-xs">
							CARIMBO/ASSINATURA DO ENTREGADOR
						</p>
					</div>

					<div>
						<p className="mb-1">
							<span className="font-medium">Recebido em: </span>
							{formatarData(dados.dataRecebimento)}
						</p>
						<p className="mb-1">
							<span className="font-medium">Unidade: </span>
							{dados.unidadeRecebimento}
						</p>
						<p className="mb-1">
							<span className="font-medium">Nome: </span>
							{dados.nomeRecebimento}
						</p>
						<p className="mb-1">
							<span className="font-medium">RF: </span>
							{dados.rfRecebimento}
						</p>
						<div className="termo-linha-assinatura mt-4 border-t border-black w-full max-w-xs" />
						<p className="mt-2 text-left text-muted-foreground text-xs">
							CARIMBO/ASSINATURA DO RECEBEDOR
						</p>
					</div>
				</div>
				</div>

				<footer className="termo-rodape mt-auto pt-2 text-[10px] text-muted-foreground border-t border-border">
					<p className="mb-0 text-center">
						<span ref={rodapeDataRef}>{formatarDataHoraCabecalho()}</span>
						{' - SGI - Sistema de Gerenciamento de Inventário | 1º via servidor responsável pelo empréstimo | 2º via SMUL/ATIC'}
					</p>
				</footer>
			</div>
		</div>
	);
}
