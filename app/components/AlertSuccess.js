import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { Text } from '@/components/ui/text';
import { BookOpenCheck } from 'lucide-react';
function AlertSuccess() {
  return (
    <Alert className="gap-3 bg-green-500 border-destructive/20">
      <BookOpenCheck />
      <AlertText className="text-foreground/80" size="sm">
        Los datos de la asignación fueron enviados
      </AlertText>
    </Alert>
  );
}

export default AlertSuccess