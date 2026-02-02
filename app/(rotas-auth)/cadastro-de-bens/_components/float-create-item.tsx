/** @format */

'use client';

import { useRouter } from 'next/navigation';
import ModalItem from './modal-item';

export default function FloatCreateItem() {
	const router = useRouter();
	return (
		<ModalItem isUpdating={false} onSuccess={() => router.refresh()} />
	);
}
