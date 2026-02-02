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
import { IItem } from '@/types/item';
import { IUnidade } from '@/types/unidade';
import { ArrowRightLeft } from 'lucide-react';
import { useState } from 'react';
import FormMovimentar from './form-movimentar';

interface ModalMovimentarProps {
	item: IItem;
	unidades: IUnidade[];
	onSuccess?: () => void;
}

export default function ModalMovimentar({
	item,
	unidades,
	onSuccess,
}: ModalMovimentarProps) {
	const [open, setOpen] = useState(false);
	const handleSuccess = () => {
		setOpen(false);
		onSuccess?.();
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="outline" className="bg-background hover:bg-primary">
					<ArrowRightLeft size={20} className="text-primary group-hover:text-white" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Movimentar bem</DialogTitle>
					<DialogDescription>
						Registre a nova localização e dados da transferência do patrimônio{' '}
						{item.patrimonio ?? item.idbem}.
					</DialogDescription>
				</DialogHeader>
				<FormMovimentar
					item={item}
					unidades={unidades}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
