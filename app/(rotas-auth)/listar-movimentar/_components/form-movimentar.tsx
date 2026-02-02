/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { IItem } from '@/types/item';
import { IUnidade } from '@/types/unidade';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { criarTransferencia } from '@/services/transferencias';
import { useListarMovimentarUser } from './user-context';

const formSchema = z.object({
	localnovo: z.string().min(1, 'Selecione a nova localização'),
	servidoratual: z.string().optional(),
	cimbpm: z.string().optional(),
	nome: z.string().optional(),
	statusitem: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const STATUS_OPCOES = [
	'ATIVO',
	'BAIXADO',
	'PARA DOAÇÃO',
	'PARA DESCARTE',
	'DOADO',
	'DESCARTADO',
	'ESTOQUE',
];

interface FormMovimentarProps {
	item: IItem;
	unidades: IUnidade[];
	onSuccess?: () => void;
}

export default function FormMovimentar({
	item,
	unidades,
	onSuccess,
}: FormMovimentarProps) {
	const user = useListarMovimentarUser();
	const [isPending, startTransition] = useTransition();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			localnovo: '',
			servidoratual: item.servidor ?? '',
			cimbpm: item.cimbpm ?? '',
			nome: item.nome ?? '',
			statusitem: item.statusitem ?? 'ATIVO',
		},
	});

	function onSubmit(values: FormValues) {
		startTransition(async () => {
			const resp = await criarTransferencia({
				iditem: item.idbem,
				localnovo: values.localnovo,
				servidoratual: values.servidoratual || undefined,
				cimbpm: values.cimbpm || undefined,
				nome: values.nome || undefined,
				statusitem: values.statusitem || 'ATIVO',
				usuario: user.nome,
				idusuario: user.login,
			});
			if (resp.ok) {
				toast.success('Bem movimentado com sucesso.');
				onSuccess?.();
				form.reset();
			} else {
				toast.error(resp.error ?? 'Erro ao movimentar bem.');
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground rounded border p-3 bg-muted/30">
					<span>Patrimônio:</span>
					<span className="font-medium text-foreground">{item.patrimonio ?? '-'}</span>
					<span>Localização atual:</span>
					<span className="font-medium text-foreground">{item.localizacao ?? '-'}</span>
					<span>Servidor atual:</span>
					<span className="font-medium text-foreground">{item.servidor ?? '-'}</span>
				</div>
				<FormField
					control={form.control}
					name="localnovo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nova localização</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value}
								required>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione a unidade" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{unidades
										.filter((u) => u.statusunidade?.toUpperCase() === 'ATIVO')
										.map((u) => (
											<SelectItem key={u.id} value={u.sigla}>
												{u.sigla} – {u.unidades}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="servidoratual"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome do servidor</FormLabel>
							<FormControl>
								<Input placeholder="Servidor responsável" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="cimbpm"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CIMBPM</FormLabel>
							<FormControl>
								<Input placeholder="CIM BPM" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Nome do equipamento" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="statusitem"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value ?? 'ATIVO'}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{STATUS_OPCOES.map((s) => (
										<SelectItem key={s} value={s}>
											{s}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end gap-2 pt-2">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancelar
						</Button>
					</DialogClose>
					<Button type="submit" disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Movimentar
					</Button>
				</div>
			</form>
		</Form>
	);
}
