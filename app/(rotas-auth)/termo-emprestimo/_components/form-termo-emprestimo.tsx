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
import { Textarea } from '@/components/ui/textarea';
import { IUnidade } from '@/types/unidade';
import {
	ITermoEmprestimoData,
	TERMO_EMPRESTIMO_STORAGE_KEY,
} from '@/types/termo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface FormTermoEmprestimoProps {
	unidades: IUnidade[];
}

export default function FormTermoEmprestimo({ unidades }: FormTermoEmprestimoProps) {
	const router = useRouter();
	const [solicitante, setSolicitante] = useState('');
	const [rf, setRf] = useState('');
	const [setorUnidade, setSetorUnidade] = useState('');
	const [telefone, setTelefone] = useState('');
	const [numPatrimonio, setNumPatrimonio] = useState('');
	const [tipoEquipamento, setTipoEquipamento] = useState('');
	const [marcaModelo, setMarcaModelo] = useState('');
	const [numSerie, setNumSerie] = useState('');
	const [dataRetirada, setDataRetirada] = useState('');
	const [dataDevolucao, setDataDevolucao] = useState('');
	const [objetivoUso, setObjetivoUso] = useState('');

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!solicitante.trim()) {
			toast.error('Informe o nome do solicitante.');
			return;
		}
		if (!rf.trim()) {
			toast.error('Informe o RF.');
			return;
		}
		if (!setorUnidade.trim()) {
			toast.error('Informe o Setor/Unidade.');
			return;
		}
		const dados: ITermoEmprestimoData = {
			solicitante: solicitante.trim(),
			rf: rf.trim(),
			setorUnidade: setorUnidade.trim(),
			telefone: telefone.trim(),
			numPatrimonio: numPatrimonio.trim(),
			tipoEquipamento: tipoEquipamento.trim(),
			marcaModelo: marcaModelo.trim(),
			numSerie: numSerie.trim(),
			dataRetirada: dataRetirada.trim(),
			dataDevolucao: dataDevolucao.trim(),
			objetivoUso: objetivoUso.trim(),
		};
		if (typeof window !== 'undefined') {
			sessionStorage.setItem(
				TERMO_EMPRESTIMO_STORAGE_KEY,
				JSON.stringify(dados),
			);
			router.push('/termo-emprestimo/visualizar');
		}
	}

	const unidadesAtivas = unidades.filter(
		(u) => u.statusunidade?.toUpperCase() === 'ATIVO',
	);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<h2 className="text-lg font-semibold">Solicitante</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor="solicitante">Solicitante *</Label>
						<Input
							id="solicitante"
							value={solicitante}
							onChange={(e) => setSolicitante(e.target.value)}
							placeholder="Nome do usuário"
							className="mt-1"
							required
						/>
					</div>
					<div>
						<Label htmlFor="rf">RF *</Label>
						<Input
							id="rf"
							value={rf}
							onChange={(e) => setRf(e.target.value)}
							placeholder="RF do usuário"
							className="mt-1"
							required
						/>
					</div>
					<div>
						<Label htmlFor="setorUnidade">Setor/Unidade *</Label>
						<Select
							value={setorUnidade}
							onValueChange={setSetorUnidade}
							required
						>
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
						<Label htmlFor="telefone">Telefone</Label>
						<Input
							id="telefone"
							value={telefone}
							onChange={(e) => setTelefone(e.target.value)}
							placeholder="Telefone do usuário"
							className="mt-1"
						/>
					</div>
				</div>
			</div>

			<div className="rounded-lg border bg-card p-4 space-y-4">
				<h2 className="text-lg font-semibold">Equipamento</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor="numPatrimonio">Número de Registro Patrimonial</Label>
						<Input
							id="numPatrimonio"
							value={numPatrimonio}
							onChange={(e) => setNumPatrimonio(e.target.value)}
							placeholder="Nº patrimonial"
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="tipoEquipamento">Tipo do Equipamento</Label>
						<Input
							id="tipoEquipamento"
							value={tipoEquipamento}
							onChange={(e) => setTipoEquipamento(e.target.value)}
							placeholder="Ex.: Notebook, Monitor"
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="marcaModelo">Marca e Modelo</Label>
						<Input
							id="marcaModelo"
							value={marcaModelo}
							onChange={(e) => setMarcaModelo(e.target.value)}
							placeholder="Marca e modelo"
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="numSerie">Número de Série</Label>
						<Input
							id="numSerie"
							value={numSerie}
							onChange={(e) => setNumSerie(e.target.value)}
							placeholder="Nº de série"
							className="mt-1"
						/>
					</div>
				</div>
			</div>

			<div className="rounded-lg border bg-card p-4 space-y-4">
				<h2 className="text-lg font-semibold">Datas e uso</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor="dataRetirada">Data de Retirada</Label>
						<Input
							id="dataRetirada"
							type="date"
							value={dataRetirada}
							onChange={(e) => setDataRetirada(e.target.value)}
							className="mt-1"
						/>
					</div>
					<div>
						<Label htmlFor="dataDevolucao">Data de Devolução</Label>
						<Input
							id="dataDevolucao"
							type="date"
							value={dataDevolucao}
							onChange={(e) => setDataDevolucao(e.target.value)}
							className="mt-1"
						/>
					</div>
				</div>
				<div>
					<Label htmlFor="objetivoUso">Objetivo de Uso</Label>
					<Textarea
						id="objetivoUso"
						value={objetivoUso}
						onChange={(e) => setObjetivoUso(e.target.value)}
						placeholder="Descreva o objetivo do empréstimo"
						className="mt-1 min-h-[80px]"
						rows={3}
					/>
				</div>
			</div>

			<div className="flex justify-end pt-4">
				<Button type="submit">Visualizar Termo</Button>
			</div>
		</form>
	);
}
