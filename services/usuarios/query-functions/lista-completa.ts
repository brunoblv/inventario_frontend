/** @format */

import { IRespostaUsuario, IUsuario } from "@/types/usuario";

export async function listaCompleta(access_token: string): Promise<IRespostaUsuario> {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const res = await fetch(`${baseURL}usuarios/lista-completa`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		});
		const data = await res.json();
		if (!res.ok) {
			return {
				ok: false,
				error: (data as { message?: string })?.message ?? 'Erro ao buscar usuários',
				data: null,
				status: res.status,
			};
		}
		const lista = Array.isArray(data) ? data : [];
		return {
			ok: true,
			error: null,
			data: lista as IUsuario[],
			status: 200,
		};
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			error: 'Não foi possível buscar a lista de usuários.',
			data: null,
			status: 500,
		};
	}
}
