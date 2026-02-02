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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { criarItem, atualizarItem } from '@/services/itens';

const formSchema = z.object({
	patrimonio: z.string().optional(),
	tipo: z.string().optional(),
	descsbpm: z.string().optional(),
	numserie: z.string().optional(),
	tiposbpm: z.string().optional(),
	marca: z.string().optional(),
	modelo: z.string().optional(),
	localizacao: z.string().optional(),
	servidor: z.string().optional(),
	numprocesso: z.string().optional(),
	cimbpm: z.string().optional(),
	nome: z.string().optional(),
	statusitem: z.enum(['ATIVO', 'INATIVO']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormItemProps {
	isUpdating: boolean;
	item?: Partial<IItem>;
	onSuccess?: () => void;
}

export default function FormItemBem({
	isUpdating,
	item,
	onSuccess,
}: FormItemProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			patrimonio: item?.patrimonio ?? '',
			tipo: item?.tipo ?? '',
			descsbpm: item?.descsbpm ?? '',
			numserie: item?.numserie ?? '',
			tiposbpm: item?.tiposbpm ?? '',
			marca: item?.marca ?? '',
			modelo: item?.modelo ?? '',
			localizacao: item?.localizacao ?? '',
			servidor: item?.servidor ?? '',
			numprocesso: item?.numprocesso ?? '',
			cimbpm: item?.cimbpm ?? '',
			nome: item?.nome ?? '',
			statusitem: (item?.statusitem?.toUpperCase() === 'INATIVO'
				? 'INATIVO'
				: 'ATIVO') as 'ATIVO' | 'INATIVO',
		},
	});

	function onSubmit(values: FormValues) {
		const payload = {
			...values,
			patrimonio: values.patrimonio || undefined,
			tipo: values.tipo || undefined,
			descsbpm: values.descsbpm || undefined,
			numserie: values.numserie || undefined,
			tiposbpm: values.tiposbpm || undefined,
			marca: values.marca || undefined,
			modelo: values.modelo || undefined,
			localizacao: values.localizacao || undefined,
			servidor: values.servidor || undefined,
			numprocesso: values.numprocesso || undefined,
			cimbpm: values.cimbpm || undefined,
			nome: values.nome || undefined,
			statusitem: values.statusitem || 'ATIVO',
		};
		startTransition(async () => {
			if (isUpdating && item?.idbem != null) {
				const resp = await atualizarItem(item.idbem, payload);
				if (resp.ok) {
					toast.success('Bem atualizado com sucesso.');
					onSuccess?.();
					form.reset();
				} else {
					toast.error(resp.error ?? 'Erro ao atualizar bem.');
				}
			} else {
				const resp = await criarItem(payload);
				if (resp.ok) {
					toast.success('Bem cadastrado com sucesso.');
					onSuccess?.();
					form.reset();
				} else {
					toast.error(resp.error ?? 'Erro ao cadastrar bem.');
				}
			}
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="patrimonio"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Patrimônio</FormLabel>
								<FormControl>
									<Input placeholder="Ex: 001-051791698-2" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tipo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo</FormLabel>
								<FormControl>
									<Input placeholder="Ex: MICROCOMPUTADOR" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="marca"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Marca</FormLabel>
								<FormControl>
									<Input placeholder="Ex: DELL" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="modelo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Modelo</FormLabel>
								<FormControl>
									<Input placeholder="Ex: OPTIPLEX 7070" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="localizacao"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Localização</FormLabel>
								<FormControl>
									<Input placeholder="Ex: ASCOM" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="servidor"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Servidor</FormLabel>
								<FormControl>
									<Input placeholder="Nome do servidor" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="numserie"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número de série</FormLabel>
								<FormControl>
									<Input placeholder="Número de série" {...field} />
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
						name="descsbpm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descrição SBPM</FormLabel>
								<FormControl>
									<Input placeholder="Descrição" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="tiposbpm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo SBPM</FormLabel>
								<FormControl>
									<Input placeholder="Tipo SBPM" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="numprocesso"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nº processo</FormLabel>
								<FormControl>
									<Input placeholder="Número do processo" {...field} />
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
								<FormLabel>CIM BPM</FormLabel>
								<FormControl>
									<Input placeholder="CIM BPM" {...field} />
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
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="ATIVO">Ativo</SelectItem>
										<SelectItem value="INATIVO">Inativo</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancelar
						</Button>
					</DialogClose>
					<Button type="submit" disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isUpdating ? 'Salvar' : 'Cadastrar'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
