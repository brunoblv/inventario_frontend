/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { IUnidade } from '@/types/unidade';
import { ITermoData, TERMO_STORAGE_KEY } from '@/types/termo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface FormTermoProps {
	unidades: IUnidade[];
}

export default function FormTermo({ unidades }: FormTermoProps) {
	const router = useRouter();
	const [patrimonioSerie, setPatrimonioSerie] = useState('');
	const [descBem, setDescBem] = useState('');
	const [itensPatrimonio, setItensPatrimonio] = useState<string[]>([]);
	const [itensDescricao, setItensDescricao] = useState<string[]>([]);
	const [dataEntregue, setDataEntregue] = useState('');
	const [unidadeEntregue, setUnidadeEntregue] = useState('');
	const [nomeEntrega, setNomeEntrega] = useState('');
	const [rfEntrega, setRfEntrega] = useState('');
	const [dataRecebimento, setDataRecebimento] = useState('');
	const [unidadeRecebimento, setUnidadeRecebimento] = useState('');
	const [nomeRecebimento, setNomeRecebimento] = useState('');
	const [rfRecebimento, setRfRecebimento] = useState('');

	function adicionarItem() {
		const p = patrimonioSerie.trim();
		const d = descBem.trim();
		if (!p || !d) {
			toast.error('Preencha Nº Patrimonial/Série e Descrição do Bem.');
			return;
		}
		setItensPatrimonio((prev) => [...prev, p]);
		setItensDescricao((prev) => [...prev, d]);
		setPatrimonioSerie('');
		setDescBem('');
		toast.success('Item adicionado.');
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (itensPatrimonio.length === 0 || itensDescricao.length === 0) {
			toast.error('Adicione pelo menos um item ao termo.');
			return;
		}
		if (
			!dataEntregue ||
			!unidadeEntregue ||
			!nomeEntrega ||
			!rfEntrega ||
			!dataRecebimento ||
			!unidadeRecebimento ||
			!nomeRecebimento ||
			!rfRecebimento
		) {
			toast.error('Preencha todos os campos de Entrega e Recebimento.');
			return;
		}
		const dados: ITermoData = {
			itensPatrimonio,
			itensDescricao,
			dataEntregue,
			unidadeEntregue,
			nomeEntrega,
			rfEntrega,
			dataRecebimento,
			unidadeRecebimento,
			nomeRecebimento,
			rfRecebimento,
		};
		if (typeof window !== 'undefined') {
			sessionStorage.setItem(TERMO_STORAGE_KEY, JSON.stringify(dados));
			router.push('/termo/visualizar');
		}
	}

	const unidadesAtivas = unidades.filter(
		(u) => u.statusunidade?.toUpperCase() === 'ATIVO',
	);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="numPatriSerie">Nº Patrimonial/Nº de Série</Label>
					<Input
						id="numPatriSerie"
						value={patrimonioSerie}
						onChange={(e) => setPatrimonioSerie(e.target.value)}
						placeholder="Ex: 001-051791698-2"
						className="mt-1"
					/>
				</div>
				<div>
					<Label htmlFor="descBem">Descrição do Bem</Label>
					<Input
						id="descBem"
						value={descBem}
						onChange={(e) => setDescBem(e.target.value)}
						placeholder="Ex: MICROCOMPUTADOR DELL"
						className="mt-1"
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label>Itens adicionados (Nº Patrimonial/Série)</Label>
					<textarea
						readOnly
						className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
						value={itensPatrimonio.join('\n')}
						rows={4}
					/>
				</div>
				<div>
					<Label>Itens adicionados (Descrição)</Label>
					<textarea
						readOnly
						className="mt-1 flex min-h-[80px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
						value={itensDescricao.join('\n')}
						rows={4}
					/>
				</div>
			</div>
			<div className="flex justify-end">
				<Button
					type="button"
					variant="outline"
					onClick={adicionarItem}
					disabled={!patrimonioSerie.trim() || !descBem.trim()}>
					<Plus className="mr-2 h-4 w-4" />
					Adicionar Item
				</Button>
			</div>

			<hr className="my-6" />
			<Accordion type="multiple" className="w-full">
				<AccordionItem value="entregue">
					<AccordionTrigger className="text-lg font-semibold">
						Entregue em
					</AccordionTrigger>
					<AccordionContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
							<div>
								<Label htmlFor="dataEntregue">Data da Entrega</Label>
								<Input
									id="dataEntregue"
									type="date"
									value={dataEntregue}
									onChange={(e) => setDataEntregue(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="unidadeEntregue">Unidade</Label>
								<Select
									value={unidadeEntregue}
									onValueChange={setUnidadeEntregue}
									required>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Selecionar" />
									</SelectTrigger>
									<SelectContent>
										{unidadesAtivas.map((u) => (
											<SelectItem key={u.id} value={u.sigla}>
												{u.sigla} – {u.unidades}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="nomeEntrega">Nome responsável pela Entrega</Label>
								<Input
									id="nomeEntrega"
									value={nomeEntrega}
									onChange={(e) => setNomeEntrega(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="rfEntrega">RF</Label>
								<Input
									id="rfEntrega"
									value={rfEntrega}
									onChange={(e) => setRfEntrega(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="recebido">
					<AccordionTrigger className="text-lg font-semibold">
						Recebido em
					</AccordionTrigger>
					<AccordionContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
							<div>
								<Label htmlFor="dataRecebimento">Data do Recebimento</Label>
								<Input
									id="dataRecebimento"
									type="date"
									value={dataRecebimento}
									onChange={(e) => setDataRecebimento(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="unidadeRecebimento">Unidade que Recebeu</Label>
								<Select
									value={unidadeRecebimento}
									onValueChange={setUnidadeRecebimento}
									required>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Selecionar" />
									</SelectTrigger>
									<SelectContent>
										{unidadesAtivas.map((u) => (
											<SelectItem key={u.id} value={u.sigla}>
												{u.sigla} – {u.unidades}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="nomeRecebimento">Nome responsável pelo Recebimento</Label>
								<Input
									id="nomeRecebimento"
									value={nomeRecebimento}
									onChange={(e) => setNomeRecebimento(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
							<div>
								<Label htmlFor="rfRecebimento">RF</Label>
								<Input
									id="rfRecebimento"
									value={rfRecebimento}
									onChange={(e) => setRfRecebimento(e.target.value)}
									required
									className="mt-1"
								/>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<div className="flex justify-end pt-4">
				<Button type="submit" disabled={itensPatrimonio.length === 0}>
					Visualizar Termo
				</Button>
			</div>
		</form>
	);
}
