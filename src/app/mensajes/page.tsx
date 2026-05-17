import { MessageSquare } from "lucide-react";

export default function MensajesPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-paper p-8">
      <div className="text-center max-w-xs">
        <div className="w-16 h-16 bg-card rounded-full border border-stone-200 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-stone-200" />
        </div>
        <h2 className="text-base font-bold text-ink">
          Selecciona una conversación
        </h2>
        <p className="text-sm text-stone-500 mt-1 leading-relaxed">
          Elige un chat de la lista para ver los mensajes y continuar la conversación.
        </p>
      </div>
    </div>
  );
}
