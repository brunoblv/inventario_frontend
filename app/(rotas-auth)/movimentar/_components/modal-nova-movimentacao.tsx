/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { IUnidade } from '@/types/unidade';
import { IUsuario } from '@/types/usuario';
import { IItem } from '@/types/item';
import { Loader2, Trash2 } from 'lucide-react';
import { useTransition, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { criarTransferenciaLote } from '@/services/transferencias';
import { buscarItensPorPatrimonio } from '../actions';

interface ItemNaTransferencia {
	item: IItem;
	servidorAtual: string;
}

interface ModalNovaMovimentacaoProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	unidades: IUnidade[];
	usuarios: IUsuario[];
	userLogin: string;
	onSuccess?: () => void;
}

export default function ModalNovaMovimentacao({
	open,
	onOpenChange,
	unidades,
	usuarios,
	userLogin,
	onSuccess,
}: ModalNovaMovimentacaoProps) {
	const [itens, setItens] = useState<ItemNaTransferencia[]>([]);
	const [patrimonioInput, setPatrimonioInput] = useState('');
	const [itensSugeridos, setItensSugeridos] = useState<IItem[]>([]);
	const [loadingSugestoes, setLoadingSugestoes] = useState(false);
	const [inputFocado, setInputFocado] = useState(false);
	const [servidorFocadoId, setServidorFocadoId] = useState<number | null>(null);
	const [localnovo, setLocalnovo] = useState('');
	const [cimbpm, setCimbpm] = useState('');
	const [observacao, setObservacao] = useState('');
	const [isPendingAdd, startTransitionAdd] = useTransition();
	const [isPendingRegistrar, startTransitionRegistrar] = useTransition();
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const unidadesAtivas = unidades.filter(
		(u) => u.statusunidade?.toUpperCase() === 'ATIVO',
	);
	const usuariosAtivos = Array.isArray(usuarios)
		? usuarios.filter((u) => u && u.status !== false)
		: [];

	function usuariosFiltrados(termo: string): IUsuario[] {
		const t = (termo ?? '').trim().toLowerCase();
		if (!t) return usuariosAtivos;
		return usuariosAtivos.filter(
			(u) =>
				String(u.nome ?? '').toLowerCase().includes(t) ||
				String(u.login ?? '').toLowerCase().includes(t),
		);
	}

	const adicionarItem = useCallback((item: IItem) => {
		if (itens.some((x) => x.item.idbem === item.idbem)) {
			toast.error('Item já adicionado à transferência.');
			return;
		}
		setItens((prev) => [...prev, { item, servidorAtual: '' }]);
		setPatrimonioInput('');
		setItensSugeridos([]);
		inputRef.current?.focus();
	}, [itens]);

	useEffect(() => {
		const termo = patrimonioInput.trim();
		if (termo.length < 2) {
			setItensSugeridos([]);
			return;
		}
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			setLoadingSugestoes(true);
			buscarItensPorPatrimonio(termo).then((encontrados) => {
				setItensSugeridos(encontrados ?? []);
				setLoadingSugestoes(false);
			});
		}, 300);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [patrimonioInput]);

	function handleAdicionar(e: React.FormEvent) {
		e.preventDefault();
		if (!patrimonioInput.trim()) return;
		if (itensSugeridos.length > 0) {
			adicionarItem(itensSugeridos[0]);
			return;
		}
		startTransitionAdd(async () => {
			const encontrados = await buscarItensPorPatrimonio(patrimonioInput.trim());
			if (encontrados.length === 0) {
				toast.error('Nenhum bem ativo encontrado com esse patrimônio ou descrição.');
				return;
			}
			adicionarItem(encontrados[0]);
		});
	}

	function removeItem(idbem: number) {
		setItens((prev) => prev.filter((x) => x.item.idbem !== idbem));
	}

	function updateItem(idbem: number, servidorAtual: string) {
		setItens((prev) =>
			prev.map((x) =>
				x.item.idbem === idbem ? { ...x, servidorAtual } : x,
			),
		);
	}

	function handleRegistrar() {
		if (!localnovo.trim()) {
			toast.error('Selecione a unidade de destino.');
			return;
		}
		if (itens.length === 0) {
			toast.error('Adicione ao menos um item à transferência.');
			return;
		}
		startTransitionRegistrar(async () => {
			const resp = await criarTransferenciaLote({
				localnovo: localnovo.trim(),
				cimbpm: cimbpm.trim() || undefined,
				observacao: observacao.trim() || undefined,
				idusuario: userLogin || undefined,
				itens: itens.map((x) => ({
					idItem: x.item.idbem,
					servidorAtual: x.servidorAtual?.trim() || undefined,
				})),
			});
			if (resp.ok) {
				toast.success('Transferência registrada com sucesso.');
				setItens([]);
				setLocalnovo('');
				setCimbpm('');
				setObservacao('');
				onOpenChange(false);
				onSuccess?.();
			} else {
				toast.error(resp.error ?? 'Erro ao registrar transferência.');
			}
		});
	}

	function handleOpenChange(next: boolean) {
		if (!next) {
			setPatrimonioInput('');
			setLocalnovo('');
			setCimbpm('');
			setObservacao('');
			setItens([]);
		}
		onOpenChange(next);
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle>Nova movimentação</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 overflow-y-auto pr-2">
					<form onSubmit={handleAdicionar} className="flex gap-2">
						<div className="flex-1 space-y-2 relative">
							<Label htmlFor="modal-patrimonio">Patrimônio ou descrição</Label>
							<Input
								ref={inputRef}
								id="modal-patrimonio"
								value={patrimonioInput}
								onChange={(e) => setPatrimonioInput(e.target.value)}
								onFocus={() => setInputFocado(true)}
								onBlur={() => setTimeout(() => setInputFocado(false), 200)}
								placeholder="Digite para buscar (patrimônio ou descrição)"
								disabled={isPendingAdd}
								autoComplete="off"
							/>
							{(inputFocado && (itensSugeridos.length > 0 || loadingSugestoes)) && (
								<div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
									{loadingSugestoes ? (
										<div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
											<Loader2 className="h-4 w-4 animate-spin shrink-0" />
											Buscando...
										</div>
									) : (
										itensSugeridos
											.filter((item) => !itens.some((x) => x.item.idbem === item.idbem))
											.map((item) => (
												<button
													key={item.idbem}
													type="button"
													className="w-full px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none flex justify-between gap-2 border-b last:border-b-0"
													onMouseDown={(e) => {
														e.preventDefault();
														adicionarItem(item);
													}}
												>
													<span className="font-medium">{item.patrimonio ?? '-'}</span>
													<span className="text-muted-foreground truncate">{item.tipo ?? '-'}</span>
												</button>
											))
									)}
									{!loadingSugestoes && itensSugeridos.length > 0 && itensSugeridos.every((item) => itens.some((x) => x.item.idbem === item.idbem)) && (
										<div className="px-3 py-2 text-sm text-muted-foreground">
											Todos os itens já foram adicionados.
										</div>
									)}
								</div>
							)}
						</div>
						<div className="flex items-end">
							<Button type="submit" disabled={isPendingAdd}>
								{isPendingAdd && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Adicionar
							</Button>
						</div>
					</form>

					{itens.length > 0 && (
						<div className="space-y-2">
							<Label>Itens na transferência ({itens.length})</Label>
							<div className="border rounded-md p-2 space-y-2 max-h-72 overflow-y-auto">
								{itens.map((x) => (
									<div
										key={x.item.idbem}
										className="flex flex-col gap-2 rounded border p-2 text-sm"
									>
										<div className="flex items-center gap-4 flex-wrap min-w-0">
											<span className="shrink-0">
												<span className="text-muted-foreground">Patrimônio: </span>
												<span className="font-medium">{x.item.patrimonio ?? '-'}</span>
											</span>
											<span className="shrink-0">
												<span className="text-muted-foreground">Tipo: </span>
												<span>{x.item.tipo ?? '-'}</span>
											</span>
											<span className="shrink-0">
												<span className="text-muted-foreground">Modelo: </span>
												<span>{x.item.modelo ?? '-'}</span>
											</span>
											<span className="shrink-0">
												<span className="text-muted-foreground">Nº série: </span>
												<span>{x.item.numserie ?? '-'}</span>
											</span>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-8 w-8 shrink-0 ml-auto"
												onClick={() => removeItem(x.item.idbem)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<Label className="text-xs shrink-0">Servidor responsável (opcional)</Label>
											<div className="relative flex-1 min-w-0 max-w-xs overflow-visible">
												<Input
													placeholder="Digite para buscar pelo nome"
													value={x.servidorAtual}
													onChange={(e) => updateItem(x.item.idbem, e.target.value)}
													onFocus={() => setServidorFocadoId(x.item.idbem)}
													onBlur={() => setTimeout(() => setServidorFocadoId(null), 200)}
													className="h-8 text-xs"
													autoComplete="off"
												/>
												{servidorFocadoId === x.item.idbem && (
													<div className="absolute top-full left-0 right-0 z-[100] mt-1 rounded-md border bg-popover text-popover-foreground shadow-lg max-h-48 overflow-y-auto">
														{usuariosFiltrados(x.servidorAtual).length === 0 ? (
															<div className="px-3 py-2 text-sm text-muted-foreground">
																Nenhum usuário encontrado.
															</div>
														) : (
															usuariosFiltrados(x.servidorAtual).map((u) => (
																<button
																	key={u.id}
																	type="button"
																	className="w-full px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none flex justify-between gap-2 border-b last:border-b-0 bg-background"
																	onMouseDown={(e) => {
																		e.preventDefault();
																		updateItem(x.item.idbem, String(u.nome ?? ''));
																		setServidorFocadoId(null);
																	}}
																>
																	<span className="font-medium">{String(u.nome ?? '-')}</span>
																	{u.login ? (
																		<span className="text-muted-foreground truncate">{String(u.login)}</span>
																	) : null}
																</button>
															))
														)}
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="space-y-2">
						<Label>Unidade de destino *</Label>
						<Select value={localnovo} onValueChange={setLocalnovo} required>
							<SelectTrigger>
								<SelectValue placeholder="Selecione a unidade" />
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
					<div className="space-y-2">
						<Label htmlFor="modal-cimbpm">CIMBPM</Label>
						<Input
							id="modal-cimbpm"
							value={cimbpm}
							onChange={(e) => setCimbpm(e.target.value)}
							placeholder="Opcional"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="modal-observacao">Observação</Label>
						<Input
							id="modal-observacao"
							value={observacao}
							onChange={(e) => setObservacao(e.target.value)}
							placeholder="Opcional"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleRegistrar}
						disabled={isPendingRegistrar || !localnovo.trim() || itens.length === 0}
					>
						{isPendingRegistrar && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Registrar transferência
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
