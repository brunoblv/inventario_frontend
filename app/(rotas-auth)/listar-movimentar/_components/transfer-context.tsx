/** @format */

'use client';

import { IItem } from '@/types/item';
import {
	createContext,
	useCallback,
	useContext,
	useState,
	ReactNode,
} from 'react';

export interface ItemNaTransferencia {
	item: IItem;
	servidorAtual?: string;
	nome?: string;
}

interface TransferContextValue {
	itens: ItemNaTransferencia[];
	panelOpen: boolean;
	setPanelOpen: (open: boolean) => void;
	addItem: (item: IItem, servidorAtual?: string, nome?: string) => void;
	removeItem: (idbem: number) => void;
	updateItem: (idbem: number, data: { servidorAtual?: string; nome?: string }) => void;
	clear: () => void;
}

const TransferContext = createContext<TransferContextValue | null>(null);

export function TransferProvider({ children }: { children: ReactNode }) {
	const [itens, setItens] = useState<ItemNaTransferencia[]>([]);
	const [panelOpen, setPanelOpen] = useState(false);

	const addItem = useCallback(
		(item: IItem, servidorAtual?: string, nome?: string) => {
			setItens((prev) => {
				if (prev.some((x) => x.item.idbem === item.idbem)) return prev;
				return [...prev, { item, servidorAtual, nome }];
			});
			setPanelOpen(true);
		},
		[],
	);

	const removeItem = useCallback((idbem: number) => {
		setItens((prev) => prev.filter((x) => x.item.idbem !== idbem));
	}, []);

	const updateItem = useCallback(
		(idbem: number, data: { servidorAtual?: string; nome?: string }) => {
			setItens((prev) =>
				prev.map((x) =>
					x.item.idbem === idbem
						? { ...x, servidorAtual: data.servidorAtual ?? x.servidorAtual, nome: data.nome ?? x.nome }
						: x,
				),
			);
		},
		[],
	);

	const clear = useCallback(() => {
		setItens([]);
		setPanelOpen(false);
	}, []);

	return (
		<TransferContext.Provider
			value={{ itens, panelOpen, setPanelOpen, addItem, removeItem, updateItem, clear }}
		>
			{children}
		</TransferContext.Provider>
	);
}

export function useTransfer() {
	const ctx = useContext(TransferContext);
	if (!ctx) throw new Error('useTransfer must be used within TransferProvider');
	return ctx;
}
