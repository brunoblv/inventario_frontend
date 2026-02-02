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
import { ITipo } from '@/types/tipo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { criarTipo, atualizarTipo } from '@/services/tipos';

const formSchema = z.object({
	tipo: z.string().min(1, 'Nome do tipo é obrigatório'),
	statustipo: z.enum(['Ativo', 'Inativo']),
});

type FormValues = z.infer<typeof formSchema>;

interface FormTipoProps {
	isUpdating: boolean;
	tipo?: Partial<ITipo>;
	onSuccess?: () => void;
}

export default function FormTipo({
	isUpdating,
	tipo,
	onSuccess,
}: FormTipoProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tipo: tipo?.tipo ?? '',
			statustipo: (tipo?.statustipo?.toLowerCase() === 'inativo'
				? 'Inativo'
				: 'Ativo') as 'Ativo' | 'Inativo',
		},
	});

	function onSubmit(values: FormValues) {
		startTransition(async () => {
			if (isUpdating && tipo?.idtipos != null) {
				const resp = await atualizarTipo(tipo.idtipos, values);
				if (resp.ok) {
					toast.success('Tipo atualizado com sucesso.');
					onSuccess?.();
					form.reset();
				} else {
					toast.error(resp.error ?? 'Erro ao atualizar tipo.');
				}
			} else {
				const resp = await criarTipo(values);
				if (resp.ok) {
					toast.success('Tipo cadastrado com sucesso.');
					onSuccess?.();
					form.reset();
				} else {
					toast.error(resp.error ?? 'Erro ao cadastrar tipo.');
				}
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
					name="statustipo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o status" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="Ativo">Ativo</SelectItem>
									<SelectItem value="Inativo">Inativo</SelectItem>
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
						{isUpdating ? 'Salvar' : 'Cadastrar'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
