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
import { ITipo } from '@/types/tipo';
import { Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import FormTipo from './form-tipo';

interface ModalTipoProps {
	isUpdating: boolean;
	tipo?: Partial<ITipo>;
	onSuccess?: () => void;
}

export default function ModalTipo({
	isUpdating,
	tipo,
	onSuccess,
}: ModalTipoProps) {
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
						{isUpdating ? 'Editar tipo de bem' : 'Novo tipo de bem'}
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados do tipo abaixo.'
							: 'Preencha os dados para cadastrar um novo tipo de bem.'}
					</DialogDescription>
				</DialogHeader>
				<FormTipo
					key={tipo?.idtipos ?? 'new'}
					isUpdating={isUpdating}
					tipo={tipo}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
