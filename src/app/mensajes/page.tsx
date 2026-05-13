import { MessageSquare } from "lucide-react";

export default function MensajesPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8">
      <div className="text-center max-w-xs">
        <div className="w-16 h-16 bg-surface rounded-full border border-border flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-border" />
        </div>
        <h2 className="text-base font-bold text-text-primary">
          Selecciona una conversación
        </h2>
        <p className="text-sm text-text-secondary mt-1 leading-relaxed">
          Elige un chat de la lista para ver los mensajes y continuar la conversación.
        </p>
      </div>
    </div>
  );
}
