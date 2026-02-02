/** @format */

'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface SessionUser {
	nome: string;
	login: string;
}

const UserContext = createContext<SessionUser>({ nome: '', login: '' });

export function ListarMovimentarUserProvider({
	children,
	value,
}: {
	children: ReactNode;
	value: SessionUser;
}) {
	return (
		<UserContext.Provider value={value}>{children}</UserContext.Provider>
	);
}

export function useListarMovimentarUser() {
	return useContext(UserContext);
}
