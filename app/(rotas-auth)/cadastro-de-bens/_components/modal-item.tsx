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
import { Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import FormItemBem from './form-item';

interface ModalItemProps {
	isUpdating: boolean;
	item?: Partial<IItem>;
	onSuccess?: () => void;
}

export default function ModalItem({
	isUpdating,
	item,
	onSuccess,
}: ModalItemProps) {
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
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>
						{isUpdating ? 'Editar bem' : 'Novo bem'}
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados do bem abaixo.'
							: 'Preencha os dados para cadastrar um novo bem.'}
					</DialogDescription>
				</DialogHeader>
				<FormItemBem
					key={item?.idbem ?? 'new'}
					isUpdating={isUpdating}
					item={item}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
}
