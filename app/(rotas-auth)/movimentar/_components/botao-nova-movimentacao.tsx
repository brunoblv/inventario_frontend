/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { IUnidade } from '@/types/unidade';
import { IUsuario } from '@/types/usuario';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalNovaMovimentacao from './modal-nova-movimentacao';

interface BotaoNovaMovimentacaoProps {
	unidades: IUnidade[];
	usuarios: IUsuario[];
	userLogin: string;
}

export default function BotaoNovaMovimentacao({
	unidades,
	usuarios,
	userLogin,
}: BotaoNovaMovimentacaoProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<>
			<Button onClick={() => setOpen(true)} className="gap-2 shrink-0">
				<Plus className="h-4 w-4" />
				Nova movimentação
			</Button>
			<ModalNovaMovimentacao
				open={open}
				onOpenChange={setOpen}
				unidades={unidades}
				usuarios={usuarios}
				userLogin={userLogin}
				onSuccess={() => router.refresh()}
			/>
		</>
	);
}
