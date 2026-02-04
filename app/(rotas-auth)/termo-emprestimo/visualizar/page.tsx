/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	ITermoEmprestimoData,
	TERMO_EMPRESTIMO_STORAGE_KEY,
} from '@/types/termo';
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

export default function TermoEmprestimoVisualizarPage() {
	const router = useRouter();
	const [dados, setDados] = useState<ITermoEmprestimoData | null>(null);
	const printRef = useRef<HTMLDivElement>(null);
	const rodapeDataRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const raw = sessionStorage.getItem(TERMO_EMPRESTIMO_STORAGE_KEY);
		if (!raw) {
			router.replace('/termo-emprestimo');
			return;
		}
		try {
			const parsed = JSON.parse(raw) as ITermoEmprestimoData;
			setDados(parsed);
		} catch {
			router.replace('/termo-emprestimo');
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
				<Button variant="outline" onClick={() => router.push('/termo-emprestimo')}>
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

					<h1 className="text-center text-base font-bold uppercase tracking-wide mb-1 print:text-sm underline">
						Termo de Responsabilidade
					</h1>
					<h2 className="text-center text-base font-bold uppercase tracking-wide mb-4 print:text-sm">
						Empréstimo de Equipamento
					</h2>

					<div className="space-y-3 text-sm print:text-xs mb-4">
						<p className="mb-1">
							<span className="font-medium">Solicitante: </span>
							{dados.solicitante || '-'}
						</p>
						<p className="mb-1">
							<span className="font-medium">RF: </span>
							{dados.rf || '-'}
						</p>
						<p className="mb-1">
							<span className="font-medium">Setor/Unidade: </span>
							{dados.setorUnidade || '-'}
						</p>
						<p className="mb-1">
							<span className="font-medium">Telefone: </span>
							{dados.telefone || '-'}
						</p>
					</div>

					<div className="space-y-3 text-sm print:text-xs mb-4">
						<p className="mb-1">
							<span className="font-medium">Número de Registro Patrimonial: </span>
							{dados.numPatrimonio || '-'}
						</p>
						<p className="mb-1">
							<span className="font-medium">Tipo do Equipamento: </span>
							{dados.tipoEquipamento || '-'}
						</p>
						<p className="mb-1">
							<span className="font-medium">Marca e Modelo: </span>
							{dados.marcaModelo || '-'}
						</p>
						<p className="mb-1">
							<span className="font-medium">Número de Série: </span>
							{dados.numSerie || '-'}
						</p>
					</div>

					<div className="space-y-3 text-sm print:text-xs mb-4">
						<p className="mb-1 flex items-baseline gap-2 flex-wrap">
							<span className="font-medium shrink-0">Data de Retirada: </span>
							<span className="inline-block min-w-[6rem] flex-1 max-w-[8rem] text-center">_____/_____/_____</span>
							{dados.dataRetirada && (
								<span className="text-muted-foreground text-xs shrink-0">({formatarData(dados.dataRetirada)})</span>
							)}
						</p>
						<p className="mb-1 flex items-baseline gap-2 flex-wrap">
							<span className="font-medium shrink-0">Data de Devolução: </span>
							<span className="inline-block min-w-[6rem] flex-1 max-w-[8rem] text-center">_____/_____/_____</span>
							{dados.dataDevolucao && (
								<span className="text-muted-foreground text-xs shrink-0">({formatarData(dados.dataDevolucao)})</span>
							)}
						</p>
						<p className="mb-1">
							<span className="font-medium">Objetivo de Uso: </span>
							{dados.objetivoUso || '________________________________________________________________'}
						</p>
						<p className="mb-1">
							<span className="font-medium">Local de Uso: </span>
							São Paulo - Brasil
						</p>
					</div>

					<p className="text-justify text-sm print:text-xs mb-4">
						Declaro estar ciente de que é minha responsabilidade manter o equipamento em perfeito estado de conservação e me comprometo a pagar o valor correspondente caso danifique ou perca por uso inadequado, negligência ou extravio, hipóteses em que comunicarei imediatamente a Prefeitura de São Paulo. Afirmo ter verificado, antes da retirada, que o equipamento se encontrava:
					</p>

					<div className="space-y-2 text-sm print:text-xs mb-4">
						<p className="flex items-start gap-2">
							<span className="inline-block w-4 h-4 border border-black rounded-sm shrink-0 mt-0.5" />
							Em perfeitas condições de uso e bom estado de conservação
						</p>
						<p className="flex items-start gap-2">
							<span className="inline-block w-4 h-4 border border-black rounded-sm shrink-0 mt-0.5" />
							Com os seguintes problemas e/ ou danos (descrevê-los):
						</p>
					</div>

					<div className="space-y-4 mb-6">
						<div className="border-t border-black pt-1 min-h-[2rem]" />
						<div className="border-t border-black pt-1 min-h-[2rem]" />
						<div className="border-t border-black pt-1 min-h-[2rem]" />
					</div>

					<div className="termo-linha-assinatura border-t border-black w-full max-w-md mt-6 pt-1 min-h-[1.5rem]" />
					<p className="text-left text-muted-foreground text-xs mt-2">
						Assinatura do servidor solicitante
					</p>

					<p className="text-sm print:text-xs mt-6">
						São Paulo, _______ de ____________________ de ___________
					</p>
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
