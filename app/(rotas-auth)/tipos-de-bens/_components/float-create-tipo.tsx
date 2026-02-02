/** @format */

'use client';

import { useRouter } from 'next/navigation';
import ModalTipo from './modal-tipo';

export default function FloatCreateTipo() {
	const router = useRouter();
	return (
		<ModalTipo isUpdating={false} onSuccess={() => router.refresh()} />
	);
}
