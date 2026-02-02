/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { ICreateItem, IItem } from '@/types/item';

export async function criarItem(data: ICreateItem): Promise<{
	ok: boolean;
	error: string | null;
	data: IItem | null;
	status: number;
}> {
	const session = await auth();
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	if (!session?.access_token) redirect('/login');

	try {
		const response = await fetch(`${baseURL}itens`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`,
			},
			body: JSON.stringify(data),
		});
		const dataResponse = await response.json();
		if (response.ok) {
			revalidateTag('itens');
			return { ok: true, error: null, data: dataResponse as IItem, status: response.status };
		}
		return {
			ok: false,
			error: dataResponse.message ?? 'Erro ao criar bem',
			data: null,
			status: response.status,
		};
	} catch (e) {
		return {
			ok: false,
			error: 'Erro ao criar bem',
			data: null,
			status: 500,
		};
	}
}
