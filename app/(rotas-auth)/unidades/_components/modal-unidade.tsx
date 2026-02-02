/** @format */

'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { IUnidade } from '@/types/unidade';
import { Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import FormUnidade from './form-unidade';

interface ModalUnidadeProps {
	isUpdating: boolean;
	unidade?: Partial<IUnidade>;
	onSuccess?: () => void;
}

export default function ModalUnidade({
	isUpdating,
	unidade,
	onSuccess,
}: ModalUnidadeProps) {
	const [open, setOpen] = useState(false);
	const handleSuccess = () => {
		setOpen(false);
		onSuccess?.();
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={
						isUpdating
							? 'bg-background hover:bg-primary'
							: 'bg-primary hover:bg-primary hover:opacity-70'
					}>
					{isUpdating ? (
						<SquarePen size={28} className="text-primary group-hover:text-white" />
					) : (
						<Plus size={28} className="text-white" />
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isUpdating ? 'Editar unidade' : 'Nova unidade'}
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados da unidade abaixo.'
							: 'Preencha os dados para cadastrar uma nova unidade.'}
					</DialogDescription>
				</DialogHeader>
				<FormUnidade
				isUpdating={isUpdating}
				unidade={unidade}
				onSuccess={handleSuccess}
			/>
			</DialogContent>
		</Dialog>
	);
}
