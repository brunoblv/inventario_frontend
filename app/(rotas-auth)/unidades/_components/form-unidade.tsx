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
import { IUnidade } from '@/types/unidade';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { criarUnidade, atualizarUnidade } from '@/services/unidades';

const formSchema = z.object({
	unidades: z.string().min(1, 'Nome da unidade é obrigatório'),
	sigla: z.string().min(1, 'Sigla é obrigatória'),
	codigo: z.string().min(1, 'Código é obrigatório'),
	statusunidade: z.enum(['ATIVO', 'INATIVO']),
});

type FormValues = z.infer<typeof formSchema>;

interface FormUnidadeProps {
	isUpdating: boolean;
	unidade?: Partial<IUnidade>;
	onSuccess?: () => void;
}

export default function FormUnidade({
	isUpdating,
	unidade,
	onSuccess,
}: FormUnidadeProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			unidades: unidade?.unidades ?? '',
			sigla: unidade?.sigla ?? '',
			codigo: unidade?.codigo ?? '',
			statusunidade: (unidade?.statusunidade?.toUpperCase() === 'INATIVO'
				? 'INATIVO'
				: 'ATIVO') as 'ATIVO' | 'INATIVO',
		},
	});

	function onSubmit(values: FormValues) {
		startTransition(async () => {
			if (isUpdating && unidade?.id != null) {
				const resp = await atualizarUnidade(unidade.id, values);
				if (resp.ok) {
					toast.success('Unidade atualizada com sucesso.');
					onSuccess?.();
					form.reset();
				} else {
					toast.error(resp.error ?? 'Erro ao atualizar unidade.');
				}
			} else {
				const resp = await criarUnidade(values);
				if (resp.ok) {
					toast.success('Unidade cadastrada com sucesso.');
					onSuccess?.();
					form.reset();
				} else {
					toast.error(resp.error ?? 'Erro ao cadastrar unidade.');
				}
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="unidades"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Unidade</FormLabel>
							<FormControl>
								<Input placeholder="Nome da unidade" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="sigla"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Sigla</FormLabel>
							<FormControl>
								<Input placeholder="Ex: CAF" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="codigo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Código</FormLabel>
							<FormControl>
								<Input placeholder="Código da unidade" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="statusunidade"
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
									<SelectItem value="ATIVO">Ativo</SelectItem>
									<SelectItem value="INATIVO">Inativo</SelectItem>
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
