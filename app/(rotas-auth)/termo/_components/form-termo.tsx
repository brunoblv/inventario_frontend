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
import { IItem } from '@/types/item';
import { ITermoData, TERMO_STORAGE_KEY } from '@/types/termo';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { buscarItensPorPatrimonio } from '../actions';

interface FormTermoProps {
	unidades: IUnidade[];
}

export default function FormTermo({ unidades }: FormTermoProps) {
	const router = useRouter();
	const [patrimonioSerie, setPatrimonioSerie] = useState('');
	const [numSerie, setNumSerie] = useState('');
	const [descBem, setDescBem] = useState('');
	const [itensPatrimonio, setItensPatrimonio] = useState<string[]>([]);
	const [itensNumSerie, setItensNumSerie] = useState<string[]>([]);
	const [itensDescricao, setItensDescricao] = useState<string[]>([]);
	const [dataEntregue, setDataEntregue] = useState('');
	const [unidadeEntregue, setUnidadeEntregue] = useState('');
	const [nomeEntrega, setNomeEntrega] = useState('');
	const [rfEntrega, setRfEntrega] = useState('');
	const [dataRecebimento, setDataRecebimento] = useState('');
	const [unidadeRecebimento, setUnidadeRecebimento] = useState('');
	const [nomeRecebimento, setNomeRecebimento] = useState('');
	const [rfRecebimento, setRfRecebimento] = useState('');
	const [itensSugeridos, setItensSugeridos] = useState<IItem[]>([]);
	const [loadingSugestoes, setLoadingSugestoes] = useState(false);
	const [inputPatrimonioFocado, setInputPatrimonioFocado] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputPatrimonioRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const termo = patrimonioSerie.trim();
		if (termo.length < 2) {
			setItensSugeridos([]);
			return;
		}
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setLoadingSugestoes(true);
			buscarItensPorPatrimonio(termo).then((encontrados) => {
				const lista = encontrados ?? [];
				setItensSugeridos(lista);
				if (lista.length > 0) {
					const primeiro = lista[0];
					setNumSerie((primeiro.numserie ?? '').trim());
					setDescBem((primeiro.descsbpm || primeiro.tipo || '').trim());
				} else {
					setNumSerie('');
					setDescBem('');
				}
				setLoadingSugestoes(false);
			});
		}, 300);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [patrimonioSerie]);

	function adicionarItemDaBusca(item: IItem) {
		const pat = (item.patrimonio ?? '').trim();
		if (!pat) return;
		setItensPatrimonio((prev) => [...prev, pat]);
		setItensNumSerie((prev) => [...prev, (item.numserie ?? '').trim()]);
		setItensDescricao((prev) => [
			...prev,
			(item.descsbpm || item.tipo || '').trim(),
		]);
		setPatrimonioSerie('');
		setNumSerie('');
		setDescBem('');
		setItensSugeridos([]);
		inputPatrimonioRef.current?.focus();
		toast.success('Item adicionado ao termo.');
	}

	function adicionarItem() {
		const p = patrimonioSerie.trim();
		if (!p) {
			toast.error('Informe o Nº Patrimonial/Nº de Série.');
			return;
		}
		setItensPatrimonio((prev) => [...prev, p]);
		setItensDescricao((prev) => [...prev, descBem.trim()]);
		setPatrimonioSerie('');
		setDescBem('');
		toast.success('Item adicionado ao termo.');
	}

	function removerItem(index: number) {
		setItensPatrimonio((prev) => prev.filter((_, i) => i !== index));
		setItensNumSerie((prev) => prev.filter((_, i) => i !== index));
		setItensDescricao((prev) => prev.filter((_, i) => i !== index));
		toast.success('Item removido.');
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (itensPatrimonio.length === 0) {
			toast.error('Adicione pelo menos um número de patrimônio ao termo.');
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
			itensNumSerie,
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
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="relative">
					<Label htmlFor="numPatriSerie">Nº Patrimonial / Nº de Série *</Label>
					<Input
						ref={inputPatrimonioRef}
						id="numPatriSerie"
						value={patrimonioSerie}
						onChange={(e) => setPatrimonioSerie(e.target.value)}
						onFocus={() => setInputPatrimonioFocado(true)}
						onBlur={() => setTimeout(() => setInputPatrimonioFocado(false), 200)}
						placeholder="Digite para buscar ou informar o patrimônio"
						className="mt-1"
						autoComplete="off"
					/>
					{inputPatrimonioFocado &&
						(itensSugeridos.length > 0 || loadingSugestoes) && (
							<div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-lg max-h-60 overflow-y-auto">
								{loadingSugestoes ? (
									<div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
										<Loader2 className="h-4 w-4 animate-spin shrink-0" />
										Buscando...
									</div>
								) : (
									<>
										{itensSugeridos
											.filter(
												(item) =>
													!itensPatrimonio.includes(
														(item.patrimonio ?? '').trim(),
													),
											)
											.map((item) => (
												<button
													key={item.idbem}
													type="button"
													className="w-full px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none flex justify-between gap-2 border-b last:border-b-0"
													onMouseDown={(e) => {
														e.preventDefault();
														adicionarItemDaBusca(item);
													}}
												>
													<span className="font-medium">
														{item.patrimonio ?? '-'}
													</span>
													<span className="text-muted-foreground truncate">
														{item.tipo ?? item.descsbpm ?? '-'}
													</span>
												</button>
											))}
										{itensSugeridos.length > 0 &&
											itensSugeridos.every((item) =>
												itensPatrimonio.includes(
													(item.patrimonio ?? '').trim(),
												),
											) && (
												<div className="px-3 py-2 text-sm text-muted-foreground">
													Todos os itens já foram adicionados.
												</div>
											)}
									</>
								)}
							</div>
						)}
				</div>
				<div>
					<Label htmlFor="numSerie">Nº de Série (opcional)</Label>
					<Input
						id="numSerie"
						value={numSerie}
						onChange={(e) => setNumSerie(e.target.value)}
						placeholder="Preenchido ao selecionar da busca"
						className="mt-1"
						readOnly
					/>
				</div>
				<div>
					<Label htmlFor="descBem">Descrição do Bem (vinda do banco ao selecionar)</Label>
					<Input
						id="descBem"
						value={descBem}
						onChange={(e) => setDescBem(e.target.value)}
						placeholder="Preenchida ao selecionar na busca"
						className="mt-1"
						readOnly
					/>
				</div>
			</div>
			<div>
				<Label>Itens que serão incluídos no termo ({itensPatrimonio.length})</Label>
				<div className="mt-1 rounded-md border border-input bg-muted/30 max-h-48 overflow-auto">
					{itensPatrimonio.length === 0 ? (
						<p className="p-3 text-sm text-muted-foreground">
							Nenhum item. Adicione o Nº Patrimonial acima.
						</p>
					) : (
						<ul className="divide-y divide-border">
							{itensPatrimonio.map((pat, i) => (
								<li
									key={i}
									className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
									<span className="font-medium shrink-0">{pat}</span>
									{itensNumSerie[i]?.trim() && (
										<span className="text-muted-foreground shrink-0">
											Série: {itensNumSerie[i]}
										</span>
									)}
									{itensDescricao[i]?.trim() && (
										<span className="text-muted-foreground truncate flex-1 mx-2">
											{itensDescricao[i]}
										</span>
									)}
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
										onClick={() => removerItem(i)}
										title="Remover item">
										<Trash2 className="h-4 w-4 text-destructive" />
									</Button>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
			<div className="flex justify-end">
				<Button
					type="button"
					variant="outline"
					onClick={adicionarItem}
					disabled={!patrimonioSerie.trim()}>
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
