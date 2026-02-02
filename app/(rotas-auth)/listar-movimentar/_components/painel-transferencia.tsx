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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useTransfer } from './transfer-context';
import { IUnidade } from '@/types/unidade';
import { Loader2, Trash2 } from 'lucide-react';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { criarTransferenciaLote } from '@/services/transferencias';
import { useListarMovimentarUser } from './user-context';

interface PainelTransferenciaProps {
	unidades: IUnidade[];
	onSuccess?: () => void;
}

export default function PainelTransferencia({
	unidades,
	onSuccess,
}: PainelTransferenciaProps) {
	const { itens, removeItem, updateItem, clear, panelOpen, setPanelOpen } = useTransfer();
	const user = useListarMovimentarUser();
	const [isPending, startTransition] = useTransition();
	const [localnovo, setLocalnovo] = useState('');
	const [cimbpm, setCimbpm] = useState('');
	const [observacao, setObservacao] = useState('');

	const unidadesAtivas = unidades.filter(
		(u) => u.statusunidade?.toUpperCase() === 'ATIVO',
	);

	function handleRegistrar() {
		if (!localnovo.trim()) {
			toast.error('Selecione a unidade de destino.');
			return;
		}
		if (itens.length === 0) {
			toast.error('Adicione ao menos um item à transferência.');
			return;
		}
		startTransition(async () => {
			const resp = await criarTransferenciaLote({
				localnovo: localnovo.trim(),
				cimbpm: cimbpm.trim() || undefined,
				observacao: observacao.trim() || undefined,
				idusuario: user.login || undefined,
				itens: itens.map((x) => ({
					idItem: x.item.idbem,
					servidorAtual: x.servidorAtual?.trim() || undefined,
				})),
			});
			if (resp.ok) {
				toast.success('Transferência registrada com sucesso.');
				clear();
				setLocalnovo('');
				setCimbpm('');
				setObservacao('');
				onSuccess?.();
			} else {
				toast.error(resp.error ?? 'Erro ao registrar transferência.');
			}
		});
	}

	if (itens.length === 0) return null;

	return (
		<Sheet open={panelOpen} onOpenChange={setPanelOpen}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md flex flex-col overflow-hidden">
				<SheetHeader>
					<SheetTitle>Transferência em andamento</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col flex-1 overflow-hidden gap-4 py-4">
					<p className="text-sm text-muted-foreground">
						{itens.length} item(ns) na transferência. Defina o destino e registre.
					</p>
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
						<Label htmlFor="cimbpm">CIMBPM</Label>
						<Input
							id="cimbpm"
							value={cimbpm}
							onChange={(e) => setCimbpm(e.target.value)}
							placeholder="Nº transferência (opcional)"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="observacao">Observação</Label>
						<Input
							id="observacao"
							value={observacao}
							onChange={(e) => setObservacao(e.target.value)}
							placeholder="Opcional"
						/>
					</div>
					<div className="flex-1 overflow-auto border rounded-md p-2 space-y-2">
						<Label>Itens</Label>
						{itens.map((x) => (
							<div
								key={x.item.idbem}
								className="flex flex-col gap-2 rounded border p-2 text-sm"
							>
								<div className="flex justify-between items-start gap-2">
									<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm min-w-0">
										<div>
											<span className="text-muted-foreground">Patrimônio: </span>
											<span className="font-medium">{x.item.patrimonio ?? '-'}</span>
										</div>
										<div>
											<span className="text-muted-foreground">Tipo: </span>
											<span>{x.item.tipo ?? '-'}</span>
										</div>
										<div>
											<span className="text-muted-foreground">Modelo: </span>
											<span>{x.item.modelo ?? '-'}</span>
										</div>
										<div>
											<span className="text-muted-foreground">Nº série: </span>
											<span>{x.item.numserie ?? '-'}</span>
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 shrink-0"
										onClick={() => removeItem(x.item.idbem)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
								<div className="flex gap-2 items-center">
									<Label className="text-xs shrink-0 w-32">Servidor responsável</Label>
									<Input
										placeholder="Opcional"
										value={x.servidorAtual ?? ''}
										onChange={(e) =>
											updateItem(x.item.idbem, {
												servidorAtual: e.target.value,
												nome: x.nome,
											})
										}
										className="h-8 text-xs"
									/>
								</div>
							</div>
						))}
					</div>
					<div className="flex gap-2 pt-2">
						<Button
							variant="outline"
							onClick={() => {
								clear();
								setLocalnovo('');
								setCimbpm('');
								setObservacao('');
							}}
						>
							Limpar
						</Button>
						<Button
							onClick={handleRegistrar}
							disabled={isPending || !localnovo.trim()}
						>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Registrar transferência
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
