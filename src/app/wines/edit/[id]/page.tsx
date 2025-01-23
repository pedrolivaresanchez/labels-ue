import { EditWineClient } from './edit-client';

export default function EditWinePage({ params }: { params: { id: string } }) {
  return <EditWineClient id={params.id} />;
} 