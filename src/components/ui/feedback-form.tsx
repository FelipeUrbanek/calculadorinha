import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

const FEEDBACK_KEY = "lastFeedbackTime";

function canSendFeedback() {
  const last = localStorage.getItem(FEEDBACK_KEY);
  if (!last) return true;
  const diff = Date.now() - Number(last);
  return diff > 10 * 60 * 1000; // 10 minutos em ms
}

function saveFeedbackTime() {
  localStorage.setItem(FEEDBACK_KEY, Date.now().toString());
}

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSendFeedback()) {
      toast({
        title: "Aguarde",
        description: "Você só pode enviar um feedback a cada 10 minutos.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const feedbackText = formData.get("feedback") as string;

      if (!feedbackText?.trim()) {
        toast({
          title: "Erro",
          description: "Por favor, digite sua sugestão antes de enviar.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // Enviar email usando EmailJS
      await emailjs.send(
        "service_1c6g02l",
        "template_4n1lgp5",
        {
          feedback: feedbackText,
          page: window.location.pathname,
          url: window.location.href,
        },
        "01vCxUMKXY1hiZEq7"
      );

      // Salvar o horário do envio
      saveFeedbackTime();

      // Enviar para o Google Tag Manager também
      const eventData: CustomEventData = {
        event: "feedback_submit",
        feedbackType: "suggestion",
        location: window.location.pathname,
        eventLabel: feedbackText.substring(0, 100),
      };

      window.dataLayer?.push(eventData);

      // Limpar o formulário
      (e.target as HTMLFormElement).reset();

      // Mostrar mensagem de sucesso e fechar o modal
      toast({
        title: "Feedback enviado",
        description: "Obrigado por sua sugestão!",
        duration: 3000,
      });

      // Fechar o modal
      setOpen(false);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-white hover:bg-white/90 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>Sugestões</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Envie sua sugestão</DialogTitle>
          <DialogDescription className="text-center">
            Ajude a melhorar a Calculadorinha
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-form-type="feedback"
        >
          <div className="space-y-2">
            <Label htmlFor="feedback">Sua sugestão</Label>
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="Digite sua sugestão ou feedback..."
              className="min-h-[100px]"
              data-input="feedback-text"
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            data-action="submit-feedback"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
