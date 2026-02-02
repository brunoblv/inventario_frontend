/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { excluirUnidade } from '@/services/unidades';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ModalDeleteUnidadeProps {
	id: number;
}

export default function ModalDeleteUnidade({ id }: ModalDeleteUnidadeProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function handleDelete() {
		startTransition(async () => {
			const resp = await excluirUnidade(id);
			if (!resp.ok) {
				toast.error('Erro ao excluir', { description: resp.error });
			} else {
				toast.success('Unidade excluída com sucesso.');
				setOpen(false);
				router.refresh();
			}
		});
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className="hover:bg-destructive cursor-pointer hover:text-white group transition-all ease-linear duration-200">
					<Trash2
						size={24}
						className="text-destructive dark:text-white group-hover:text-white group"
					/>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Excluir unidade</DialogTitle>
				</DialogHeader>
				<p>Tem certeza que deseja excluir esta unidade?</p>
				<DialogFooter>
					<div className="flex gap-2">
						<DialogClose asChild>
							<Button variant="outline">Voltar</Button>
						</DialogClose>
						<Button
							disabled={isPending}
							onClick={handleDelete}
							type="button"
							variant="destructive">
							{isPending ? (
								<Loader2 className="animate-spin" />
							) : (
								'Excluir'
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
