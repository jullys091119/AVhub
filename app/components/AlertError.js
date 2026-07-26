import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { CircleX } from 'lucide-react';;
function AlertError() {
  return (
    <Alert className="gap-3 bg-red-500 border-destructive/20">
      <CircleX />
      <AlertText className="text-foreground/80" size="sm">
        Enviar nombre y/o bosquejo.
      </AlertText>
    </Alert>
  );
}

export default AlertError